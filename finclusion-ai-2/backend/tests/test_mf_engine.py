import pytest
from ai.calculators.mf_engine import MFEngine

def test_crorepati_target():
    engine = MFEngine()
    # To reach 1 crore in 10 years at 12% CAGR, you need roughly 43,000 per month
    res = engine.calculate_crorepati_target(years=10, expected_cagr=12.0)
    assert res.target_amount == 10000000
    assert 40000 < res.required_monthly_sip < 45000

def test_inflation_adjusted_goal():
    engine = MFEngine()
    # A wedding costing 10L today at 6% inflation will cost ~17.9L in 10 years
    res = engine.calculate_inflation_adjusted_goal(
        current_cost=1000000, years=10, inflation_rate=6.0, expected_cagr=12.0
    )
    assert 1700000 < res.inflated_target_amount < 1800000
    # Required SIP for 17.9L target at 12% is roughly 7,700
    assert 7000 < res.required_monthly_sip < 8000

def test_step_up_sip():
    engine = MFEngine()
    # 10k SIP for 10 years at 12% without step up is ~23.2L
    # With a 10% annual step up, it should be significantly higher (~31L)
    res = engine.calculate_step_up_sip(
        initial_sip=10000, years=10, expected_cagr=12.0, step_up_percent=10.0
    )
    assert res["final_value"] > 2320000 # Should be strictly greater than static SIP
    assert res["final_value"] > 3000000 
    assert len(res["yearly_breakdown"]) == 10

def test_stp_calculation():
    engine = MFEngine()
    # 1.2L lumpsum, 10k transferred monthly for 12 months.
    res = engine.calculate_stp(
        lump_sum=120000, transfer_months=12, liquid_cagr=5.0, equity_cagr=12.0
    )
    # Total value should be higher than 1.2L due to returns
    assert res["total_value_after_transfer_period"] > 120000
    # Liquid balance should be very close to 0 (just residual interest)
    assert res["liquid_balance_remaining"] < 5000
