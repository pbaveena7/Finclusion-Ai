import yfinance as yf
from datetime import datetime
from typing import List, Dict, Any
from mcp.market.providers.base import MarketDataProvider
from mcp.market.core.schemas import (
    StockQuote, 
    HistoricalPricePoint, 
    Fundamentals, 
    TechnicalIndicators,
    DataStatus
)
from mcp.market.core.cache import cache_response

class YFinanceProvider(MarketDataProvider):
    """
    Concrete implementation of MarketDataProvider using yfinance.
    Note: yfinance data is typically delayed (15 mins) and free.
    """
    
    @property
    def provider_name(self) -> str:
        return "YFinance (Yahoo Finance)"
        
    @property
    def data_status(self) -> DataStatus:
        return DataStatus.DELAYED

    @cache_response(ttl_seconds=300) # Cache quotes for 5 mins
    async def get_quote(self, symbol: str) -> StockQuote:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        # Fallback if currentPrice is missing
        if 'currentPrice' not in info:
            hist = ticker.history(period="1d")
            if not hist.empty:
                info['currentPrice'] = hist['Close'].iloc[-1]
                
        return StockQuote(
            symbol=symbol,
            name=info.get('shortName') or info.get('longName'),
            current_price=info.get('currentPrice', 0.0),
            currency=info.get('currency', 'INR'),
            day_high=info.get('dayHigh') or info.get('regularMarketDayHigh'),
            day_low=info.get('dayLow') or info.get('regularMarketDayLow'),
            volume=info.get('volume') or info.get('regularMarketVolume'),
            previous_close=info.get('previousClose')
        )

    @cache_response(ttl_seconds=3600) # Cache history for 1 hour
    async def get_historical_prices(self, symbol: str, period: str) -> List[HistoricalPricePoint]:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        
        if hist.empty:
            return []
            
        points = []
        # Convert index to string dates
        hist.index = hist.index.strftime('%Y-%m-%d')
        for date_str, row in hist.iterrows():
            points.append(HistoricalPricePoint(
                date=date_str,
                close=row.get('Close', 0.0),
                high=row.get('High', 0.0),
                low=row.get('Low', 0.0),
                open=row.get('Open', 0.0),
                volume=int(row.get('Volume', 0))
            ))
            
        return points

    @cache_response(ttl_seconds=86400) # Cache fundamentals for 24 hours
    async def get_fundamentals(self, symbol: str) -> Fundamentals:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        return Fundamentals(
            symbol=symbol,
            market_cap=info.get('marketCap'),
            pe_ratio=info.get('trailingPE'),
            eps=info.get('trailingEps'),
            dividend_yield=info.get('dividendYield'),
            fifty_two_week_high=info.get('fiftyTwoWeekHigh'),
            fifty_two_week_low=info.get('fiftyTwoWeekLow'),
            sector=info.get('sector')
        )

    async def get_technicals(self, symbol: str) -> TechnicalIndicators:
        # For technicals, we would typically fetch historical data 
        # and run pandas/ta calculations. Leaving this as a placeholder 
        # to focus on the provider interface implementation.
        return TechnicalIndicators(symbol=symbol)
