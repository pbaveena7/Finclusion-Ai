from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from ai.agent.state import AgentState

def verify_risk(state: AgentState) -> Dict[str, Any]:
    """
    The Risk Checker Firewall.
    Analyzes the generator's drafted response to ensure no guaranteed returns 
    or fabricated facts exist before it reaches the user.
    """
    messages = state["messages"]
    if not messages or not isinstance(messages[-1], AIMessage):
        return {"risk_passed": True, "risk_flags": []}
        
    draft_response = messages[-1].content
    
    try:
        llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)
    except Exception:
        # Fallback if no LLM, run simple regex/keyword check
        banned = ["guaranteed return", "100% safe", "buy this stock", "sure shot"]
        if any(b in draft_response.lower() for b in banned):
            return {"risk_passed": False, "risk_flags": ["Contains banned phrases."]}
        return {"risk_passed": True, "risk_flags": []}

    system_msg = SystemMessage(
        content=(
            "You are a strict compliance officer. Analyze the drafted response. "
            "Does it contain ANY claims of 'guaranteed returns', explicit personalized advice to 'buy' a stock, "
            "or does it fabricate market data? "
            "Respond ONLY with 'PASS' if it is safe, or 'FAIL: [reason]' if it violates safety."
        )
    )
    
    eval_response = llm.invoke([system_msg, HumanMessage(content=draft_response)])
    result = eval_response.content.strip()
    
    if result.startswith("FAIL"):
        return {"risk_passed": False, "risk_flags": [result]}
        
    return {"risk_passed": True, "risk_flags": [], "self_correction_attempts": state.get("self_correction_attempts", 0)}
