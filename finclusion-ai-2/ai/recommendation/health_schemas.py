from pydantic import BaseModel, Field
from typing import Dict, List

class HealthScoreBreakdown(BaseModel):
    emergency_fund: int = Field(..., description="Out of 20")
    debt_management: int = Field(..., description="Out of 20")
    savings_rate: int = Field(..., description="Out of 15")
    diversification: int = Field(..., description="Out of 10")
    goal_progress: int = Field(..., description="Out of 10")
    insurance: int = Field(..., description="Out of 10")
    retirement: int = Field(..., description="Out of 10")
    literacy: int = Field(..., description="Out of 5")

class FinancialHealthResponse(BaseModel):
    """Strict schema enforcing transparent scoring and safety disclaimers."""
    overall_score: int = Field(..., description="0-100 total health score")
    score_breakdown: HealthScoreBreakdown
    strengths: List[str]
    weaknesses: List[str]
    priority_actions: List[str]
    monthly_improvement_plan: List[str]
    
    disclaimer: str = "IMPORTANT: This Financial Health Score is a purely educational metric based on general financial guidelines. It is NOT an official credit score (like CIBIL) and does not impact your ability to secure loans."
