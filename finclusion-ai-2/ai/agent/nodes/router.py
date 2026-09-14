from typing import Dict, Any
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from ai.agent.state import AgentState
from ai.agent.nodes.mcp_tools import MCP_TOOLS

def route_request(state: AgentState) -> Dict[str, Any]:
    """
    The Router Node.
    The LLM analyzes the conversation history and decides whether to call a tool
    or proceed to answering.
    """
    # Initialize the LLM (Using a placeholder API key, expects OPENAI_API_KEY env var in production)
    # This should ideally be the fine-tuned Hugging Face model, but for tool calling,
    # GPT-4 or Claude 3 is usually required. We'll use ChatOpenAI as standard for tool calling.
    try:
        llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)
    except Exception:
        # Fallback if no API key is set during testing
        print("Warning: LLM initialization failed (missing API key?). Using dummy router.")
        return {"messages": []}

    # Bind the MCP tools to the LLM
    llm_with_tools = llm.bind_tools(MCP_TOOLS)
    
    # Construct the routing prompt
    system_msg = SystemMessage(
        content=(
            "You are the Finclusion AI Router. Your job is to determine if you need external data "
            "to answer the user's question. If they ask about a stock, use the stock tools. "
            "If they ask about a scheme, use the scheme tool. If they ask about safety/scams, use the fraud tool. "
            "If you don't need data, you can just respond directly."
        )
    )
    
    messages = [system_msg] + list(state["messages"])
    
    # Invoke the LLM to get a response (which may contain tool_calls)
    response = llm_with_tools.invoke(messages)
    
    # Return the new message to append to the state
    return {"messages": [response]}
