from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from datetime import datetime
from pydantic import BaseModel
import groq
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (you can restrict this later)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

GROQ_API_KEY = "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"
client = groq.Groq(api_key=GROQ_API_KEY)

# Load and preprocess data
with open("processed_data.json", "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Convert timestamp to datetime
df["timestamp"] = pd.to_datetime(df["timestamp"])

chat_history = []

# Define Request Models
class SearchQuery(BaseModel):
    query: str    

@app.get("/time-series")
async def get_time_series():
    # Group by date and count posts
    time_series = df.resample("D", on="timestamp").size().reset_index(name="post_count")
    return time_series.to_dict(orient="records")

@app.get("/subreddit-distribution")
async def get_subreddit_distribution():
    subreddit_counts = df["subreddit"].value_counts().reset_index()
    subreddit_counts.columns = ["subreddit", "count"]
    return subreddit_counts.to_dict(orient="records")

@app.get("/score-distribution")
async def get_score_distribution():
    return df[["score"]].to_dict(orient="records")

@app.get("/top-authors")
async def get_top_authors():
    author_counts = df["author"].value_counts().reset_index()
    author_counts.columns = ["author", "count"]
    return author_counts.head(10).to_dict(orient="records")

@app.get("/engagement-over-time")
async def get_engagement_over_time():
    engagement = df.resample("D", on="timestamp")[["score", "num_comments"]].sum().reset_index()
    return engagement.to_dict(orient="records")

@app.post("/generate-ai-insights")
async def generate_ai_insights(search_query: SearchQuery):
    """
    Generates structured AI-powered insights.
    """
    result = df[df["title"].str.contains(search_query.query, case=False, na=False) |
                df["selftext"].str.contains(search_query.query, case=False, na=False)]

    if result.empty:
        return {"insights": "No relevant posts found for this query."}

    posts = [{"title": record["title"], "content": record["selftext"], "score": record["score"]} for record in result.to_dict(orient="records")]
    post_texts = "\n\n".join([f"Title: {post['title']}\nContent: {post['content'][:500]}..." for post in posts])

    # AI Analysis Prompt
    prompt = f"""
    Analyze the following Reddit posts related to the query "{search_query.query}":

    {post_texts}

    Please provide:
    1. **A summary of main themes & narratives** (as bullet points)
    2. **Key talking points** that appear frequently
    3. **Overall sentiment score** (positive, neutral, or negative, and why)
    4. **Notable patterns or outliers**
    5. **Recommendations for further analysis**
    
    Return the response in **structured bullet points**.
    """

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )
        insights = response.choices[0].message.content
        return {"insights": insights}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
