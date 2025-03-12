from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import pandas as pd
import groq

# Set up Groq API client (🔴 Replace with your API key!)
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

# Load dataset
with open("processed_data.json", "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)
df["timestamp"] = pd.to_datetime(df["timestamp"])

chat_history = []

# Define Request Models
class SearchQuery(BaseModel):
    query: str

class ChatbotQuery(BaseModel):
    message: str
    

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

@app.post("/chatbot")
async def chatbot_response(query: ChatbotQuery):
    """
    AI chatbot for Q&A-based analysis with conversation memory.
    """
    global chat_history

    # Append user message to history
    chat_history.append({"role": "user", "content": query.message})

    prompt = f"""
    You are an AI chatbot helping users analyze social media trends.
    Maintain the conversation context and answer based on previous questions.

    Conversation history:
    {chat_history}

    Reply concisely and accurately.
    """

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=chat_history,
            max_tokens=300
        )

        chatbot_reply = response.choices[0].message.content
        chat_history.append({"role": "assistant", "content": chatbot_reply})

        return {"response": chatbot_reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))