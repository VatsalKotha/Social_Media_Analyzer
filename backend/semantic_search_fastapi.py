from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import time

# ✅ Load model only once at startup
print("Loading Sentence Transformer model...")
start_time = time.time()
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
print(f"✅ Model loaded in {time.time() - start_time:.2f} seconds")

# ✅ Load dataset once
print("Loading dataset...")
with open("data.jsonl", "r", encoding="utf-8") as file:
    data = [json.loads(line)["data"] for line in file]
df = pd.DataFrame(data)
print(f"✅ Dataset loaded: {len(df)} posts")

# ✅ Precompute embeddings once & store in FAISS index
print("Computing embeddings...")
post_texts = df["title"] + " " + df["selftext"]
post_embeddings = embedding_model.encode(post_texts.tolist(), convert_to_numpy=True)

index = faiss.IndexFlatL2(post_embeddings.shape[1])
index.add(post_embeddings)
print(f"✅ FAISS index built with {index.ntotal} entries")

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    url: str
    query: str

@app.post("/semantic-search")
async def semantic_search(search: SearchQuery):
    """
    Performs semantic search based on a given URL and query.
    """
    # ✅ Directly find posts related to URL
    url_matched_posts = df[df["url"] == search.url]
    if url_matched_posts.empty:
        return {"message": "No posts found for the given URL."}

    # ✅ Convert query to embedding for fast search
    query_embedding = embedding_model.encode([search.query], convert_to_numpy=True)

    # ✅ Find most similar posts (fast FAISS search)
    _, similar_post_ids = index.search(query_embedding, k=5)
    relevant_posts = df.iloc[similar_post_ids[0]].to_dict(orient="records")

    return {
        "matched_url_posts": url_matched_posts.to_dict(orient="records"),
        "semantic_results": relevant_posts
    }
