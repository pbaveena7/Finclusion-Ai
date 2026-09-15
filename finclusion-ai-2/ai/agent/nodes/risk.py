from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from ai.agent.state import AgentState

def verify_risk(state: AgentState) -> Dict[str, Any]:
    """
    The Risk Checker Firewall.
    Analyzes the generator's drafted response to ensure no guaranteed returns,
    fabricated facts, scams, or overly optimistic projections exist.
    """
    messages = state["messages"]
    if not messages or not isinstance(messages[-1], AIMessage):
        return {"risk_passed": True, "risk_flags": []}
        
    draft_response = messages[-1].content
    attempts = state.get("self_correction_attempts", 0)
    
    try:
        llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)
    except Exception:
        # Fallback if no LLM, run simple regex/keyword check
        banned = ["guaranteed return", "100% safe", "buy this stock", "sure shot", "no risk", "guaranteed profit", "will definitely go up"]
        if any(b in draft_response.lower() for b in banned):
            return {"risk_passed": False, "risk_flags": ["Contains banned promotional or scam phrases."], "self_correction_attempts": attempts + 1}
        return {"risk_passed": True, "risk_flags": [], "self_correction_attempts": attempts}

    system_msg = SystemMessage(
        content=(
            "You are a strict compliance officer for a financial AI. Analyze the drafted response. "
            "Does it contain ANY claims of 'guaranteed returns', explicit personalized advice to 'buy' or 'sell' a specific stock, "
            "overly optimistic financial projections without caveats, signs of scams, or does it fabricate market data? "
            "Respond ONLY with 'PASS' if it is completely safe and objective, or 'FAIL: [reason]' if it violates safety guidelines."
        )
    )
    
    try:
        eval_response = llm.invoke([system_msg, HumanMessage(content=draft_response)])
        result = eval_response.content.strip()
    except Exception as e:
        # If API fails for some reason during invocation, fail safely
        return {"risk_passed": False, "risk_flags": [f"Risk evaluation API failure: {str(e)}"], "self_correction_attempts": attempts + 1}
    
    if result.startswith("FAIL"):
        return {"risk_passed": False, "risk_flags": [result], "self_correction_attempts": attempts + 1}
        
    return {"risk_passed": True, "risk_flags": [], "self_correction_attempts": attempts}
