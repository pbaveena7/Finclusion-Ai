from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from ai.agent.state import AgentState
import json

def detect_intent(state: AgentState) -> Dict[str, Any]:
    """
    Analyzes the latest user query and explicitly classifies it into one of the 8 domains.
    """
    # Get the last user message
    user_msg = next((msg.content for msg in reversed(state["messages"]) if isinstance(msg, HumanMessage)), "")
    
    if not user_msg:
        return {"detected_intent": "educational"}

    try:
        llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0) # Fast model for intent classification
    except Exception:
        return {"detected_intent": "educational"} # Fallback

    system_msg = SystemMessage(
        content=(
            "Classify the user's financial query into exactly ONE of these categories: "
            "stock, mutual_fund, scheme, fraud, loan, personal, educational, news. "
            "Output ONLY the category name as a raw string."
        )
    )
    
    response = llm.invoke([system_msg, HumanMessage(content=user_msg)])
    intent = response.content.strip().lower()
    
    # Validate intent
    valid_intents = {"stock", "mutual_fund", "scheme", "fraud", "loan", "personal", "educational", "news"}
    if intent not in valid_intents:
        intent = "educational"
        
    return {"detected_intent": intent}
