from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI

router = APIRouter()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    # Fallback to GROQ_API_KEY just in case, but prefer OPENAI
    api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("WARNING: No OPENAI_API_KEY found in .env")

client = OpenAI(api_key=api_key)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    language: Optional[str] = "en-IN"

@router.post("")
async def chat_endpoint(request: ChatRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured on server.")

    lang_map = {
        'en-IN': 'English',
        'hi-IN': 'Hindi',
        'ta-IN': 'Tamil',
        'te-IN': 'Telugu',
        'bn-IN': 'Bengali',
        'mr-IN': 'Marathi',
        'gu-IN': 'Gujarati',
        'kn-IN': 'Kannada',
        'ml-IN': 'Malayalam',
        'pa-IN': 'Punjabi',
        'or-IN': 'Odia'
    }
    lang_str = lang_map.get(request.language, 'English')
    
    # Extract latest query
    latest_query = request.messages[-1].content if request.messages else ""
    if not latest_query:
        return {"response": "Please ask a question."}

    # Pass the query, history, and language to the Intelligent Router
    try:
        from app.agents.router import agent_router
        # The history passed to the router shouldn't include the latest query itself (or the router will handle it)
        # We pass the full history (minus system messages if any, though frontend only sends user/assistant)
        history_for_agent = request.messages[:-1] 
        
        response = await agent_router.route_query(latest_query, history_for_agent, lang_str)
        return {"response": response}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
