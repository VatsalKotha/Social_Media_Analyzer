from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse  # ✅ Import FileResponse
import pandas as pd
from fpdf import FPDF
import json
from collections import Counter
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import groq
from datetime import datetime
from typing import Optional, List, Dict
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = "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"
client = groq.Groq(api_key=GROQ_API_KEY)

# Load JSON Data
with open("processed_data.json", "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)
df["timestamp"] = pd.to_datetime(df["timestamp"])

# 🔹 1️⃣ Endpoint: Highest Activity Time (from time-series data)
@app.get("/activity-insight")
async def activity_insight():
    """Get the post with the highest activity time."""
    if df.empty:
        raise HTTPException(status_code=404, detail="No data available.")

    # ✅ Ensure post_count is computed
    time_series = df.resample("D", on="timestamp").size().reset_index(name="post_count")

    # ✅ Find the highest activity time
    highest_activity = time_series.loc[time_series["post_count"].idxmax()]

    return {
        "insight": f"Highest activity occurred on {highest_activity['timestamp'].strftime('%Y-%m-%d')} with {highest_activity['post_count']} posts."
    }

@app.get("/engagement-insight")
async def engagement_insight():
    """Get the period with the highest engagement."""
    if df.empty:
        raise HTTPException(status_code=404, detail="No data available.")

    highest_engagement = df.loc[df["num_comments"].idxmax()]
    return {
        "insight": f"The post '{highest_engagement['title']}' had the highest engagement with {highest_engagement['num_comments']} comments."
    }

@app.get("/score-insight")
async def score_insight():
    """Get the post with the highest score."""
    if df.empty:
        raise HTTPException(status_code=404, detail="No data available.")

    top_scoring_post = df.loc[df["score"].idxmax()]
    return {
        "insight": f"The post '{top_scoring_post['title']}' received the highest score of {top_scoring_post['score']}."
    }

@app.get("/api/topic-trends")
async def get_trending_subreddits():
    """Fetch trending subreddits with count from JSON data (entire dataset)."""
    try:
        # Count occurrences of subreddits in the entire dataset
        subreddit_count: Dict[str, int] = Counter(post["subreddit"] for post in data)

        # Sort by count (descending) and take top 15
        trending_subreddits = [{"topic": subreddit, "count": count} for subreddit, count in subreddit_count.most_common(15)]

        if not trending_subreddits:
            return {"message": "No trending subreddits found."}

        return trending_subreddits
    
    except Exception as e:
        print(f"Error fetching trending subreddits: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching trending subreddits.")

@app.get("/trending-topics-story")
async def get_trending_topics_story():
    """
    AI-generated interpretation of trending topics.
    """
    trending_response = await get_trending_topics()
    top_topics = ", ".join([f"{topic['word']} ({topic['count']} mentions)" for topic in trending_response["trending_topics"]])

    prompt = f"""
    Based on recent discussions, the top trending topics are {top_topics}.
    
    Please analyze and provide a **detailed story** about why these topics are popular and their significance.
    """

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return {"story": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/coordinated-posts")
async def get_coordinated_posts(
    start_date: str = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(None, description="End date in YYYY-MM-DD format"),
    min_engagement: int = Query(10, description="Minimum engagement threshold"),
    subreddit: str = Query(None, description="Filter by subreddit")
):
    """Fetch posts that have high engagement & coordinated activity"""
    try:
        filtered_df = df.copy()
        
        # Convert timestamp column to datetime
        filtered_df["timestamp"] = pd.to_datetime(filtered_df["timestamp"])

        # Apply date filter
        if start_date:
            filtered_df = filtered_df[filtered_df["timestamp"] >= pd.to_datetime(start_date)]
        if end_date:
            filtered_df = filtered_df[filtered_df["timestamp"] <= pd.to_datetime(end_date)]

        # Apply engagement filter (Score + Comments)
        filtered_df["engagement"] = filtered_df["score"] + filtered_df["num_comments"]
        filtered_df = filtered_df[filtered_df["engagement"] >= min_engagement]

        # Apply subreddit filter if provided
        if subreddit:
            filtered_df = filtered_df[filtered_df["subreddit"].str.lower() == subreddit.lower()]

        # Select relevant columns
        filtered_df = filtered_df[["post_id", "title", "subreddit", "author", "score", "num_comments", "timestamp", "url"]]
        
        return filtered_df.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching coordinated posts: {str(e)}")

@app.get("/api/generate-trends-pdf")
async def generate_trends_pdf():
    """Generate a PDF report with post trends and engagement insights."""
    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", style="B", size=16)
        pdf.cell(200, 10, "Trending Posts & Engagement Report", ln=True, align="C")

        # ✅ FIX: Ensure safe encoding
        text_content = "This report summarizes the most engaged posts and trends."
        pdf.multi_cell(0, 10, text_content.encode("latin-1", "replace").decode("latin-1"))

        pdf.set_font("Arial", size=12)
        pdf.ln(10)
        pdf.cell(200, 10, "This report summarizes the most engaged posts and trends.", ln=True)

        # Top 5 most engaged posts
        df["engagement"] = df["score"] + df["num_comments"]
        top_posts = df.nlargest(5, "engagement")[["title", "subreddit", "author", "engagement"]]

        pdf.ln(5)
        pdf.set_font("Arial", style="B", size=14)
        pdf.cell(200, 10, "Top 5 Most Engaged Posts", ln=True)

        pdf.set_font("Arial", size=11)
        for _, row in top_posts.iterrows():
            pdf.ln(5)
            post_text = f"{row['title']} ({row['subreddit']}) - {row['engagement']} Engagement"
            
            # ✅ FIX: Apply encoding fix before adding text
            pdf.multi_cell(0, 10, post_text.encode("latin-1", "replace").decode("latin-1"))

        # Generate a chart for engagement trends
        plt.figure(figsize=(8, 4))
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        engagement_over_time = df.groupby(df["timestamp"].dt.date)["engagement"].sum()
        plt.plot(engagement_over_time.index, engagement_over_time.values, marker="o", linestyle="-", color="b")
        plt.xlabel("Date")
        plt.ylabel("Total Engagement")
        plt.title("Engagement Trends Over Time")
        plt.xticks(rotation=45)
        plt.tight_layout()
        chart_path = "engagement_chart.png"
        plt.savefig(chart_path)
        plt.close()

        # Add image to PDF
        pdf.add_page()
        pdf.set_font("Arial", style="B", size=14)
        pdf.cell(200, 10, "Engagement Trends Over Time", ln=True)
        pdf.image(chart_path, x=10, y=None, w=180)

        # Save PDF
        pdf_path = "trends_report.pdf"
        pdf.output(pdf_path)

        return FileResponse(pdf_path, media_type="application/pdf", filename="Trends_Report.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Trending Posts Backend is Running!"}