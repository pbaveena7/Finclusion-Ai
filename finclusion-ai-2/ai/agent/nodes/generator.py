from typing import Dict, Any
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from ai.agent.state import AgentState

def generate_response(state: AgentState) -> Dict[str, Any]:
    """
    The Generator Node.
    Called after the router (and potentially MCP tools) have gathered context.
    Synthesizes the final, educational, risk-aware response.
    """
    try:
        # In production, this would be our fine-tuned Hugging Face model
        llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.3)
    except Exception:
        return {"messages": [{"role": "assistant", "content": "Error: LLM not initialized."}]}

    system_msg = SystemMessage(
        content=(
            "You are Finclusion AI, an expert financial educator in India. "
            "Using the conversation history and any data fetched from the tools, "
            "provide a highly educational, simple, and factually grounded answer. "
            "CRITICAL: Never guarantee returns or provide personalized financial advice. "
            "Always explain risks and use INR (₹)."
        )
    )
    
    # We pass the entire message history (including tool responses) to the LLM
    messages = [system_msg] + list(state["messages"])
    
    response = llm.invoke(messages)
    
    return {"messages": [response]}
