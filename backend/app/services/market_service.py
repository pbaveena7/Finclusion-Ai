import yfinance as yf
from datetime import datetime, timedelta

def get_index_data(symbol: str, period: str = "1y"):
    """Fetches historical data for an index."""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        
        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": round(row['Close'], 2)
            })
            
        return data
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return []

def get_live_price(symbol: str) -> dict:
    """Fetches the live current price for a stock/index."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        current_price = info.get("currentPrice", info.get("regularMarketPrice", 0))
        previous_close = info.get("previousClose", 0)
        
        if current_price and previous_close:
            change_percent = ((current_price - previous_close) / previous_close) * 100
        else:
            change_percent = 0
            
        return {
            "symbol": symbol,
            "price": round(current_price, 2),
            "change_percent": round(change_percent, 2),
            "up": change_percent >= 0
        }
    except Exception as e:
        return {"error": str(e)}
