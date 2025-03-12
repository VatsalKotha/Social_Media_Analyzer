from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import openai

# Set up OpenAI API for Groq
openai.api_base = "https://api.groq.com/v1"
openai.api_key = "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"

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load and preprocess data
with open("processed_data.json", "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)
df["timestamp"] = pd.to_datetime(df["timestamp"])

@app.get("/generate-ai-insights")
async def generate_ai_insights():
    """
    Uses Llama 3-8B to generate AI-powered analysis on social media trends.
    """
    # Aggregate Data
    trends = df.groupby("subreddit")["score"].sum().reset_index()
    trends_sorted = trends.sort_values("score", ascending=False).head(5)

    # Prepare input for Llama
    prompt = f"""
    Analyze the following social media trends:
    {trends_sorted.to_dict(orient="records")}
    
    Generate an in-depth analysis, highlighting key insights on user engagement, misinformation trends, and any emerging patterns.
    """

    try:
        response = openai.ChatCompletion.create(
            model="llama3-8b",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        insights = response["choices"][0]["message"]["content"]
        return {"insights": insights}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
