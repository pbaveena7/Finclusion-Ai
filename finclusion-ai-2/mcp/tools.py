from typing import Dict, Any, List

def build_schema(name: str, desc: str, required_props: Dict[str, Dict[str, str]]) -> Dict[str, Any]:
    return {
        "name": name,
        "description": desc,
        "parameters": {
            "type": "object",
            "properties": required_props,
            "required": list(required_props.keys())
        }
    }

FINCLUSION_MCP_TOOLS: List[Dict[str, Any]] = [
    # 1. Market Data Tools
    build_schema("get_stock_price", "Fetch real-time/delayed stock quote.", {"symbol": {"type": "string"}}),
    build_schema("get_stock_history", "Fetch time-series prices.", {"symbol": {"type": "string"}, "period": {"type": "string"}}),
    build_schema("get_stock_fundamentals", "Fetch P/E, Market Cap, EPS.", {"symbol": {"type": "string"}}),
    build_schema("compare_stocks", "Compare two stocks.", {"symbol_a": {"type": "string"}, "symbol_b": {"type": "string"}}),
    build_schema("get_mutual_fund_data", "Fetch NAV and MF details.", {"fund_id": {"type": "string"}}),
    build_schema("get_financial_news", "Fetch latest news for a ticker.", {"symbol": {"type": "string"}}),

    # 2. Calculators & Planners
    build_schema("calculate_sip", "Calculate Future Value of SIP.", {
        "monthly_investment": {"type": "number"}, "annual_rate": {"type": "number"}, "years": {"type": "integer"}
    }),
    build_schema("calculate_swp", "Calculate Systematic Withdrawal Plan.", {
        "corpus": {"type": "number"}, "monthly_withdrawal": {"type": "number"}, "annual_rate": {"type": "number"}
    }),
    build_schema("calculate_emi", "Advanced Loan & EMI Planning. Calculates amortization, DTI, and prepayment impact.", {
        "principal": {"type": "number"}, 
        "annual_rate": {"type": "number"}, 
        "years": {"type": "integer"},
        "processing_fee_percent": {"type": "number", "description": "Optional processing fee percentage (e.g. 1.5). Default 0."},
        "monthly_income": {"type": "number", "description": "Optional. Required for DTI warning calculation."},
        "existing_emi": {"type": "number", "description": "Optional. Existing monthly debt obligations."},
        "prepayment_amount": {"type": "number", "description": "Optional. Lumpsum prepayment amount."}
    }),
    build_schema("calculate_loan_cost", "Calculate total interest paid.", {
        "principal": {"type": "number"}, "emi": {"type": "number"}, "months": {"type": "integer"}
    }),

    # 3. Personal Finance & Goals
    build_schema("get_portfolio", "Fetch user's current portfolio.", {"user_id": {"type": "string"}}),
    build_schema("calculate_financial_health", "Calculate comprehensive 8-pillar health score.", {
        "monthly_income": {"type": "number"},
        "monthly_expenses": {"type": "number"},
        "emergency_fund_balance": {"type": "number"},
        "total_monthly_emi": {"type": "number"},
        "is_investing_diversified": {"type": "boolean"},
        "has_health_insurance": {"type": "boolean"},
        "has_life_insurance": {"type": "boolean"},
        "is_saving_for_retirement": {"type": "boolean"},
        "goals_on_track": {"type": "boolean"},
        "knowledge_level": {"type": "string", "description": "beginner, intermediate, or advanced"}
    }),
    build_schema("get_user_goals", "Fetch user's financial goals.", {"user_id": {"type": "string"}}),
    build_schema("generate_goal_plan", "Generate step-by-step goal plan.", {"goal_id": {"type": "string"}}),

    # 4. Government & Safety
    build_schema("search_government_scheme", "Discover and rank Government Schemes based on user profile.", {
        "age": {"type": "integer", "description": "Optional. User's age."},
        "gender": {"type": "string", "description": "Optional. 'male' or 'female'."},
        "primary_goal": {"type": "string", "description": "Optional. E.g., 'retirement', 'tax_saving', 'child_education'."}
    }),
    build_schema("check_scheme_eligibility", "Check if user is eligible for a scheme.", {"scheme_name": {"type": "string"}, "user_id": {"type": "string"}}),
    build_schema("verify_financial_entity", "Check if entity is registered.", {"entity_name": {"type": "string"}}),
    build_schema("check_fraud_signals", "Check entity against scam databases.", {"entity_name": {"type": "string"}})
]
