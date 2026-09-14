from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class SchemeMetadata(BaseModel):
    scheme_id: str
    name: str
    purpose: str
    min_age: int = 0
    max_age: int = 100
    gender_specific: Optional[Literal["male", "female"]] = None
    min_contribution: float
    max_contribution: float
    lock_in_period: str
    tax_benefits: str
    official_source: str
    last_verified: str
    goals_matched: List[str] # e.g., ["retirement", "savings", "tax_saving"]

class RecommendedScheme(BaseModel):
    scheme_name: str
    match_score: int = Field(..., description="0-100 relevance score")
    reasons_for_match: List[str]
    tax_information: str
    official_source: str

class SchemeDiscoveryResponse(BaseModel):
    """
    Strict output schema for Scheme Recommendations.
    Enforces the mandatory disclaimer.
    """
    recommended_schemes: List[RecommendedScheme]
    disclaimer: str = "Eligibility must be confirmed from the official source."
