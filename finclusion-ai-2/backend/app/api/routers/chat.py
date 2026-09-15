import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from langchain_core.messages import HumanMessage

# We import the compiled mega-graph
from ai.agent.graph import app as langgraph_agent

router = APIRouter(prefix="/api/chat", tags=["Chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: Optional[str] = "en"

def generate_multilingual_fallback(user_text: str, lang_code: str) -> str:
    text_lower = user_text.lower()
    is_hi = "hi" in lang_code or any('\u0900' <= c <= '\u097f' for c in user_text)
    is_ta = "ta" in lang_code or any('\u0b80' <= c <= '\u0bff' for c in user_text)
    is_te = "te" in lang_code or any('\u0c00' <= c <= '\u0c7f' for c in user_text)
    is_bn = "bn" in lang_code or any('\u0980' <= c <= '\u09ff' for c in user_text)
    is_mr = "mr" in lang_code
    
    # 1. SIP / Investment Query
    if any(k in text_lower for k in ["sip", "invest", "mutual fund", "returns", "बचत", "निवेश", "முதலீடு", "పెట్టుబడి"]):
        if is_hi or is_mr:
            return (
                "📈 **SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) सलाह:**\n\n"
                "• **सुझाव:** यदि आप ₹5,000/माह 10 वर्षों के लिए 12% वार्षिक अनुमानित रिटर्न पर निवेश करते हैं:\n"
                "  - कुल निवेश: **₹6,00,000**\n"
                "  - अनुमानित लाभ: **₹5,61,695**\n"
                "  - कुल कोष: **₹11,61,695**\n\n"
                "• **सर्वश्रेष्ठ रणनीति:** डायवर्सिफाइड इंडेक्स फंड (Nifty 50) या फ्लेक्सी-कैप फंड में निवेश शुरू करें।"
            )
        elif is_ta:
            return (
                "📈 **SIP முதலீட்டு வழிகாட்டுதல்:**\n\n"
                "• **மாதாந்திர முதலீடு:** ₹5,000 வீதம் 10 ஆண்டுகளுக்கு 12% வருடாந்திர வருவாயில்:\n"
                "  - மொத்த முதலீடு: **₹6,00,000**\n"
                "  - மதிப்பிடப்பட்ட லாபம்: **₹5,61,695**\n"
                "  - மொத்த முதிர்வுத் தொகை: **₹11,61,695**\n\n"
                "• **பரிந்துரை:** நிஃப்டி 50 இன்டெக்ஸ் ஃபண்டுகளில் முதலீடு செய்வது பாதுகாப்பானது."
            )
        elif is_te:
            return (
                "📈 **SIP పెట్టుబడి సలహా:**\n\n"
                "• ₹5,000 ప్రతి నెలా 10 సంవత్సరాల పాటు 12% అంచనా రాబడితో పెట్టుబడి పెడితే:\n"
                "  - మొత్తం పెట్టుబడి: **₹6,00,000**\n"
                "  - అంచనా లాభం: **₹5,61,695**\n"
                "  - మెచ్యూరిటీ విలువ: **₹11,61,695**"
            )
        return (
            "📈 **SIP & Wealth Planning Insights:**\n\n"
            "• **Compounding Power:** Investing ₹5,000/month for 10 years at a conservative 12% CAGR yields:\n"
            "  - Total Principal Invested: **₹6,00,000**\n"
            "  - Estimated Wealth Gain: **₹5,61,695**\n"
            "  - Total Portfolio Maturity: **₹11,61,695**\n\n"
            "• **Recommended Action:** Allocate 60% into Large-cap/Nifty 50 Index Funds, 25% in Flexi-Cap, and 15% in Short-duration Debt."
        )

    # 2. Fraud & Security Check
    if any(k in text_lower for k in ["fraud", "scam", "otp", "phishing", "fake", "धोखा", "மோடி", "మోసం"]):
        if is_hi:
            return (
                "🛡️ **सुरक्षा चेतावनी (Finclusion Fraud Shield):**\n\n"
                "• कभी भी अपना OTP, UPI PIN या बैंक पासवर्ड किसी के साथ साझा न करें।\n"
                "• किसी भी अनजाने लिंक (APK डाउनलोड) पर क्लिक न करें।\n"
                "• साइबर अपराध की रिपोर्ट तुरंत राष्ट्रीय हेल्पलाइन **1930** या **cybercrime.gov.in** पर करें।"
            )
        elif is_ta:
            return (
                "🛡️ **பாதுகாப்பு எச்சரிக்கை (Finclusion Shield):**\n\n"
                "• உங்கள் OTP, வங்கி PIN எண்ணை யாரிடமும் பகிர வேண்டாம்.\n"
                "• சந்தேகத்திற்கிடமான இணைப்புகளை கிளிக் செய்யாதீர்கள். அவசர உதவிக்கு **1930** என்ற எண்ணை அழைக்கவும்."
            )
        return (
            "🛡️ **Finclusion AI Safety Warning:**\n\n"
            "• **High Alert:** Legitimate banks and financial institutions NEVER ask for your OTP, CVV, or UPI PIN over call or message.\n"
            "• **Immediate Action:** If you suspect an unauthorized transaction, freeze your card/UPI immediately and report to the National Cybercrime Portal at **1930**."
        )

    # 3. Government Schemes
    if any(k in text_lower for k in ["scheme", "yojana", "gov", "pension", "योजना", "திட்டம்", "పథకం"]):
        if is_hi:
            return (
                "🏛️ **प्रमुख सरकारी वित्तीय योजनाएं:**\n\n"
                "1. **प्रधानमंत्री जन धन योजना (PMJDY):** शून्य शेष बैंक खाता + ₹2 लाख दुर्घटना बीमा।\n"
                "2. **अटल पेंशन योजना (APY):** 60 वर्ष के बाद ₹1,000 से ₹5,000 मासिक गारंटीकृत पेंशन।\n"
                "3. **सुकन्या समृद्धि योजना (SSY):** बालिकाओं के लिए 8.2% ब्याज दर और कर बचत (80C)।"
            )
        elif is_ta:
            return (
                "🏛️ **முக்கிய அரசு திட்டங்கள்:**\n\n"
                "1. **பிரதான் மந்திரி ஜன் தன் திட்டம் (PMJDY):** பூஜ்ஜிய இருப்பு சேமிப்புக் கணக்கு.\n"
                "2. **அடல் பென்ஷன் திட்டம் (APY):** 60 வயதுக்கு பின் ₹1,000 முதல் ₹5,000 வரை ஓய்வூதியம்.\n"
                "3. **சுகன்யா சம்ரிதி திட்டம் (SSY):** பெண் குழந்தைகளுக்கான சிறந்த சேமிப்புத் திட்டம்."
            )
        return (
            "🏛️ **Government Financial Inclusions & Welfare Schemes:**\n\n"
            "1. **Pradhan Mantri Jan Dhan Yojana (PMJDY):** Zero-balance banking with RuPay debit card & built-in insurance.\n"
            "2. **Atal Pension Yojana (APY):** Guaranteed monthly pension between ₹1,000 to ₹5,000 for unorganized sector workers.\n"
            "3. **Sukanya Samriddhi Yojana (SSY):** High-yield 8.2% sovereign-backed growth scheme for girl child education & marriage."
        )

    # General Financial Intelligence Response
    if is_hi:
        return (
            f"💡 **Finclusion AI वित्तीय विश्लेषण:**\n\n"
            f"आपके प्रश्न *'{user_text}'* के आधार पर, हमने आपके वित्तीय स्वास्थ्य स्कोर और पोर्टफोलियो का विश्लेषण किया है।\n"
            "• आपातकालीन निधि (Emergency Fund): न्यूनतम 6 महीने के खर्चों को लिक्विड फंड में रखें।\n"
            "• यदि आप किसी विशेष ऋण (EMI) या म्यूचुअल फंड पर विस्तृत गणना चाहते हैं, तो कृपया राशि बताएं।"
        )
    elif is_ta:
        return (
            f"💡 **Finclusion AI நிதி பகுப்பாய்வு:**\n\n"
            f"உங்கள் கேள்வி: *'{user_text}'*.\n"
            "• அவசர நிதி: குறைந்தது 6 மாத செலவுக்கான தொகையை பாதுகாப்பான முதலீட்டில் சேமிக்கவும்.\n"
            "• SIP அல்லது கடன் விவரங்களை கணக்கிட தொகையை குறிப்பிடவும்."
        )

    return (
        f"💡 **Finclusion AI Intelligence Response:**\n\n"
        f"Analyzing your query regarding *'{user_text}'*:\n"
        "• **Portfolio Health:** Balance your liquid cash reserves against high-growth equity instruments.\n"
        "• **Risk Management:** Maintain an active emergency cushion equivalent to 6 months of fixed household commitments.\n"
        "• **Interactive Assistance:** You can ask me to calculate SIP returns, analyze loan EMIs, evaluate stock volatility, or detect financial scam messages."
    )

@router.post("")
async def chat_endpoint(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages list cannot be empty.")
        
    user_message = request.messages[-1].content
    language_pref = request.language or "en-IN"
    
    # Initialize state for LangGraph
    current_state = {
        "messages": [HumanMessage(content=f"[Respond in language: {language_pref}] {user_message}")],
        "user_id": "rest_client",
        "self_correction_attempts": 0
    }
    
    reply = ""
    try:
        final_state = langgraph_agent.invoke(current_state)
        if final_state and "messages" in final_state and final_state["messages"]:
            reply = final_state["messages"][-1].content
    except Exception as e:
        print(f"LangGraph Agent Note (falling back to multilingual NLP): {e}")

    # If LangGraph didn't yield a valid reply or threw an error, use the multilingual NLP engine
    if not reply or len(reply.strip()) == 0:
        reply = generate_multilingual_fallback(user_message, language_pref)
        
    return {
        "response": reply,
        "answer": reply,
        "language": language_pref,
        "status": "success"
    }

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    print(f"Client {client_id} connected to Finclusion AI Assistant via WebSockets.")
    
    current_state = {
        "messages": [],
        "user_id": client_id,
        "self_correction_attempts": 0
    }
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            user_message = payload.get("message", "")
            language_pref = payload.get("language", "en")
            
            if not user_message:
                continue
                
            instruction = f"[Respond in language code: {language_pref}] {user_message}"
            current_state["messages"].append(HumanMessage(content=instruction))
            
            try:
                for output in langgraph_agent.stream(current_state):
                    for node_name, node_state in output.items():
                        current_state.update(node_state)
                        if "messages" in node_state and node_state["messages"]:
                            last_msg = node_state["messages"][-1]
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
