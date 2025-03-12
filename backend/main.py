from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import plotly.express as px
from textblob import TextBlob
import groq
import json
import time
import asyncio
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import os


app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load preprocessed data
with open('processed_data.json', 'r') as f:
    data = json.load(f)

df = pd.DataFrame(data)
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')
df.set_index('timestamp', inplace=True)

# Initialize Groq client
groq_client = groq.Client(api_key="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")

# Real-time data stream
async def event_stream():
    while True:
        new_data = df.sample(1).to_dict(orient='records')[0]
        yield f"data: {json.dumps(new_data)}\n\n"
        await asyncio.sleep(5)  # Simulate a delay (e.g., 5 seconds)
        
G = nx.Graph()

# Dictionary to store node properties
node_properties = {}

# Dictionary to store edge properties
edge_properties = {}

def load_reddit_data(file_path: str):
    """Load Reddit data from a JSONL file and create a graph using NetworkX."""
    global G, node_properties, edge_properties

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                post = json.loads(line)
                post_data = post.get("data", {})
                post_id = post_data.get("name", "")

                # Add Post node
                if post_id and post_id not in G:
                    G.add_node(post_id)
                    node_properties[post_id] = {
                        "type": "Post",
                        "id": post_id,
                        "title": post_data.get("title", ""),
                        "selftext": post_data.get("selftext", ""),
                        "created_utc": post_data.get("created_utc", 0),
                        "score": post_data.get("score", 0),
                        "num_comments": post_data.get("num_comments", 0),
                        "upvote_ratio": post_data.get("upvote_ratio", 0)
                    }

                # Add Subreddit node and edge
                subreddit = post_data.get("subreddit", "")
                if subreddit and subreddit not in G:
                    G.add_node(subreddit)
                    node_properties[subreddit] = {
                        "type": "Subreddit",
                        "name": subreddit
                    }
                if subreddit and post_id:
                    G.add_edge(post_id, subreddit)
                    edge_properties[(post_id, subreddit)] = {"type": "POSTED_IN"}

                # Add Author node and edge
                author = post_data.get("author", "")
                if author and author != "[deleted]" and author not in G:
                    G.add_node(author)
                    node_properties[author] = {
                        "type": "Author",
                        "name": author
                    }
                if author and post_id:
                    G.add_edge(post_id, author)
                    edge_properties[(post_id, author)] = {"type": "AUTHORED_BY"}

            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e}")
                continue

@app.get("/stream")
async def stream():
    return StreamingResponse(event_stream(), media_type="text/event-stream")

# Time-series analysis
@app.get("/time_series")
async def time_series():
    daily_posts = df.resample('D').size()
    data = {
        "labels": daily_posts.index.strftime('%Y-%m-%d').tolist(),
        "datasets": [
            {
                "label": "Posts",
                "data": daily_posts.tolist(),
                "borderColor": "rgb(75, 192, 192)",
                "tension": 0.1,
            },
        ],
    }
    return JSONResponse(data)

@app.get("/engagement_analysis")
async def engagement_analysis():
    df['engagement'] = df['score'] + df['num_comments']
    engagement_over_time = df.resample('D')['engagement'].sum()
    data = {
        "labels": engagement_over_time.index.strftime('%Y-%m-%d').tolist(),
        "datasets": [
            {
                "label": "Engagement",
                "data": engagement_over_time.tolist(),
                "borderColor": "rgb(255, 99, 132)",
                "tension": 0.1,
            },
        ],
    }
    return JSONResponse(data)

@app.get("/sentiment_distribution")
async def sentiment_distribution():
    df['sentiment'] = df['title'].apply(lambda x: TextBlob(x).sentiment.polarity)
    hist, bin_edges = np.histogram(df['sentiment'], bins=20)
    data = {
        "labels": [f"{bin_edges[i]:.2f}-{bin_edges[i+1]:.2f}" for i in range(len(bin_edges)-1)],
        "datasets": [
            {
                "label": "Sentiment Distribution",
                "data": hist.tolist(),
                "backgroundColor": "rgba(54, 162, 235, 0.5)",
            },
        ],
    }
    return JSONResponse(data)

# Sentiment analysis
@app.post("/analyze_sentiment")
async def analyze_sentiment(request: Request):
    body = await request.json()
    text = body.get('text')
    blob = TextBlob(text)
    sentiment = blob.sentiment
    return JSONResponse({
        "polarity": sentiment.polarity,
        "subjectivity": sentiment.subjectivity
    })

# Semantic search
@app.post("/semantic_search")
async def semantic_search(request: Request):
    body = await request.json()
    query = body.get('query')
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(df['title'])
    query_vec = vectorizer.transform([query])
    cosine_similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    related_docs_indices = cosine_similarities.argsort()[:-10:-1]
    results = df.iloc[related_docs_indices].to_dict(orient='records')
    return JSONResponse({"results": results})

# Chatbot
@app.post("/chatbot")
async def chatbot(request: Request):
    body = await request.json()
    user_input = body.get('message')
    context = df.sample(5).to_dict(orient='records') 
    prompt = f"Context: {context}\n\nUser: {user_input}\n\nAssistant:"
    response = groq_client.generate(prompt=prompt, model="mistral")
    return JSONResponse({"response": response})

# Event correlation
@app.get("/correlate_events")
async def correlate_events():
    news_api_key = "9441e5254b5944388aeb401f33977ec5"
    response = requests.get(f"https://newsapi.org/v2/everything?q=social+media&apiKey={news_api_key}")
    events = response.json().get('articles', [])
    correlated_events = [event for event in events if event['title'] in df['title'].values]
    return JSONResponse({"events": correlated_events})

@app.get("/graph")
def get_graph():
    """Return the graph data in a format suitable for visualization."""
    try:
        nodes = []
        links = []

        # Add nodes
        for node in G.nodes():
            nodes.append({
                "id": node,
                "type": node_properties[node].get("type", ""),
                "properties": node_properties[node]
            })

        # Add edges
        for edge in G.edges():
            links.append({
                "source": edge[0],
                "target": edge[1],
                "type": edge_properties[edge].get("type", "")
            })

        return {"nodes": nodes, "links": links}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
def startup_event():
    """Load the Reddit data when the application starts."""
    file_path = "data.jsonl" 
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    load_reddit_data(file_path)