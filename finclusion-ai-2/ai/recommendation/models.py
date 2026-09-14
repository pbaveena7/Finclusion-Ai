from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

# ── ENUMS ─────────────────────────────────────────────────────────

class RiskTolerance(str, Enum):
    CONSERVATIVE = "Conservative"
    MODERATE = "Moderate"
    AGGRESSIVE = "Aggressive"

class KnowledgeLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

class RecommendationCategory(str, Enum):
    SAVINGS = "savings"
    EMERGENCY_FUND = "emergency fund"
    SIP = "SIP"
    MUTUAL_FUNDS = "mutual funds"
    NPS = "NPS"
    PPF = "PPF"
    GOVT_SCHEMES = "government schemes"
    DEBT_REDUCTION = "debt reduction"
    RETIREMENT = "retirement planning"

# ── INPUT SCHEMA ──────────────────────────────────────────────────

class FinancialGoal(BaseModel):
    name: str
    target_amount: float
    duration_years: int
    priority: str = "High"

class UserProfileContext(BaseModel):
    """The comprehensive financial state of the user used for evaluations."""
    age: int
    income: float = Field(..., description="Monthly income")
    monthly_expenses: float
    savings: float = Field(..., description="Total liquid savings available")
    emergency_fund: float = Field(0.0, description="Dedicated emergency fund balance")
    existing_investments: float = 0.0
    total_debt: float = 0.0
    emi_obligations: float = Field(0.0, description="Total monthly EMI payments")
    
    financial_goals: List[FinancialGoal] = Field(default_factory=list)
    risk_tolerance: RiskTolerance
    investment_horizon_years: int
    
    preferred_language: str = "en"
    financial_knowledge: KnowledgeLevel = KnowledgeLevel.BEGINNER

# ── OUTPUT SCHEMA ─────────────────────────────────────────────────

class RecommendationItem(BaseModel):
    category: RecommendationCategory
    title: str = Field(..., description="Clear, actionable title of the recommendation")
    why: str = Field(..., description="WHY this option fits their specific evaluated profile (not just income)")
    risks: str = Field(..., description="WHAT risks exist with this specific option")
    assumptions: str = Field(..., description="WHAT assumptions were used to make this recommendation")
    learn_first: str = Field(..., description="WHAT the user should learn/read before acting on this")

class RecommendationEngineResponse(BaseModel):
    """The strict JSON structure that the LLM must generate."""
    summary: str = Field(..., description="An overall educational summary of their financial health and capacity.")
    disposable_income_assessment: str = Field(..., description="Explanation of true investment capacity after EMIs and expenses.")
    recommendations: List[RecommendationItem] = Field(..., description="List of personalized recommendations.")
    disclaimer: str = Field(
        default="This is educational information based on provided inputs and does not constitute guaranteed financial advice.",
        description="Mandatory risk disclaimer."
    )
