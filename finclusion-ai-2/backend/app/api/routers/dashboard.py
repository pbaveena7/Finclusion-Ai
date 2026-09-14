from fastapi import APIRouter

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/")
async def get_dashboard_data():
    # Hardcoded prototype data to serve the React frontend smoothly
    return {
        "net_worth": {
            "total": 620000,
            "growth_percentage": 18.5,
            "comparison_text": "vs last year"
        },
        "portfolio_history": [
            {"name": "Jan", "value": 400000},
            {"name": "Feb", "value": 450000},
            {"name": "Mar", "value": 420000},
            {"name": "Apr", "value": 500000},
            {"name": "May", "value": 550000},
            {"name": "Jun", "value": 620000},
        ],
        "asset_allocation": [
            {"name": "Stocks", "value": 60, "color": "#10b981"},
            {"name": "Mutual Funds", "value": 25, "color": "#3b82f6"},
            {"name": "Govt Schemes", "value": 15, "color": "#f59e0b"},
        ],
        "active_emi": {
            "amount": 14500,
            "description": "Car Loan • 34 Months Remaining",
            "dti_percentage": 42
        }
    }
