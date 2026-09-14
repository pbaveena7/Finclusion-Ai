from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from typing import Literal

from ai.agent.state import AgentState
from ai.agent.nodes.intent import detect_intent
from ai.agent.nodes.rag_node import fetch_rag_context
from ai.agent.nodes.router import route_request
from ai.agent.nodes.generator import generate_response
from ai.agent.nodes.risk import verify_risk
from ai.agent.nodes.citation import attach_citations
from ai.agent.nodes.mcp_tools import MCP_TOOLS

def check_intent_routing(state: AgentState) -> Literal["mcp_router", "rag_retriever"]:
    """Routes based on detected intent."""
    intent = state.get("detected_intent")
    # If the question is purely educational, bypass MCP tools and go straight to RAG
    if intent == "educational":
        return "rag_retriever"
    return "mcp_router"

def should_execute_tools(state: AgentState) -> Literal["mcp_executor", "rag_retriever"]:
    """Checks if the LLM router decided to use tools."""
    messages = state["messages"]
    last_message = messages[-1]
    
    if last_message.tool_calls:
        return "mcp_executor"
    return "rag_retriever"

def evaluate_risk(state: AgentState) -> Literal["citation_attacher", "financial_reasoner"]:
    """The Risk Firewall loop."""
    if state.get("risk_passed", True):
        return "citation_attacher"
    
    attempts = state.get("self_correction_attempts", 0)
    if attempts > 2:
        # If it keeps failing, bypass to citation with a canned warning (handled in citation or UI)
        return "citation_attacher"
        
    # Loop back to reasoner for self-correction
    return "financial_reasoner"

def build_mega_graph():
    """
    Compiles the massive 11-step Finclusion AI Directed Acyclic Graph (DAG).
    """
    workflow = StateGraph(AgentState)
    
    # 1. Add Nodes
    workflow.add_node("intent_detector", detect_intent)
    workflow.add_node("mcp_router", route_request)
    workflow.add_node("mcp_executor", ToolNode(MCP_TOOLS))
    workflow.add_node("rag_retriever", fetch_rag_context)
    workflow.add_node("financial_reasoner", generate_response)
    workflow.add_node("risk_checker", verify_risk)
    workflow.add_node("citation_attacher", attach_citations)
    
    # 2. Define Edges & Flow
    workflow.set_entry_point("intent_detector")
    
    # Intent routes to either MCP or RAG directly
    workflow.add_conditional_edges("intent_detector", check_intent_routing)
    
    # MCP Router decides if tools are needed
    workflow.add_conditional_edges("mcp_router", should_execute_tools)
    
    # Tool execution always flows to RAG next to enrich the state
    workflow.add_edge("mcp_executor", "rag_retriever")
    
    # RAG flows to the Reasoner
    workflow.add_edge("rag_retriever", "financial_reasoner")
    
    # Reasoner MUST flow through the Risk Checker Firewall
    workflow.add_edge("financial_reasoner", "risk_checker")
    
    # Risk Checker conditional loop (Self-Correction)
    workflow.add_conditional_edges("risk_checker", evaluate_risk)
    
    # Citation is the final step
    workflow.add_edge("citation_attacher", END)
    
    return workflow.compile()

app = build_mega_graph()
