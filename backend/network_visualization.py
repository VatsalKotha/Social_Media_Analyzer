# from fastapi import FastAPI
# from fastapi.responses import FileResponse
# import json
# import networkx as nx
# from pyvis.network import Network
# import os
# app = FastAPI()

# def generate_network():
#     data_file = "data.jsonl"
#     posts = []

#     # Load JSONL data
#     with open(data_file, "r", encoding="utf-8") as file:
#         for line in file:
#             post = json.loads(line)
#             posts.append(post["data"])

#     # Extract users and shared content
#     graph_data = {}
#     for post in posts:
#         author = post.get("author", "Unknown")
#         content = post.get("selftext", "") + " " + post.get("title", "") + " " + post.get("url", "")

#         words = set(content.lower().split())  # Tokenize content

#         # Build a mapping for hashtags/URLs
#         for word in words:
#             if word.startswith("#") or "http" in word:
#                 if word not in graph_data:
#                     graph_data[word] = set()
#                 graph_data[word].add(author)

#     # Create Graph
#     G = nx.Graph()

#     for key, users in graph_data.items():
#         users = list(users)
#         for i in range(len(users)):
#             for j in range(i + 1, len(users)):
#                 G.add_edge(users[i], users[j], label=key)

#     # Pyvis Visualization
#     net = Network(height="600px", width="100%", bgcolor="#0F172A", font_color="white")
#     net.from_nx(G)
#     net.write_html("network.html")

# @app.get("/network")
# def get_network():
#     generate_network()  # Call your function
#     if os.path.exists("network.html"):
#         return FileResponse("network.html")
#     return {"error": "network.html not found"} # Serve the generated HTML file

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
import pandas as pd
import networkx as nx
from pyvis.network import Network
import os
from fastapi.responses import HTMLResponse
from datetime import datetime

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset
with open("data.jsonl", "r", encoding="utf-8") as file:
    data = [json.loads(line)["data"] for line in file]
net_df = pd.DataFrame(data)

@app.get("/network")
async def get_network_graph(
    query: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    subreddits: Optional[str] = Query(None),
    limit: int = Query(100)
):
    """Generate a filtered network graph of authors and subreddits."""
    try:
        # Apply filters
        filtered_net_df = net_df.copy()
        
        if query:
            filtered_net_df = filtered_net_df[
                filtered_net_df["title"].str.contains(query, case=False, na=False) | 
                filtered_net_df["selftext"].str.contains(query, case=False, na=False)
            ]
        
        if start_date:
            start_timestamp = datetime.fromisoformat(start_date).timestamp()
            filtered_net_df = filtered_net_df[filtered_net_df["created_utc"] >= start_timestamp]
        
        if end_date:
            end_timestamp = datetime.fromisoformat(end_date).timestamp()
            filtered_net_df = filtered_net_df[filtered_net_df["created_utc"] <= end_timestamp]

        if subreddits:
            subreddit_list = [s.strip() for s in subreddits.split(",")]
            filtered_net_df = filtered_net_df[filtered_net_df["subreddit"].isin(subreddit_list)]

        filtered_net_df = filtered_net_df.head(limit)  # Apply result limit
        
        # Generate graph
        G = nx.Graph()
        links = []
        
        for _, row in filtered_net_df.iterrows():
            author = row["author"]
            subreddit = row["subreddit"]
            G.add_edge(author, subreddit, weight=1)
            links.append({"source": author, "target": subreddit, "value": 1})
        
        # Convert to Pyvis graph
        net = Network(height="600px", width="100%", bgcolor="#0F172A", font_color="white")
        net.from_nx(G)
        net.write_html("network.html")

        return {"nodes": list(G.nodes), "links": links}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/network-graph-html", response_class=HTMLResponse)
async def get_network_html():
    """Return the generated network graph as an HTML response."""
    if os.path.exists("network.html"):
        with open("network.html", "r", encoding="utf-8") as file:
            return HTMLResponse(content=file.read())
    return HTMLResponse(content="<h1>Error: Network graph not found</h1>", status_code=404)