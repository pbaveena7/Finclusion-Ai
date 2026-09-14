from typing import List, Optional
from ai.schemes.schemas import SchemeDiscoveryResponse, RecommendedScheme
from ai.schemes.registry import SCHEME_REGISTRY

class SchemeEngine:
    """
    Algorithm to filter and rank government schemes based on user profile.
    """
    def discover_schemes(
        self,
        age: Optional[int] = None,
        gender: Optional[str] = None,
        primary_goal: Optional[str] = None
    ) -> SchemeDiscoveryResponse:
        
        recommendations = []
        
        for scheme in SCHEME_REGISTRY:
            # 1. Hard Filtering (Eligibility Rules)
            if age is not None:
                if age < scheme.min_age or age > scheme.max_age:
                    continue # Disqualified based on age
                    
            if gender is not None and scheme.gender_specific is not None:
                if gender.lower() != scheme.gender_specific:
                    continue # Disqualified based on gender (e.g. SSY)
            
            # 2. Soft Scoring (Relevance)
            score = 50 # Base score for being eligible
            reasons = ["You meet the basic eligibility criteria."]
            
            if primary_goal:
                goal_lower = primary_goal.lower()
                # Check if goal aligns with scheme's target goals
                if any(g in goal_lower for g in scheme.goals_matched):
                    score += 40
                    reasons.append(f"Strongly aligns with your goal: {primary_goal.title()}.")
                    
            # Boost SCSS specifically if user is older
            if age and age >= 60 and scheme.scheme_id == "scss":
                score += 10
                reasons.append("Highly recommended dedicated scheme for Senior Citizens.")
                
            recommendations.append(
                RecommendedScheme(
                    scheme_name=scheme.name,
                    match_score=min(100, score),
                    reasons_for_match=reasons,
                    tax_information=scheme.tax_benefits,
                    official_source=scheme.official_source
                )
            )
            
        # 3. Sort by match score descending
        recommendations.sort(key=lambda x: x.match_score, reverse=True)
        
        return SchemeDiscoveryResponse(recommended_schemes=recommendations)
