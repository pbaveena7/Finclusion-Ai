from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

# ── NORMALIZED SCHEMA ─────────────────────────────────────────────

class NormalizedStockQuote(BaseModel):
    symbol: str
    name: Optional[str] = "Unknown"
    current_price: float
    currency: str = "INR"
    day_high: Optional[float] = None
    day_low: Optional[float] = None
    volume: Optional[int] = None
    market_cap: Optional[int] = None
    pe_ratio: Optional[float] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    sector: Optional[str] = None

class HistoricalPricePoint(BaseModel):
    date: str
    close: float
    high: float
    low: float
    open: float
    volume: int

# ── NORMALIZER LOGIC ──────────────────────────────────────────────

class MarketDataNormalizer:
    """
    Transforms messy, varying API responses (like yfinance's massive info dict) 
    into a clean, standardized Pydantic schema for the MCP Tool.
    """
    
    @staticmethod
    def normalize_quote(symbol: str, raw_data: Dict[str, Any]) -> NormalizedStockQuote:
        if not raw_data or 'currentPrice' not in raw_data:
            raise ValueError(f"Insufficient data to normalize quote for {symbol}")
            
        return NormalizedStockQuote(
            symbol=symbol,
            name=raw_data.get('shortName') or raw_data.get('longName'),
            current_price=raw_data.get('currentPrice', 0.0),
            currency=raw_data.get('currency', 'INR'),
            day_high=raw_data.get('dayHigh') or raw_data.get('regularMarketDayHigh'),
            day_low=raw_data.get('dayLow') or raw_data.get('regularMarketDayLow'),
            volume=raw_data.get('volume') or raw_data.get('regularMarketVolume'),
            market_cap=raw_data.get('marketCap'),
            pe_ratio=raw_data.get('trailingPE'),
            fifty_two_week_high=raw_data.get('fiftyTwoWeekHigh'),
            fifty_two_week_low=raw_data.get('fiftyTwoWeekLow'),
            sector=raw_data.get('sector')
        )
        
    @staticmethod
    def normalize_history(raw_history: Dict[str, Any]) -> List[HistoricalPricePoint]:
        if not raw_history:
            return []
            
        normalized_list = []
        for date_str, data in raw_history.items():
            normalized_list.append(
                HistoricalPricePoint(
                    date=date_str,
                    close=data.get('Close', 0.0),
                    high=data.get('High', 0.0),
                    low=data.get('Low', 0.0),
                    open=data.get('Open', 0.0),
                    volume=int(data.get('Volume', 0))
                )
            )
            
        return normalized_list
