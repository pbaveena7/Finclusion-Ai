from fastapi import APIRouter
from app.services.market_service import get_index_data, get_live_price

router = APIRouter()

@router.get("/indices")
def get_indices():
    """Returns 1-year historical data for major Indian indices."""
    nifty = get_index_data("^NSEI")
    sensex = get_index_data("^BSESN")
    
    return {
        "nifty": nifty,
        "sensex": sensex
    }

@router.get("/quote/{symbol}")
def get_quote(symbol: str):
    """Returns live price for a specific symbol."""
    return get_live_price(symbol)
