"""
Finclusion AI 2.0 — Pydantic Schemas
Mirror the TypeScript types for API validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class RiskCategory(str, Enum):
    conservative = "conservative"
    moderate = "moderate"
    aggressive = "aggressive"


class InvestmentHorizon(str, Enum):
    short = "short"
    medium = "medium"
    long = "long"


# ── User ──────────────────────────────────────────────────────
class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    age: int
    gender: Gender
    occupation: str
    income: float
    monthly_expenses: float
    savings: float
    existing_investments: float
    existing_loans: float
    existing_emi: float
    financial_goals: list[str]
    investment_horizon: InvestmentHorizon
    risk_tolerance: RiskCategory
    preferred_language: str = "en"
    financial_health_score: int
    risk_score: int
    is_onboarded: bool = False
    created_at: datetime = Field(default_factory=datetime.now)


class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    age: int
    gender: Gender
    occupation: str
    income: float


# ── Portfolio ─────────────────────────────────────────────────
class PortfolioHolding(BaseModel):
    id: str
    name: str
    type: str  # stock, mutualfund, etf, nps, ppf, fd, gold
    quantity: float
    buy_price: float
    current_price: float
    invested_amount: float
    current_value: float
    pnl: float
    pnl_percent: float


class PortfolioSummary(BaseModel):
    total_invested: float
    current_value: float
    total_pnl: float
    total_pnl_percent: float
    holdings: list[PortfolioHolding]


# ── Chat ──────────────────────────────────────────────────────
class ChatMessageCreate(BaseModel):
    content: str


class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    timestamp: datetime
    type: str = "text"


# ── Fraud ─────────────────────────────────────────────────────
class FraudCheckRequest(BaseModel):
    message: str


class FraudRedFlag(BaseModel):
    flag: str
    description: str
    severity: str  # low, medium, high


class FraudAnalysisResponse(BaseModel):
    risk_level: str  # safe, caution, high-risk
    risk_score: int
    red_flags: list[FraudRedFlag]
    recommendation: str
    analysis_details: list[str]


# ── Goals ─────────────────────────────────────────────────────
class FinancialGoalCreate(BaseModel):
    name: str
    target_amount: float
    monthly_contribution: float
    timeline_years: int
    risk_level: RiskCategory = RiskCategory.moderate


class FinancialGoalResponse(BaseModel):
    id: str
    name: str
    icon: str
    target_amount: float
    current_savings: float
    monthly_contribution: float
    timeline_years: int
    expected_return: float
    risk_level: RiskCategory
    progress: float
    projected_amount: float
    monthly_sip_needed: float
    status: str  # on-track, behind, ahead
