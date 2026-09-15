import asyncio
from langchain_core.tools import tool
from mcp.market.providers.yfinance_impl import YFinanceProvider

# In a full production setup, these tools would communicate over stdio/HTTP with the MCP Server.
# Since we are in the same python monolith, we can instantiate the provider directly for simplicity,
# or use a local HTTP client to hit the MCP standard endpoints. 
# Here, we directly utilize the provider logic we built to avoid complex IPC in the prototype.

market_provider = YFinanceProvider()

@tool
def get_stock_quote(symbol: str) -> str:
    """
    Fetch real-time or delayed stock quote information (price, volume, high, low).
    Use this when the user asks about the current price or status of a specific stock.
    """
    try:
        clean_symbol = symbol.strip().upper()
        if not clean_symbol:
            return "Error: Stock symbol cannot be empty."
            
        result = asyncio.run(market_provider.get_quote(clean_symbol))
        return result.model_dump_json()
    except Exception as e:
        return f"Error fetching quote for {symbol}: {e}"

@tool
def get_historical_prices(symbol: str, period: str = "1mo") -> str:
    """
    Fetch time-series historical price data for a stock.
    Use this when the user asks about past performance or trends.
    """
    try:
        clean_symbol = symbol.strip().upper()
        if not clean_symbol:
            return "Error: Stock symbol cannot be empty."
            
        valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
        if period not in valid_periods:
            period = "1mo" # Fallback to a safe default
            
        result = asyncio.run(market_provider.get_historical_prices(clean_symbol, period))
        import json
        return json.dumps([r.model_dump() for r in result])
    except Exception as e:
        return f"Error fetching historical data for {symbol}: {e}"

@tool
def check_government_scheme(scheme_name: str) -> str:
    """
    Mock MCP Tool: Checks verified government scheme databases (like NPS, PPF, SSY).
    Use this when the user asks about government-backed savings or pension plans.
    """
    clean_name = scheme_name.strip().lower()
    
    schemes = {
        "nps": "National Pension System. Market-linked retirement plan. Tax benefits under 80CCD(1B).",
        "ppf": "Public Provident Fund. 15-year lock-in. Sovereign guarantee. Exempt-Exempt-Exempt tax status.",
        "ssy": "Sukanya Samriddhi Yojana. For girl child education/marriage. High interest, tax free.",
        "epf": "Employees' Provident Fund. Mandatory for salaried employees. Tax-free interest.",
        "pmjdy": "Pradhan Mantri Jan Dhan Yojana. Zero-balance savings account with insurance.",
        "scss": "Senior Citizen Savings Scheme. Safe investment for retirees with quarterly payouts."
    }
    
    # Partial matching to handle variations like "nps scheme" or "what is ppf"
    for key, value in schemes.items():
        if key in clean_name:
            return value
            
    return "Scheme information not found in verified government database. Please specify NPS, PPF, SSY, EPF, PMJDY, or SCSS."

@tool
def verify_fraud_risk(entity_name: str) -> str:
    """
    Mock MCP Tool: Checks the entity against SEBI's unregistered/banned entity lists.
    Use this whenever a user asks if an investment scheme or company is safe/legit.
    """
    clean_name = entity_name.strip().lower()
    
    high_risk_keywords = ["guaranteed", "crypto", "forex", "sure shot", "double money", "multi-level"]
    if any(keyword in clean_name for keyword in high_risk_keywords):
        return "WARNING: Entity flagged as high-risk or potentially unregistered. Do not invest without extreme caution."
        
    return "Entity not found on SEBI banned list, but always exercise caution."

from ai.calculators.mf_engine import MFEngine

@tool
def calculate_sip_goal(target_amount: float, years: int, expected_cagr: float, inflation_rate: float = 6.0) -> str:
    """
    Use this tool to calculate the exact monthly SIP needed to reach a specific financial goal (like 1 Crore or 50 Lakhs) over a period of time.
    Provide the target amount, investment duration in years, expected annual return (CAGR), and optionally inflation.
    """
    engine = MFEngine()
    try:
        res = engine.calculate_inflation_adjusted_goal(target_amount, years, inflation_rate, expected_cagr)
        return res.model_dump_json()
    except Exception as e:
        return f"Calculation error: {e}"

@tool
def calculate_step_up_sip(initial_monthly_sip: float, years: int, expected_cagr: float, step_up_percent: float = 10.0) -> str:
    """
    Use this tool to project the future value of a Step-Up SIP (where the monthly investment increases by a percentage every year).
    Provide the initial monthly SIP, years, expected CAGR, and step-up percentage.
    """
    engine = MFEngine()
    try:
        res = engine.calculate_step_up_sip(initial_monthly_sip, years, expected_cagr, step_up_percent)
        # Exclude yearly breakdown from LLM context to save tokens, only return summary
        summary = {k: v for k, v in res.items() if k != "yearly_breakdown"}
        import json
        return json.dumps(summary)
    except Exception as e:
        return f"Calculation error: {e}"

# List of tools to bind to the LLM
MCP_TOOLS = [get_stock_quote, get_historical_prices, check_government_scheme, verify_fraud_risk, calculate_sip_goal, calculate_step_up_sip]
