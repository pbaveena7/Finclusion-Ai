import pandas as pd
import numpy as np
from ta.momentum import RSIIndicator
from ta.trend import MACD, SMAIndicator
from typing import List, Dict, Any, Tuple

class TechnicalCalculator:
    """
    Calculates technical indicators locally using Pandas and the 'ta' library.
    Avoids external API dependencies for calculations.
    """
    
    @staticmethod
    def calculate_indicators(historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Takes a list of dictionaries [{'date': '...', 'close': 100, 'volume': 1000}, ...]
        Returns a dictionary of current technical indicators.
        """
        if not historical_data or len(historical_data) < 50:
            # Need at least 50 days of data for SMA_50
            return {
                "sma_50": None, "sma_200": None, "rsi_14": None,
                "macd": None, "macd_signal": None, "price_trend": "Unknown",
                "volume_trend": "Unknown", "volatility_30d": None
            }

        # Convert to DataFrame
        df = pd.DataFrame(historical_data)
        
        # Ensure correct types
        df['close'] = pd.to_numeric(df.get('close', df.get('Close')), errors='coerce')
        df['volume'] = pd.to_numeric(df.get('volume', df.get('Volume')), errors='coerce')
        
        if df['close'].isnull().all():
            return {}

        # 1. SMAs
        sma_50_calc = SMAIndicator(close=df['close'], window=50).sma_indicator()
        sma_200_calc = SMAIndicator(close=df['close'], window=200).sma_indicator() if len(df) >= 200 else pd.Series([np.nan]*len(df))
        
        # 2. RSI (14 day)
        rsi_calc = RSIIndicator(close=df['close'], window=14).rsi()
        
        # 3. MACD
        macd_obj = MACD(close=df['close'])
        macd_line = macd_obj.macd()
        macd_signal = macd_obj.macd_signal()
        
        # 4. Volatility (30 day standard deviation of daily returns)
        returns = df['close'].pct_change()
        volatility_30d = returns.tail(30).std() * np.sqrt(252) * 100 # Annualized percentage
        
        # 5. Trends
        current_close = df['close'].iloc[-1]
        current_sma_50 = sma_50_calc.iloc[-1]
        
        price_trend = "Neutral"
        if not np.isnan(current_sma_50):
            if current_close > current_sma_50:
                price_trend = "Bullish"
            elif current_close < current_sma_50:
                price_trend = "Bearish"
                
        # Volume trend (Comparing last 5 days avg to previous 20 days avg)
        volume_trend = "Stable"
        if len(df) >= 25:
            recent_vol = df['volume'].tail(5).mean()
            past_vol = df['volume'].iloc[-25:-5].mean()
            if recent_vol > past_vol * 1.2:
                volume_trend = "Increasing"
            elif recent_vol < past_vol * 0.8:
                volume_trend = "Decreasing"

        return {
            "sma_50": float(current_sma_50) if not np.isnan(current_sma_50) else None,
            "sma_200": float(sma_200_calc.iloc[-1]) if not np.isnan(sma_200_calc.iloc[-1]) else None,
            "rsi_14": float(rsi_calc.iloc[-1]) if not np.isnan(rsi_calc.iloc[-1]) else None,
            "macd": float(macd_line.iloc[-1]) if not np.isnan(macd_line.iloc[-1]) else None,
            "macd_signal": float(macd_signal.iloc[-1]) if not np.isnan(macd_signal.iloc[-1]) else None,
            "price_trend": price_trend,
            "volume_trend": volume_trend,
            "volatility_30d": float(volatility_30d) if not np.isnan(volatility_30d) else None
        }
