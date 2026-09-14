from typing import TypedDict, Annotated, Sequence, Any, Dict, List, Optional
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    """
    Massively expanded LangGraph state to support the 11-step routing pipeline.
    """
    # Core Message History
    messages: Annotated[Sequence[BaseMessage], operator.add]
    
    # Intent Detection
    detected_intent: Optional[str] # e.g., 'stock', 'scheme', 'fraud', 'loan', 'educational'
    
    # RAG Context
    retrieved_rag_context: Optional[str]
    
    # MCP Tool Context
    mcp_data_context: Optional[List[Dict[str, Any]]]
    
    # Risk Enforcement
    risk_flags: Optional[List[str]]
    risk_passed: bool
    self_correction_attempts: int
    
    # Final Output Metadata
    citations: Optional[List[Dict[str, str]]] # List of {"source": "...", "timestamp": "..."}
    
    # User Profile (Loaded from DB)
    user_id: Optional[str]
    risk_tolerance: Optional[str]
    knowledge_level: Optional[str]
