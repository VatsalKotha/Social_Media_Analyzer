import os
import re
import json
from typing import Any, List, Dict, Optional
import pandas as pd
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

class SocialMediaPostAnalyzer:
    def __init__(self, groq_api_key: str):
        """
        Initialize the analyzer with Groq API
        
        Args:
            groq_api_key (str): Groq API key for Llama 3
        """
        self.client = Groq(api_key=groq_api_key)
        self.df = None
    
    def load_dataset(self, jsonl_path: str):
        """
        Load and preprocess the JSONL dataset
        
        Args:
            jsonl_path (str): Path to the JSONL file
        """
        self.df = pd.read_json(jsonl_path, lines=True)
        self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
    
    def generate_llm_insights(self, posts: List[str]) -> Dict[str, Any]:
        """
        Generate advanced insights using Groq Llama 3
        
        Args:
            posts (List[str]): List of social media posts to analyze
        
        Returns:
            Dict containing LLM-generated insights
        """
        
        prompt = f"""
        Perform a comprehensive analysis of the following social media posts:
        
        {chr(10).join(posts)}
        
        Please provide a detailed analysis including:
        1. Dominant themes and narratives
        2. Sentiment analysis breakdown
        3. Potential misinformation indicators
        4. Key emotional undertones
        5. Social and cultural context
        
        Respond in a structured JSON format with clear, concise insights.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="llama3-8b-8192",  # Updated model
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert social media trend analyst. Provide structured, insightful analysis."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            insights = json.loads(response.choices[0].message.content)
            return insights
        
        except Exception as e:
            return {"error": str(e)}
    
    def semantic_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Perform semantic search using Groq LLM
        
        Args:
            query (str): Search query
            top_k (int): Number of top results to return
        
        Returns:
            List of top matching posts
        """
        def compute_semantic_score(post: str, query: str) -> float:
            """
            Compute semantic similarity score
            
            Args:
                post (str): Social media post
                query (str): Search query
            
            Returns:
                float: Semantic similarity score
            """
            prompt = f"""
            Compare the semantic similarity between the following:
            Post: {post}
            Query: {query}
            
            Provide a similarity score from 0 to 1, considering context, meaning, and intent.
            Respond ONLY with the numerical score.
            """
            
            try:
                response = self.client.chat.completions.create(
                    model="llama3-8b-8192",  # Updated model
                    messages=[
                        {"role": "system", "content": "You are a semantic similarity evaluator."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=10,
                    temperature=0.2
                )
                
                score_text = response.choices[0].message.content.strip()
                try:
                    return float(score_text)
                except ValueError:
                    return 0.0
            except Exception:
                return 0.0
        
        if self.df is not None:
            self.df['semantic_score'] = self.df['content'].apply(
                lambda x: compute_semantic_score(x, query)
            )
            
            return (self.df.nlargest(top_k, 'semantic_score')
                    [['content', 'user', 'timestamp', 'semantic_score']]
                    .to_dict('records'))
        
        return []


class PostAnalysisRequest(BaseModel):
    posts: List[str]

class SemanticSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5


app = FastAPI(
    title="Social Media LLM Analysis Service",
    description="Advanced LLM-powered analysis of social media content",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = "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"
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable must be set")

analyzer = SocialMediaPostAnalyzer(GROQ_API_KEY)

try:
    analyzer.load_dataset('data.jsonl')
except Exception as e:
    print(f"Error loading dataset: {e}")

@app.post("/analyze/insights")
async def analyze_posts(request: PostAnalysisRequest):
    """
    Endpoint for generating LLM insights from social media posts
    
    Args:
        request (PostAnalysisRequest): Request containing list of posts
    
    Returns:
        Dict of LLM-generated insights
    """
    try:
        insights = analyzer.generate_llm_insights(request.posts)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search/semantic")
async def semantic_search(request: SemanticSearchRequest):
    """
    Endpoint for semantic search across social media posts
    
    Args:
        request (SemanticSearchRequest): Search query and optional top k results
    
    Returns:
        List of semantically similar posts
    """
    try:
        results = analyzer.semantic_search(request.query, request.top_k)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns:
        Dict with service status
    """
    return {
        "status": "healthy",
        "service": "Social Media LLM Analysis",
        "version": "1.0.0"
    }