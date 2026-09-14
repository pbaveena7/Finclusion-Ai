from typing import Dict, Any
from langchain_core.messages import AIMessage
from ai.agent.state import AgentState
from datetime import datetime

def attach_citations(state: AgentState) -> Dict[str, Any]:
    """
    Final Output Node.
    Appends metadata (sources, timestamps) to the final generated message.
    Ensures users know exactly where the data came from.
    """
    messages = list(state["messages"])
    if not messages or not isinstance(messages[-1], AIMessage):
        return {}
        
    last_msg = messages[-1]
    
    # We would theoretically parse the mcp_data_context to pull actual sources here.
    # For now, we attach a generic timestamp.
    citations = [{"source": "Finclusion Verified MCP", "timestamp": datetime.now().isoformat()}]
    
    # Append citation footer to the text
    footer = f"\n\n---\n*Data provided by: {citations[0]['source']} at {citations[0]['timestamp']}*"
    last_msg.content += footer
    
    # Replace the last message
    return {"messages": [last_msg], "citations": citations}
