from fastapi import FastAPI
from fastapi.responses import FileResponse
import json
import networkx as nx
from pyvis.network import Network
import os
app = FastAPI()

def generate_network():
    data_file = "data.jsonl"
    posts = []

    # Load JSONL data
    with open(data_file, "r", encoding="utf-8") as file:
        for line in file:
            post = json.loads(line)
            posts.append(post["data"])

    # Extract users and shared content
    graph_data = {}
    for post in posts:
        author = post.get("author", "Unknown")
        content = post.get("selftext", "") + " " + post.get("title", "") + " " + post.get("url", "")

        words = set(content.lower().split())  # Tokenize content

        # Build a mapping for hashtags/URLs
        for word in words:
            if word.startswith("#") or "http" in word:
                if word not in graph_data:
                    graph_data[word] = set()
                graph_data[word].add(author)

    # Create Graph
    G = nx.Graph()

    for key, users in graph_data.items():
        users = list(users)
        for i in range(len(users)):
            for j in range(i + 1, len(users)):
                G.add_edge(users[i], users[j], label=key)

    # Pyvis Visualization
    net = Network(height="600px", width="100%", bgcolor="#0F172A", font_color="white")
    net.from_nx(G)
    net.write_html("network.html")

@app.get("/network")
def get_network():
    generate_network()  # Call your function
    if os.path.exists("network.html"):
        return FileResponse("network.html")
    return {"error": "network.html not found"} # Serve the generated HTML file