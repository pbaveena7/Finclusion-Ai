import yfinance as yf
from typing import Dict, Any

class MarketAPIClient:
    """
    Client for fetching raw market data.
    Uses yfinance as a reliable, free placeholder for NSE/BSE data.
    """
    @staticmethod
    def fetch_stock_quote(symbol: str) -> Dict[str, Any]:
        """
        Fetches the latest quote and basic info for a given stock symbol.
        Note: For Indian stocks in yfinance, append '.NS' (NSE) or '.BO' (BSE).
        """
        ticker = yf.Ticker(symbol)
        
        try:
            # Fast fetch for current price/info
            info = ticker.info
            
            # If info is heavily restricted or missing 'currentPrice', try fetching history
            if not info or 'currentPrice' not in info:
                hist = ticker.history(period="1d")
                if not hist.empty:
                    info['currentPrice'] = hist['Close'].iloc[-1]
                    info['regularMarketDayHigh'] = hist['High'].iloc[-1]
                    info['regularMarketDayLow'] = hist['Low'].iloc[-1]
                    info['regularMarketVolume'] = hist['Volume'].iloc[-1]
            
            return info
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return {}
            
    @staticmethod
    def fetch_historical_data(symbol: str, period: str = "1mo") -> Dict[str, Any]:
        """
        Fetches historical price data. 
        Period options: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        """
        ticker = yf.Ticker(symbol)
        try:
            hist = ticker.history(period=period)
            if hist.empty:
                return {}
                
            # Convert pandas DataFrame to dictionary records
            # Format dates as strings
            hist.index = hist.index.strftime('%Y-%m-%d')
            return hist.to_dict('index')
        except Exception as e:
            print(f"Error fetching history for {symbol}: {e}")
            return {}
