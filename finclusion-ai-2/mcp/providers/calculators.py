from typing import Dict, Any, Optional
from datetime import datetime
from ai.calculators.loan_engine import LoanEngine
from ai.recommendation.health_engine import HealthEngine

class CalculatorsProvider:
    """Provides deterministic financial mathematics for MCP Tools."""
    
    def __init__(self):
        self.loan_engine = LoanEngine()
        self.health_engine = HealthEngine()
        
    @property
    def provider_name(self) -> str:
        return "Finclusion Deterministic Calculators"
        
    def calculate_sip(self, monthly_investment: float, annual_rate: float, years: int) -> Dict[str, Any]:
        """Calculates Future Value of a SIP."""
        n = years * 12
        r = (annual_rate / 100) / 12
        
        # SIP Formula: P * [((1+r)^n - 1) / r] * (1+r)
        future_value = monthly_investment * (((1 + r)**n - 1) / r) * (1 + r)
        total_invested = monthly_investment * n
        wealth_gained = future_value - total_invested
        
        return {
            "total_invested": round(total_invested, 2),
            "estimated_future_value": round(future_value, 2),
            "wealth_gained": round(wealth_gained, 2),
            "assumptions": f"Assuming {annual_rate}% annual return over {years} years."
        }
        
    def calculate_emi(
        self, principal: float, annual_rate: float, years: int,
        processing_fee_percent: float = 0.0, monthly_income: Optional[float] = None,
        existing_emi: float = 0.0, prepayment_amount: float = 0.0
    ) -> Dict[str, Any]:
        """Calculates advanced Loan Planning metrics using LoanEngine."""
        res = self.loan_engine.analyze_loan(
            principal, annual_rate, years, processing_fee_percent, 
            monthly_income, existing_emi, prepayment_amount
        )
        return res.model_dump()

    def calculate_financial_health(self, **kwargs) -> Dict[str, Any]:
        """Calculates 8-pillar financial health score."""
        res = self.health_engine.evaluate(**kwargs)
        return res.model_dump()
