from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class FraudAnalysisResponse(BaseModel):
    """
    Strict schema for the Fraud Detection Engine output.
    Enforces the 'Never claim legitimate unless verified' constraint.
    """
    risk_level: RiskLevel
    reasons: List[str] = Field(..., description="List of detected heuristic red flags or verification statuses.")
    verification: str = Field(..., description="Details on whether the entity was found in official databases.")
    recommended_action: str
