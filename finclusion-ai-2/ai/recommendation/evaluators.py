from ai.recommendation.models import UserProfileContext
from typing import Dict, Any

class FinancialEvaluator:
    """
    Performs deterministic calculations on the user profile to derive
    true financial health metrics, capacity, and risk warnings before sending to LLM.
    """

    @staticmethod
    def evaluate_all(profile: UserProfileContext) -> Dict[str, Any]:
        """Runs the entire 4-step pre-LLM evaluation pipeline."""
        return {
            "health": FinancialEvaluator.assess_health(profile),
            "emergency_fund": FinancialEvaluator.assess_emergency_fund(profile),
            "debt": FinancialEvaluator.assess_debt(profile),
            "capacity": FinancialEvaluator.calculate_capacity(profile)
        }

    @staticmethod
    def assess_health(profile: UserProfileContext) -> Dict[str, Any]:
        """Calculates basic savings rate and expense ratio."""
        if profile.income <= 0:
            return {"status": "critical", "savings_rate": 0, "warning": "No income reported."}
            
        savings_rate = ((profile.income - profile.monthly_expenses - profile.emi_obligations) / profile.income) * 100
        expense_ratio = (profile.monthly_expenses / profile.income) * 100
        
        status = "healthy"
        if savings_rate < 10:
            status = "vulnerable"
        if expense_ratio > 80:
            status = "critical"
            
        return {
            "status": status,
            "savings_rate_pct": round(savings_rate, 2),
            "expense_ratio_pct": round(expense_ratio, 2)
        }

    @staticmethod
    def assess_emergency_fund(profile: UserProfileContext) -> Dict[str, Any]:
        """Checks if 3-6 months of expenses are saved."""
        target_minimum = profile.monthly_expenses * 3
        target_ideal = profile.monthly_expenses * 6
        
        current_fund = profile.emergency_fund + profile.savings
        
        if current_fund >= target_ideal:
            status = "optimal"
        elif current_fund >= target_minimum:
            status = "adequate"
        else:
            status = "deficient"
            
        shortfall = max(0, target_minimum - current_fund)
        
        return {
            "status": status,
            "current_months_covered": round(current_fund / profile.monthly_expenses, 1) if profile.monthly_expenses > 0 else 0,
            "minimum_target": target_minimum,
            "shortfall": shortfall
        }

    @staticmethod
    def assess_debt(profile: UserProfileContext) -> Dict[str, Any]:
        """Calculates Debt-to-Income (DTI) and flags excessive EMI burdens."""
        if profile.income <= 0:
            return {"dti_pct": 0, "status": "unknown"}
            
        dti = (profile.emi_obligations / profile.income) * 100
        
        status = "manageable"
        if dti > 50:
            status = "critical"
            warning = "EMI obligations consume over 50% of income. High risk of default."
        elif dti > 35:
            status = "high"
            warning = "EMI burden is high. Debt reduction should be prioritized."
        else:
            warning = None
            
        return {
            "dti_pct": round(dti, 2),
            "status": status,
            "warning": warning
        }

    @staticmethod
    def calculate_capacity(profile: UserProfileContext) -> Dict[str, float]:
        """Calculates the true disposable income available for investment."""
        disposable_income = profile.income - profile.monthly_expenses - profile.emi_obligations
        
        # If disposable is negative, capacity is 0
        true_capacity = max(0.0, disposable_income)
        
        return {
            "gross_income": profile.income,
            "total_outflow": profile.monthly_expenses + profile.emi_obligations,
            "true_disposable_income": true_capacity
        }
