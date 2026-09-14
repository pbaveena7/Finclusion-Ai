import math
from typing import Optional
from ai.calculators.loan_schemas import LoanPlanningResponse, TenureComparison, PrepaymentImpact

class LoanEngine:
    """
    Advanced Loan Mathematics Engine.
    Handles amortization, DTI ratio warnings, and prepayment scenario planning.
    """

    def _calc_emi(self, principal: float, annual_rate: float, months: int) -> float:
        """Standard EMI Formula."""
        if principal <= 0 or months <= 0: return 0.0
        r = (annual_rate / 100) / 12
        if r == 0: return principal / months
        return principal * r * ((1 + r)**months) / (((1 + r)**months) - 1)

    def _calc_tenure(self, principal: float, annual_rate: float, emi: float) -> int:
        """Calculates remaining tenure given a fixed EMI."""
        r = (annual_rate / 100) / 12
        if r == 0: return int(math.ceil(principal / emi))
        if emi <= principal * r: return 999 # Will never pay off
        n = math.log(emi / (emi - principal * r)) / math.log(1 + r)
        return int(math.ceil(n))

    def analyze_loan(
        self,
        principal: float,
        annual_rate: float,
        years: int,
        processing_fee_percent: float = 0.0,
        monthly_income: Optional[float] = None,
        existing_emi: float = 0.0,
        prepayment_amount: float = 0.0
    ) -> LoanPlanningResponse:
        """
        Runs the full loan analysis pipeline.
        """
        months = years * 12
        base_emi = self._calc_emi(principal, annual_rate, months)
        total_payment = base_emi * months
        total_interest = total_payment - principal
        
        # 1. Basic Ratios & Fees
        i2p_ratio = (total_interest / principal) * 100 if principal > 0 else 0
        processing_fee = principal * (processing_fee_percent / 100)

        # 2. Debt-to-Income (DTI) & Strict Warning Logic
        dti = None
        warning = None
        if monthly_income and monthly_income > 0:
            total_monthly_obligations = base_emi + existing_emi
            dti = (total_monthly_obligations / monthly_income) * 100
            
            if dti > 45:
                warning = (
                    f"Warning: Your projected Debt-to-Income ratio is {dti:.1f}%. "
                    "Financial experts generally recommend keeping total EMI obligations below 40% of monthly income to avoid severe financial stress."
                )

        # 3. Prepayment Impact (Assuming it reduces tenure)
        prepayment_impact = None
        if prepayment_amount > 0 and prepayment_amount < principal:
            # We assume prepayment is made early on. New principal = principal - prepayment.
            new_principal = principal - prepayment_amount
            new_tenure = self._calc_tenure(new_principal, annual_rate, base_emi)
            
            if new_tenure < months:
                new_total_interest = (base_emi * new_tenure) - new_principal
                interest_saved = total_interest - new_total_interest
                months_saved = months - new_tenure
                
                prepayment_impact = PrepaymentImpact(
                    prepayment_amount=prepayment_amount,
                    new_tenure_months=new_tenure,
                    months_saved=months_saved,
                    interest_saved=round(interest_saved, 2)
                )

        # 4. Alternative Tenures (+/- 1 and 2 years)
        alt_tenures = []
        for alt_years in [years - 2, years - 1, years + 1, years + 2]:
            if alt_years > 0:
                alt_months = alt_years * 12
                a_emi = self._calc_emi(principal, annual_rate, alt_months)
                a_int = (a_emi * alt_months) - principal
                alt_tenures.append(TenureComparison(months=alt_months, monthly_emi=round(a_emi, 2), total_interest=round(a_int, 2)))

        return LoanPlanningResponse(
            principal=principal,
            annual_rate=annual_rate,
            tenure_months=months,
            monthly_emi=round(base_emi, 2),
            total_interest=round(total_interest, 2),
            total_repayment=round(total_payment, 2),
            interest_to_principal_ratio=round(i2p_ratio, 2),
            processing_fee_impact=round(processing_fee, 2) if processing_fee > 0 else None,
            debt_to_income_ratio=round(dti, 2) if dti is not None else None,
            prepayment_impact=prepayment_impact,
            alternative_tenures=alt_tenures,
            educational_warning=warning
        )
