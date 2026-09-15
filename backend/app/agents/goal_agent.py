import os
import json
from openai import AsyncOpenAI
from app.tools.calculators import calculate_sip, calculate_emi, calculate_swp
from app.services.market_service import get_live_price

class GoalAgent:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "calculate_sip",
                    "description": "Calculates the future value and wealth gained from a Systematic Investment Plan (SIP).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "monthly_investment": {"type": "number", "description": "The monthly investment amount in INR."},
                            "annual_rate": {"type": "number", "description": "The expected annual return rate percentage."},
                            "years": {"type": "integer", "description": "The investment duration in years."}
                        },
                        "required": ["monthly_investment", "annual_rate", "years"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "calculate_emi",
                    "description": "Calculates the exact Equated Monthly Installment (EMI) for a loan.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "principal": {"type": "number", "description": "The total loan amount in INR."},
                            "annual_rate": {"type": "number", "description": "The annual interest rate percentage."},
                            "years": {"type": "integer", "description": "The loan tenure in years."}
                        },
                        "required": ["principal", "annual_rate", "years"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "calculate_swp",
                    "description": "Calculates the sustainability of a Systematic Withdrawal Plan (SWP).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "total_investment": {"type": "number", "description": "The total initial investment in INR."},
                            "monthly_withdrawal": {"type": "number", "description": "The monthly withdrawal amount in INR."},
                            "annual_rate": {"type": "number", "description": "The expected annual return rate percentage."},
                            "years": {"type": "integer", "description": "The withdrawal duration in years."}
                        },
                        "required": ["total_investment", "monthly_withdrawal", "annual_rate", "years"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_live_stock_price",
                    "description": "Fetches the real-time live stock price and percentage change for a given stock ticker symbol (e.g. 'RELIANCE.NS' for Indian stocks, 'AAPL' for US stocks).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "symbol": {"type": "string", "description": "The stock ticker symbol."}
                        },
                        "required": ["symbol"]
                    }
                }
            }
        ]

    async def process(self, query: str, history: list, language: str) -> str:
        system_prompt = f"""
You are the Finclusion AI Goal Planning Agent.
Your role is to help users with exact financial mathematics, SIP calculations, EMI planning, and goal setting.
ALWAYS use your available mathematical tools to calculate numbers. NEVER guess the math yourself.
Format the final mathematical results clearly using bullet points and native currency formatting (₹).
Please reply in {language}.
"""
        
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})
        
        if not history or history[-1].content != query:
            messages.append({"role": "user", "content": query})

        try:
            # First pass: Ask the LLM if it needs to use a tool
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=self.tools,
                tool_choice="auto",
                temperature=0.1,
            )
            
            response_message = response.choices[0].message
            
            # If the LLM wants to use a tool, execute it
            if response_message.tool_calls:
                messages.append(response_message)
                
                for tool_call in response_message.tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    print(f"[GoalAgent] Calling Tool: {function_name} with args {function_args}")
                    
                    # Execute the actual Python tool
                    if function_name == "calculate_sip":
                        function_response = calculate_sip(**function_args)
                    elif function_name == "calculate_emi":
                        function_response = calculate_emi(**function_args)
                    elif function_name == "calculate_swp":
                        function_response = calculate_swp(**function_args)
                    elif function_name == "get_live_stock_price":
                        function_response = get_live_price(**function_args)
                    else:
                        function_response = {"error": "Unknown tool"}
                        
                    # Append the tool's result to the message history
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(function_response),
                    })
                
                # Second pass: Let the LLM read the perfect mathematical result and format it for the user
                second_response = await self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    temperature=0.1,
                )
                return second_response.choices[0].message.content
            
            # If no tool was needed, just return the standard text response
            return response_message.content
            
        except Exception as e:
            print(f"Goal Agent Error: {str(e)}")
            return f"Goal Agent Error: {str(e)}"
