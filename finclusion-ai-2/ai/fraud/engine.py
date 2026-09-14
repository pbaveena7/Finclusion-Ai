import re
from typing import List, Tuple
from ai.fraud.schemas import FraudAnalysisResponse, RiskLevel

class FraudEngine:
    """
    Advanced Heuristic and Verification Fraud Engine.
    Analyzes URLs, messages, and companies for urgency, guarantees, and impersonation.
    """
    
    # Mock database of verified SEBI registered entities
    VERIFIED_ENTITIES = ["zerodha", "groww", "upstox", "angel one", "hdfc", "sbi", "icici", "reliance"]
    
    # Heuristic Patterns
    GUARANTEE_PATTERNS = [
        r"guarantee(?:d)? return", r"double your money", r"risk[- ]free", 
        r"sure shot", r"100% safe", r"fixed daily profit"
    ]
    
    URGENCY_PATTERNS = [
        r"act fast", r"limited seats", r"offer expires", 
        r"hurry", r"last chance"
    ]
    
    CRYPTO_FOREX_PATTERNS = [
        r"crypto(currency)?", r"bitcoin", r"forex trading", r"binance", r"binary options"
    ]
    
    SUSPICIOUS_URLS = [
        r"\.xyz", r"\.click", r"\.club", r"free.*", r"earn.*"
    ]

    def _check_heuristics(self, text: str) -> List[str]:
        """Runs regex patterns against the input text and collects reasons."""
        text_lower = text.lower()
        reasons = []
        
        if any(re.search(p, text_lower) for p in self.GUARANTEE_PATTERNS):
            reasons.append("Contains guaranteed-return or zero-risk language (Classic scam indicator).")
            
        if any(re.search(p, text_lower) for p in self.URGENCY_PATTERNS):
            reasons.append("Uses urgency or scarcity tactics to pressure investment.")
            
        if any(re.search(p, text_lower) for p in self.CRYPTO_FOREX_PATTERNS):
            reasons.append("Mentions unregulated Crypto/Forex trading.")
            
        if "http" in text_lower and any(re.search(p, text_lower) for p in self.SUSPICIOUS_URLS):
            reasons.append("Contains suspicious top-level domains or URL structures.")
            
        return reasons

    def _verify_entity(self, text: str) -> Tuple[bool, str]:
        """Checks if the input mentions a verified entity."""
        text_lower = text.lower()
        
        for entity in self.VERIFIED_ENTITIES:
            if entity in text_lower:
                return True, f"Matched registered entity: {entity.upper()}."
                
        return False, "Not found in SEBI or RBI registered entity database."

    def analyze(self, input_data: str) -> FraudAnalysisResponse:
        """
        Runs the full analysis pipeline.
        CRITICAL RULE: If the entity is NOT verified, it can NEVER be LOW risk.
        """
        reasons = self._check_heuristics(input_data)
        is_verified, verification_msg = self._verify_entity(input_data)
        
        # Scoring Logic
        if len(reasons) >= 2:
            risk = RiskLevel.HIGH
            action = "DO NOT INVEST. Severe red flags detected. Report to authorities."
        elif len(reasons) == 1:
            risk = RiskLevel.HIGH
            action = "HIGHLY SUSPICIOUS. Proceed with extreme caution and seek professional advice."
        else:
            # 0 heuristic flags found. Apply strict verification rule.
            if is_verified:
                risk = RiskLevel.LOW
                reasons.append("No obvious red flags detected.")
                action = "Appears legitimate, but always read offer documents carefully."
            else:
                risk = RiskLevel.MEDIUM
                reasons.append("No obvious red flags, BUT entity is unregistered/unverified.")
                action = "UNVERIFIED ENTITY. Do not transfer funds until you can verify their SEBI registration number."
                
        return FraudAnalysisResponse(
            risk_level=risk,
            reasons=reasons,
            verification=verification_msg,
            recommended_action=action
        )
