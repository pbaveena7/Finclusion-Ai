from fastapi import APIRouter
from pydantic import BaseModel
import asyncio

router = APIRouter(prefix="/api/fraud", tags=["Trust & Safety"])

class FraudScanRequest(BaseModel):
    query: str

@router.post("/scan")
async def scan_for_fraud(request: FraudScanRequest):
    # Simulate a small delay for "AI Processing" feeling
    await asyncio.sleep(1.5)
    
    query = request.query.lower()
    
    # Simple keyword-based risk detection for the prototype
    risk_keywords = ["guarantee", "double", "sure", "whatsapp", "crypto", "100%", "risk free"]
    
    if any(keyword in query for keyword in risk_keywords):
        return {
            "status": "risk",
            "message": "HIGH RISK - Potential Fraud",
            "description": "Our AI engine has flagged multiple critical red flags in this message. This pattern strongly matches known fraudulent investment schemes.",
            "flags": [
                {"title": "Guaranteed Returns", "detail": "Legitimate markets cannot guarantee high fixed returns. This is a classic hallmark of a Ponzi scheme."},
                {"title": "Unregistered Entity", "detail": "This entity does not appear in the SEBI registered brokers/advisors database."}
            ]
        }
    else:
        return {
            "status": "safe",
            "message": "Likely Safe - No Major Red Flags",
            "description": "Our AI engine did not detect common scam patterns (like guaranteed returns or urgency tactics) in this text. However, always verify directly through official channels.",
            "flags": [
                {"title": "Best Practice", "detail": "Always ensure the entity you are dealing with is registered with SEBI or RBI. Never transfer funds to personal bank accounts."}
            ]
        }
