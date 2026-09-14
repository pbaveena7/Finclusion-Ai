import pytest
from ai.fraud.engine import FraudEngine
from ai.calculators.loan_engine import LoanEngine
from ai.recommendation.health_engine import HealthEngine

def test_fraud_engine_strict_verification():
    engine = FraudEngine()
    # Unverified entity MUST return MEDIUM risk even with no bad keywords
    res = engine.analyze("I want to invest in UnknownCryptoFund")
    assert res.risk_level in ["MEDIUM", "HIGH"]
    assert "Verification failed" in res.verification_status

def test_fraud_engine_guaranteed_returns():
    engine = FraudEngine()
    # "100% safe" must trigger high risk flag
    res = engine.analyze("Invest with us, 100% safe and guaranteed returns of 50%")
    assert res.risk_level == "HIGH"
    assert len(res.reasons) > 0

def test_loan_engine_dti_warning():
    engine = LoanEngine()
    # 5L loan, 10% rate, 5 years = ~10k EMI. If income is 20k, DTI is 50%.
    res = engine.analyze_loan(principal=500000, annual_rate=10, years=5, monthly_income=20000)
    assert res.debt_to_income_ratio > 45
    assert "Warning" in res.educational_warning

def test_health_engine_scoring():
    engine = HealthEngine()
    # Perfect score test
    res = engine.evaluate(
        monthly_income=100000,
        monthly_expenses=30000,
        emergency_fund_balance=300000, # 10 months EF
        total_monthly_emi=10000, # 10% DTI
        is_investing_diversified=True,
        has_health_insurance=True,
        has_life_insurance=True,
        is_saving_for_retirement=True,
        goals_on_track=True,
        knowledge_level="advanced"
    )
    assert res.overall_score > 90
    assert len(res.monthly_improvement_plan) > 0
