from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DataStatus(str, Enum):
    LIVE = "live"
    DELAYED = "delayed"
    SIMULATED = "simulated"

class MarketDataResponse(BaseModel):
    """Base class enforcing metadata on all market data responses."""
    timestamp: datetime = Field(default_factory=datetime.now, description="Time the data was fetched or generated.")
    source: str = Field(..., description="The name of the data provider (e.g., 'YFinance', 'NSE API').")
    data_status: DataStatus = Field(..., description="Indicates if the data is live, delayed, or simulated.")

# ── DOMAIN SCHEMAS ────────────────────────────────────────────────

class StockQuote(BaseModel):
    symbol: str
    name: Optional[str] = None
    current_price: float
    currency: str = "INR"
    day_high: Optional[float] = None
    day_low: Optional[float] = None
    volume: Optional[int] = None
    previous_close: Optional[float] = None

class StockQuoteResponse(MarketDataResponse):
    data: StockQuote

class HistoricalPricePoint(BaseModel):
    date: str
    close: float
    high: float
    low: float
    open: float
    volume: int

class HistoricalPriceResponse(MarketDataResponse):
    symbol: str
    period: str
    data: List[HistoricalPricePoint]

class Fundamentals(BaseModel):
    symbol: str
    market_cap: Optional[int] = None
    pe_ratio: Optional[float] = None
    eps: Optional[float] = None
    dividend_yield: Optional[float] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    sector: Optional[str] = None

class FundamentalsResponse(MarketDataResponse):
    data: Fundamentals

class TechnicalIndicators(BaseModel):
    symbol: str
    sma_50: Optional[float] = None
    sma_200: Optional[float] = None
    rsi_14: Optional[float] = None
    macd: Optional[float] = None
    macd_signal: Optional[float] = None

class TechnicalAnalysisResponse(MarketDataResponse):
    data: TechnicalIndicators
