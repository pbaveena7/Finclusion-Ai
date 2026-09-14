from typing import List, Dict, Any
from ai.recommendation.health_schemas import FinancialHealthResponse, HealthScoreBreakdown

class HealthEngine:
    """
    Mathematical engine to evaluate the 8 pillars of financial health.
    Uses transparent weighting logic to generate a 0-100 score.
    """
    
    def evaluate(
        self,
        monthly_income: float,
        monthly_expenses: float,
        emergency_fund_balance: float,
        total_monthly_emi: float,
        is_investing_diversified: bool,
        has_health_insurance: bool,
        has_life_insurance: bool,
        is_saving_for_retirement: bool,
        goals_on_track: bool,
        knowledge_level: str
    ) -> FinancialHealthResponse:
        
        breakdown = {}
        strengths = []
        weaknesses = []
        actions = []
        
        # 1. Emergency Fund (Max 20 points)
        # Target: 3 months of expenses
        target_ef = monthly_expenses * 3
        if target_ef == 0: target_ef = 1 # Avoid div zero
        ef_ratio = emergency_fund_balance / target_ef
        ef_score = min(20, int(ef_ratio * 20))
        breakdown["emergency_fund"] = ef_score
        
        if ef_score >= 15: strengths.append("Solid Emergency Fund.")
        else: 
            weaknesses.append("Insufficient Emergency Fund.")
            actions.append("Direct 10% of monthly income to build a 3-month emergency buffer.")
            
        # 2. Debt Management (Max 20 points)
        # Target: EMI < 30% of income. 0 points if > 50%.
        if monthly_income == 0: monthly_income = 1
        dti = total_monthly_emi / monthly_income
        if dti <= 0.20: debt_score = 20
        elif dti <= 0.35: debt_score = 15
        elif dti <= 0.50: debt_score = 5
        else: debt_score = 0
        breakdown["debt_management"] = debt_score
        
        if debt_score >= 15: strengths.append("Healthy Debt-to-Income Ratio.")
        else: 
            weaknesses.append("High debt burden.")
            actions.append("Avoid taking new loans and consider prepaying high-interest debt.")
            
        # 3. Savings Rate (Max 15 points)
        # Target: Save > 20% of income
        savings = monthly_income - monthly_expenses - total_monthly_emi
        sr = savings / monthly_income
        if sr >= 0.20: sr_score = 15
        elif sr >= 0.10: sr_score = 10
        elif sr > 0: sr_score = 5
        else: sr_score = 0
        breakdown["savings_rate"] = sr_score
        
        if sr_score < 10: actions.append("Review monthly expenses to increase savings rate to at least 20%.")
            
        # 4. Diversification (Max 10)
        div_score = 10 if is_investing_diversified else 0
        breakdown["diversification"] = div_score
        if div_score == 0: actions.append("Consider diversifying investments beyond traditional savings (e.g., Mutual Funds, SIPs).")
        
        # 5. Goal Progress (Max 10)
        goal_score = 10 if goals_on_track else 0
        breakdown["goal_progress"] = goal_score
        
        # 6. Insurance (Max 10)
        ins_score = 0
        if has_health_insurance: ins_score += 5
        if has_life_insurance: ins_score += 5
        breakdown["insurance"] = ins_score
        if ins_score < 10: actions.append("Secure adequate Health and Life insurance to protect your wealth.")
        
        # 7. Retirement (Max 10)
        ret_score = 10 if is_saving_for_retirement else 0
        breakdown["retirement"] = ret_score
        if ret_score == 0: actions.append("Start a dedicated retirement fund (like NPS or PPF).")
        
        # 8. Literacy (Max 5)
        lvl = knowledge_level.lower()
        if lvl == "advanced": lit_score = 5
        elif lvl == "intermediate": lit_score = 3
        else: lit_score = 1
        breakdown["literacy"] = lit_score
        
        # Calculate Total
        total_score = sum(breakdown.values())
        
        # Formulate Monthly Plan based on score
        plan = []
        if ef_score < 15:
            plan.append("Week 1: Automate a transfer to a separate high-yield savings account for emergencies.")
        if ins_score < 10:
            plan.append("Week 2: Get quotes for basic health/term life insurance policies.")
        if debt_score < 15:
            plan.append("Week 3: List all debts and create a repayment strategy (Snowball or Avalanche).")
        if sr_score < 10:
            plan.append("Week 4: Audit last month's spending and cut one non-essential subscription.")
            
        if not plan:
            plan = ["Maintain current savings rate.", "Review portfolio rebalancing quarterly.", "Explore advanced tax-saving strategies."]
            
        return FinancialHealthResponse(
            overall_score=total_score,
            score_breakdown=HealthScoreBreakdown(**breakdown),
            strengths=strengths,
            weaknesses=weaknesses,
            priority_actions=actions[:3],
            monthly_improvement_plan=plan
        )
