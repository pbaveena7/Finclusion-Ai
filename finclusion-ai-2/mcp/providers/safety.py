from typing import Dict, Any
from ai.fraud.engine import FraudEngine

class SafetyProvider:
    """Provides mock verifications for Govt Schemes and advanced Fraud Analysis."""
    
    def __init__(self):
        self.fraud_engine = FraudEngine()
    
    @property
    def provider_name(self) -> str:
        return "Finclusion Safety & Scheme Verification API"
        
    def check_fraud_signals(self, input_data: str) -> Dict[str, Any]:
        """
        Routes the MCP tool call to the advanced FraudEngine pipeline.
        The input_data could be a URL, SMS text, or company name.
        """
        analysis = self.fraud_engine.analyze(input_data)
        return analysis.model_dump()
