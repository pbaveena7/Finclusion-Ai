import math

def calculate_sip(monthly_investment: float, annual_rate: float, years: int) -> dict:
    """
    Calculates the future value of a Systematic Investment Plan (SIP).
    """
    try:
        n = years * 12
        r = (annual_rate / 100) / 12
        
        # Future Value formula for SIP
        future_value = monthly_investment * (((1 + r)**n - 1) / r) * (1 + r)
        total_invested = monthly_investment * n
        wealth_gained = future_value - total_invested
        
        return {
            "total_invested": round(total_invested, 2),
            "future_value": round(future_value, 2),
            "wealth_gained": round(wealth_gained, 2)
        }
    except Exception as e:
        return {"error": str(e)}

def calculate_emi(principal: float, annual_rate: float, years: int) -> dict:
    """
    Calculates the Equated Monthly Installment (EMI) for a loan.
    """
    try:
        n = years * 12
        r = (annual_rate / 100) / 12
        
        # EMI formula
        emi = principal * r * ((1 + r)**n) / (((1 + r)**n) - 1)
        total_payment = emi * n
        total_interest = total_payment - principal
        
        return {
            "monthly_emi": round(emi, 2),
            "total_interest": round(total_interest, 2),
            "total_payment": round(total_payment, 2)
        }
    except Exception as e:
        return {"error": str(e)}

def calculate_swp(total_investment: float, monthly_withdrawal: float, annual_rate: float, years: int) -> dict:
    """
    Calculates Systematic Withdrawal Plan (SWP) sustainability and final balance.
    """
    try:
        n = years * 12
        r = (annual_rate / 100) / 12
        
        balance = total_investment
        total_withdrawn = 0
        
        for _ in range(n):
            # Add monthly interest, then subtract withdrawal
            balance = balance + (balance * r) - monthly_withdrawal
            total_withdrawn += monthly_withdrawal
            if balance <= 0:
                return {
                    "sustainable": False,
                    "months_lasted": _,
                    "total_withdrawn": round(total_withdrawn, 2),
                    "final_balance": 0
                }
                
        return {
            "sustainable": True,
            "total_withdrawn": round(total_withdrawn, 2),
            "final_balance": round(balance, 2)
        }
    except Exception as e:
        return {"error": str(e)}
