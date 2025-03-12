from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import pandas as pd
import groq
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

GROQ_API_KEY = "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"
client = groq.Groq(api_key=GROQ_API_KEY)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom function to load and preprocess data in chunks
def load_dataset(file_path, chunk_size=1000):
    """
    Load large JSON file in chunks to avoid memory issues
    """
    data_chunks = []
    
    # Open the file and read line by line
    with open(file_path, 'r') as f:
        # Assuming the JSON is an array of objects
        data = json.load(f)
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Convert timestamp
    if 'timestamp' in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
    
    # Create a shorter version of the text for embedding
    df['combined_text'] = df['title'] + " " + df['selftext'].fillna('')
    df['summary'] = df['selftext'].fillna('').apply(lambda x: x[:300] if len(x) > 300 else x)
    
    return df

# Load the dataset
df = load_dataset("processed_data.json")

# Initialize TF-IDF vectorizer
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
tfidf_matrix = vectorizer.fit_transform(df['combined_text'])

# Request models
class SearchQuery(BaseModel):
    query: str

class ChatbotQuery(BaseModel):
    message: str

# Custom search function
def find_similar_documents(query, top_k=3):
    """
    Find documents most similar to the query using TF-IDF and cosine similarity
    """
    # Vectorize the query
    query_vec = vectorizer.transform([query])
    
    # Calculate similarity
    similarity_scores = cosine_similarity(query_vec, tfidf_matrix)[0]
    
    # Get top k documents
    top_indices = similarity_scores.argsort()[-top_k:][::-1]
    
    return top_indices, similarity_scores[top_indices]

@app.post("/chatbot")
async def chatbot_response(query: ChatbotQuery):
    """
    AI chatbot that answers based on semantically similar dataset matches.
    """
    # Find similar posts using custom function
    top_indices, similarity_scores = find_similar_documents(query.message)
    
    # Filter for reasonably similar posts (similarity > 0.1)
    relevant_indices = [idx for i, idx in enumerate(top_indices) if similarity_scores[i] > 0.1]
    
    if not relevant_indices:
        return {"response": "Sorry, I couldn't find relevant information in the dataset."}
    
    # Get relevant posts
    relevant_posts = df.iloc[relevant_indices]
    
    # Create post summaries with character limit control
    posts = []
    total_chars = 0
    char_limit = 3000  # Set lower char limit for chatbot
    
    for _, post in relevant_posts.iterrows():
        post_text = f"Title: {post['title']}\nSummary: {post['summary']}"
        post_length = len(post_text)
        
        if total_chars + post_length > char_limit:
            break
            
        posts.append(post_text)
        total_chars += post_length
    
    post_texts = "\n\n".join(posts)

    # AI Model Prompt with strict instructions for brevity
    prompt = f"""
    You are an AI chatbot that answers based on the provided dataset.
    Here are some relevant posts related to the user's question:

    {post_texts}

    Question: {query.message}
    
    IMPORTANT INSTRUCTIONS:
    1. Provide an EXTREMELY BRIEF response (maximum 2-3 sentences)
    2. DO NOT quote directly from the dataset
    3. Synthesize the information into your own words
    4. Focus only on answering the specific question
    5. Avoid mentioning "the dataset" or "the posts"
    6. Use a natural, conversational tone
    7. If you don't have enough information, simply say so briefly
    
    Your response must be under 35 words total.
    """

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200  # Reduced max tokens to enforce brevity
        )

        return {"response": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))