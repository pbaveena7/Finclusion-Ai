import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from langchain_core.messages import HumanMessage

# We import the compiled mega-graph
from ai.agent.graph import app as langgraph_agent

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    print(f"Client {client_id} connected to Finclusion AI Assistant via WebSockets.")
    
    # Initialize basic state for this session
    # In a real app, we would load past history from DB using client_id
    current_state = {
        "messages": [],
        "user_id": client_id,
        "self_correction_attempts": 0
    }
    
    try:
        while True:
            # Receive message from React frontend
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            user_message = payload.get("message", "")
            language_pref = payload.get("language", "en") # en, hi, ta
            
            if not user_message:
                continue
                
            # Append language instruction dynamically
            instruction = f"[Respond in language code: {language_pref}] {user_message}"
            current_state["messages"].append(HumanMessage(content=instruction))
            
            # Execute the LangGraph DAG and stream intermediate steps back to UI
            try:
                # We use stream() to get updates after every node executes
                for output in langgraph_agent.stream(current_state):
                    for node_name, node_state in output.items():
                        
                        # Update our local state tracker
                        current_state.update(node_state)
                        
                        # If a node produced a new message, stream it
                        if "messages" in node_state and node_state["messages"]:
                            last_msg = node_state["messages"][-1]
                            
                            # Determine what kind of data to send to the UI
                            msg_type = "text"
                            if node_name == "mcp_executor":
                                msg_type = "tool_execution"
                            elif node_name == "citation_attacher":
                                msg_type = "citation"
                                
                            await websocket.send_json({
                                "type": msg_type,
                                "node": node_name,
                                "content": last_msg.content,
                                "citations": node_state.get("citations", [])
                            })
                            
            except Exception as e:
                await websocket.send_json({"type": "error", "content": f"Agent Execution Error: {str(e)}"})
                
    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected.")
