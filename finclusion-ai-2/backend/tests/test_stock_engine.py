import pytest
from ai.calculators.stock_engine import StockEngine

def test_trade_margin():
    engine = StockEngine()
    # Buy 100 shares at 2000 = 200,000 Total Value
    res = engine.calculate_trade_margin("RELIANCE", 100, 2000.0, leverage_multiplier=5.0)
    assert res.total_trade_value == 200000.0
    # Intraday should be 1/5th
    assert res.intraday_margin_required == 40000.0
    # MTF should be 50%
    assert res.mtf_margin_required == 100000.0

def test_options_call_payoff():
    engine = StockEngine()
    # Buy Call at 2000 Strike, 50 Premium, Lot 250
    # Spot expires at 2100.
    # Gross Payoff = (2100 - 2000) * 250 = 25,000
    # Premium Paid = 50 * 250 = 12,500
    # Net = +12,500
    res = engine.calculate_options_payoff("CE", 2000.0, 50.0, 250, 2100.0)
    assert res.is_profitable == True
    assert res.net_profit_loss == 12500.0

def test_options_put_loss():
    engine = StockEngine()
    # Buy Put at 2000 Strike, 50 Premium, Lot 250
    # Spot expires at 2100. (Out of the money)
    # Net = -12,500 (Total Premium Lost)
    res = engine.calculate_options_payoff("PE", 2000.0, 50.0, 250, 2100.0)
    assert res.is_profitable == False
    assert res.net_profit_loss == -12500.0

def test_mock_screener():
    engine = StockEngine()
    oversold = engine.mock_screen_stocks("oversold")
    assert len(oversold) == 1
    assert oversold[0]["symbol"] == "HDFCBANK"
