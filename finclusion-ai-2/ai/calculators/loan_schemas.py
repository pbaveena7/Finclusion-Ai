from pydantic import BaseModel, Field
from typing import List, Optional

class TenureComparison(BaseModel):
    months: int
    monthly_emi: float
    total_interest: float

class PrepaymentImpact(BaseModel):
    prepayment_amount: float
    new_tenure_months: int
    months_saved: int
    interest_saved: float

class LoanPlanningResponse(BaseModel):
    """
    Strict schema for the Advanced Loan Engine output.
    """
    principal: float
    annual_rate: float
    tenure_months: int
    monthly_emi: float
    total_interest: float
    total_repayment: float
    interest_to_principal_ratio: float
    
    # Advanced Metrics
    processing_fee_impact: Optional[float] = None
    debt_to_income_ratio: Optional[float] = None
    
    # Scenario Planning
    prepayment_impact: Optional[PrepaymentImpact] = None
    alternative_tenures: List[TenureComparison] = []
    
    # Strict Compliance Warning
    educational_warning: Optional[str] = None
    disclaimer: str = "This calculation is purely educational and does not constitute loan approval, rejection, or a guarantee of financing."
