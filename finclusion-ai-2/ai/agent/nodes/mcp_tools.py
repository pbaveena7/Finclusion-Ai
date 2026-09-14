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
        # Run the async provider method synchronously for the Langchain tool wrapper
        result = asyncio.run(market_provider.get_quote(symbol))
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
        result = asyncio.run(market_provider.get_historical_prices(symbol, period))
        # Format list to JSON string
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
    # Mocking the scheme MCP logic
    schemes = {
        "nps": "National Pension System. Market-linked retirement plan. Tax benefits under 80CCD(1B).",
        "ppf": "Public Provident Fund. 15-year lock-in. Sovereign guarantee. Exempt-Exempt-Exempt tax status.",
        "ssy": "Sukanya Samriddhi Yojana. For girl child education/marriage. High interest, tax free."
    }
    return schemes.get(scheme_name.lower(), "Scheme information not found in verified government database.")

@tool
def verify_fraud_risk(entity_name: str) -> str:
    """
    Mock MCP Tool: Checks the entity against SEBI's unregistered/banned entity lists.
    Use this whenever a user asks if an investment scheme or company is safe/legit.
    """
    # Mocking the fraud verification MCP logic
    if "guaranteed" in entity_name.lower() or "crypto" in entity_name.lower():
        return "WARNING: Entity flagged as high-risk or unregistered. Do not invest."
    return "Entity not found on SEBI banned list, but always exercise caution."

# List of tools to bind to the LLM
MCP_TOOLS = [get_stock_quote, get_historical_prices, check_government_scheme, verify_fraud_risk]
