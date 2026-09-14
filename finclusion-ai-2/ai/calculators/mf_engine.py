import math
from pydantic import BaseModel
from typing import List, Dict, Any

class GoalResult(BaseModel):
    target_amount: float
    inflated_target_amount: float
    required_monthly_sip: float
    total_investment: float
    total_wealth_gained: float
    breakdown_yearly: List[Dict[str, Any]]

class MFEngine:
    """
    Advanced Mathematical Engine for Mutual Fund Calculators (Inspired by SBI MF).
    Handles Inflation, Step-Up (Top-Up) SIP, Crorepati Targets, and STP.
    """

    def calculate_inflation_adjusted_goal(
        self, current_cost: float, years: int, inflation_rate: float, expected_cagr: float
    ) -> GoalResult:
        """
        Calculates the required monthly SIP to achieve a goal, adjusting for inflation.
        E.g. A wedding costs 10L today. At 6% inflation, what will it cost in 10 years?
        """
        # 1. Calculate future cost (Inflated Target)
        inflated_target = current_cost * ((1 + (inflation_rate / 100)) ** years)
        
        # 2. Calculate required SIP to reach inflated target
        # SIP Formula: P = M * [((1 + i)^n - 1) / i] * (1 + i)
        # Therefore: M = P / ([((1 + i)^n - 1) / i] * (1 + i))
        monthly_rate = (expected_cagr / 100) / 12
        months = years * 12
        
        if monthly_rate > 0:
            numerator = inflated_target * monthly_rate
            denominator = ((1 + monthly_rate) ** months - 1) * (1 + monthly_rate)
            required_sip = numerator / denominator
        else:
            required_sip = inflated_target / months

        return GoalResult(
            target_amount=round(current_cost, 2),
            inflated_target_amount=round(inflated_target, 2),
            required_monthly_sip=round(required_sip, 2),
            total_investment=round(required_sip * months, 2),
            total_wealth_gained=round(inflated_target - (required_sip * months), 2),
            breakdown_yearly=[] # Can be populated for charting
        )

    def calculate_crorepati_target(self, years: int, expected_cagr: float) -> GoalResult:
        """
        Reverse-calculates the required SIP to reach exactly 1 Crore (10,000,000).
        """
        return self.calculate_inflation_adjusted_goal(
            current_cost=10000000, # 1 Crore
            years=years,
            inflation_rate=0.0, # Not inflating 1 crore, it is the static target
            expected_cagr=expected_cagr
        )

    def calculate_step_up_sip(
        self, initial_sip: float, years: int, expected_cagr: float, step_up_percent: float
    ) -> Dict[str, Any]:
        """
        Calculates Future Value when the SIP amount increases by `step_up_percent` annually.
        """
        monthly_rate = (expected_cagr / 100) / 12
        total_value = 0.0
        total_invested = 0.0
        current_sip = initial_sip

        yearly_breakdown = []

        for year in range(1, years + 1):
            year_invested = 0.0
            # Compound month by month for the current year
            for month in range(12):
                total_value += current_sip
                total_value *= (1 + monthly_rate)
                total_invested += current_sip
                year_invested += current_sip
            
            yearly_breakdown.append({
                "year": year,
                "sip_amount": round(current_sip, 2),
                "year_invested": round(year_invested, 2),
                "total_invested": round(total_invested, 2),
                "total_value": round(total_value, 2)
            })
            
            # Step up the SIP for next year
            current_sip *= (1 + (step_up_percent / 100))

        return {
            "final_value": round(total_value, 2),
            "total_invested": round(total_invested, 2),
            "total_wealth_gained": round(total_value - total_invested, 2),
            "yearly_breakdown": yearly_breakdown
        }

    def calculate_stp(
        self, lump_sum: float, transfer_months: int, liquid_cagr: float, equity_cagr: float
    ) -> Dict[str, Any]:
        """
        Models Systematic Transfer Plan. 
        Lump sum sits in a Liquid Fund earning `liquid_cagr`, and a fixed amount 
        is transferred monthly into an Equity Fund earning `equity_cagr`.
        """
        monthly_transfer = lump_sum / transfer_months
        liquid_monthly_rate = (liquid_cagr / 100) / 12
        equity_monthly_rate = (equity_cagr / 100) / 12
        
        liquid_balance = lump_sum
        equity_balance = 0.0
        
        for _ in range(transfer_months):
            # Compound Liquid
            liquid_balance *= (1 + liquid_monthly_rate)
            
            # Determine actual transfer (if liquid balance is slightly less due to rounding)
            actual_transfer = min(monthly_transfer, liquid_balance)
            
            # Transfer
            liquid_balance -= actual_transfer
            
            # Compound Equity and add transfer
            equity_balance *= (1 + equity_monthly_rate)
            equity_balance += actual_transfer
            
        return {
            "total_value_after_transfer_period": round(liquid_balance + equity_balance, 2),
            "equity_balance": round(equity_balance, 2),
            "liquid_balance_remaining": round(liquid_balance, 2)
        }
