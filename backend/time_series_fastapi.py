from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (you can restrict this later)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Load and preprocess data
with open("processed_data.json", "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Convert timestamp to datetime
df["timestamp"] = pd.to_datetime(df["timestamp"])

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
