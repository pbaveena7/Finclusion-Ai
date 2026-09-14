from abc import ABC, abstractmethod
from typing import List, Optional
from mcp.market.core.schemas import (
    StockQuote, 
    HistoricalPricePoint, 
    Fundamentals, 
    TechnicalIndicators,
    DataStatus
)

class MarketDataProvider(ABC):
    """
    Abstract base class defining the contract for all market data providers.
    Ensures the application can switch between backends (e.g., YFinance, NSE) without friction.
    """
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the name of the provider (e.g., 'YFinance')."""
        pass
        
    @property
    @abstractmethod
    def data_status(self) -> DataStatus:
        """Returns the typical status of the data (LIVE, DELAYED, SIMULATED)."""
        pass

    @abstractmethod
    async def get_quote(self, symbol: str) -> StockQuote:
        """Fetch real-time or delayed quote for a stock."""
        pass

    @abstractmethod
    async def get_historical_prices(self, symbol: str, period: str) -> List[HistoricalPricePoint]:
        """Fetch time-series price data for a given period (e.g., '1mo', '1y')."""
        pass

    @abstractmethod
    async def get_fundamentals(self, symbol: str) -> Fundamentals:
        """Fetch fundamental data like P/E, EPS, Market Cap."""
        pass

    @abstractmethod
    async def get_technicals(self, symbol: str) -> TechnicalIndicators:
        """Fetch technical indicators like SMA, RSI, MACD."""
        pass
