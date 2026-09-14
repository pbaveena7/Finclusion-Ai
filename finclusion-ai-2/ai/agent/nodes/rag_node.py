from typing import Dict, Any
from ai.agent.state import AgentState
from ai.rag.retriever import FinclusionRetriever

# Instantiate retriever once globally to avoid reloading model
retriever = FinclusionRetriever()

def fetch_rag_context(state: AgentState) -> Dict[str, Any]:
    """
    RAG Pipeline. Uses FAISS Semantic Search to retrieve verified financial context.
    """
    intent = state.get("detected_intent")
    query = state.get("query", "")
    
    # Only fetch RAG context if intent requires educational grounding
    if intent in ["mutual_fund", "scheme", "educational"]:
        context = retriever.search(query)
        return {"retrieved_rag_context": f"VERIFIED CONTEXT:\n{context}"}
        
    return {"retrieved_rag_context": None}
