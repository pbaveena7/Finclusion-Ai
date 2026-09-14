from pydantic import BaseModel
from typing import List, Dict, Any

class MarginResult(BaseModel):
    stock_symbol: str
    quantity: int
    current_price: float
    total_trade_value: float
    intraday_margin_required: float
    mtf_margin_required: float
    mtf_daily_interest: float

class OptionsPayoffResult(BaseModel):
    option_type: str
    strike_price: float
    premium_paid: float
    lot_size: int
    spot_price_at_expiry: float
    net_profit_loss: float
    is_profitable: bool

class StockEngine:
    """
    Advanced Stock & F&O Engine (Inspired by Groww).
    Handles Margin/MTF Math, Options Payoff, and Mock Screener Data.
    """

    def calculate_trade_margin(
        self, symbol: str, qty: int, price: float, leverage_multiplier: float = 5.0, mtf_interest_rate_annual: float = 18.0
    ) -> MarginResult:
        """
        Calculates margin required for intraday (with leverage) and MTF (Margin Trading Facility).
        """
        total_value = qty * price
        
        # Intraday Margin (Typically 5x leverage in India for approved stocks)
        intraday_margin = total_value / leverage_multiplier
        
        # MTF Margin (Typically 50% upfront, rest funded by broker)
        mtf_margin = total_value * 0.50
        funded_amount = total_value - mtf_margin
        
        # Daily interest on funded amount
        daily_rate = (mtf_interest_rate_annual / 100) / 365
        daily_interest = funded_amount * daily_rate

        return MarginResult(
            stock_symbol=symbol.upper(),
            quantity=qty,
            current_price=round(price, 2),
            total_trade_value=round(total_value, 2),
            intraday_margin_required=round(intraday_margin, 2),
            mtf_margin_required=round(mtf_margin, 2),
            mtf_daily_interest=round(daily_interest, 2)
        )

    def calculate_options_payoff(
        self, option_type: str, strike: float, premium: float, lot_size: int, expiry_spot: float
    ) -> OptionsPayoffResult:
        """
        Calculates net payoff for buying a Call (CE) or Put (PE) option at expiry.
        """
        option_type = option_type.upper()
        total_premium_paid = premium * lot_size
        gross_payoff = 0.0

        if option_type in ["CE", "CALL"]:
            # Buyer profits if spot > strike
            if expiry_spot > strike:
                gross_payoff = (expiry_spot - strike) * lot_size
        elif option_type in ["PE", "PUT"]:
            # Buyer profits if spot < strike
            if expiry_spot < strike:
                gross_payoff = (strike - expiry_spot) * lot_size
        else:
            raise ValueError("Invalid option_type. Must be CE or PE.")

        net_pl = gross_payoff - total_premium_paid

        return OptionsPayoffResult(
            option_type=option_type,
            strike_price=strike,
            premium_paid=total_premium_paid,
            lot_size=lot_size,
            spot_price_at_expiry=expiry_spot,
            net_profit_loss=round(net_pl, 2),
            is_profitable=net_pl > 0
        )

    def mock_screen_stocks(self, filter_type: str) -> List[Dict[str, Any]]:
        """
        Mocks a stock screener returning simulated data based on filters.
        """
        # In a real app, this would query a DB or TrueData API.
        db = [
            {"symbol": "RELIANCE", "pe": 28.5, "rsi": 65, "sector": "Energy"},
            {"symbol": "TCS", "pe": 32.1, "rsi": 45, "sector": "IT"},
            {"symbol": "HDFCBANK", "pe": 16.4, "rsi": 30, "sector": "Banking"}, # Oversold
            {"symbol": "INFY", "pe": 24.2, "rsi": 75, "sector": "IT"}, # Overbought
        ]

        if filter_type.lower() == "oversold":
            return [s for s in db if s["rsi"] <= 30]
        elif filter_type.lower() == "low_pe":
            return [s for s in db if s["pe"] < 20]
        else:
            return db

    def mock_get_ipos(self) -> List[Dict[str, Any]]:
        """Mocks upcoming IPO data."""
        return [
            {"name": "TechNova AI", "status": "Upcoming", "price_band": "₹450 - ₹475", "open_date": "2026-10-01"},
            {"name": "GreenEnergy Corp", "status": "Ongoing", "price_band": "₹120 - ₹125", "open_date": "2026-09-12"}
        ]
