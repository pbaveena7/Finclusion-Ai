import json
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEndpoint
from ai.recommendation.models import UserProfileContext, RecommendationEngineResponse
from typing import Dict, Any

# Strict system prompt enforcing output structure and constraints
RECOMMENDATION_PROMPT = """
You are Finclusion AI, an expert financial educational assistant designed to help users in India understand their financial health.

CRITICAL CONSTRAINTS:
1. You must ONLY output a valid JSON object matching the requested schema. No markdown, no conversational text before or after the JSON.
2. DO NOT recommend investments based ONLY on gross income. You MUST factor in the 'true_disposable_income', 'debt_status', and 'emergency_fund_status'.
3. You CANNOT guarantee profits or say "Buy this stock". Use educational framing: "Potential strengths...", "Risks to consider...".
4. Every recommendation MUST clearly state 'why' it fits, 'risks', 'assumptions', and what the user must 'learn_first'.

USER FINANCIAL CONTEXT:
Profile: Age {age}, Knowledge Level: {knowledge_level}, Risk Tolerance: {risk_tolerance}
Gross Monthly Income: ₹{income}
Monthly Expenses: ₹{monthly_expenses}
Monthly EMI Obligations: ₹{emi_obligations}
Current Savings/Emergency Fund: ₹{savings_total}

DETERMINISTIC EVALUATION RESULTS:
Financial Health Status: {health_status} (Savings Rate: {savings_rate}%)
Debt-to-Income (DTI): {dti_pct}% - Status: {debt_status}
Emergency Fund Status: {emergency_status} (Shortfall: ₹{emergency_shortfall})
True Disposable Monthly Capacity: ₹{true_capacity}

Based on this evaluation, generate a highly personalized, educational financial plan formatted EXACTLY as this JSON schema:
{{
  "summary": "Educational summary of their financial health and capacity.",
  "disposable_income_assessment": "Explanation of true investment capacity after EMIs and expenses.",
  "recommendations": [
    {{
      "category": "One of: savings, emergency fund, SIP, mutual funds, NPS, PPF, government schemes, debt reduction, retirement planning",
      "title": "Actionable title",
      "why": "Why this option fits their profile.",
      "risks": "Specific risks involved.",
      "assumptions": "Assumptions made.",
      "learn_first": "What they must learn before acting."
    }}
  ],
  "disclaimer": "This is educational information based on provided inputs and does not constitute guaranteed financial advice."
}}
"""

class RecommendationGenerator:
    def __init__(self, llm_api_key: str):
        # Using a reliable HuggingFace instruct model suitable for JSON generation
        self.llm = HuggingFaceEndpoint(
            repo_id="mistralai/Mistral-7B-Instruct-v0.3",
            huggingfacehub_api_token=llm_api_key,
            temperature=0.2, # Low temp for structured adherence
            max_new_tokens=1024,
            model_kwargs={"stop": ["```"]}
        )
        self.prompt_template = PromptTemplate(
            input_variables=[
                "age", "knowledge_level", "risk_tolerance", "income", 
                "monthly_expenses", "emi_obligations", "savings_total",
                "health_status", "savings_rate", "dti_pct", "debt_status",
                "emergency_status", "emergency_shortfall", "true_capacity"
            ],
            template=RECOMMENDATION_PROMPT
        )
        
    def generate(self, profile: UserProfileContext, evaluations: Dict[str, Any]) -> RecommendationEngineResponse:
        """
        Takes the raw profile and the deterministic evaluation dict, constructs the prompt, 
        calls the LLM, and parses the returned JSON into the strict Pydantic schema.
        """
        # Format the prompt
        prompt_val = self.prompt_template.format(
            age=profile.age,
            knowledge_level=profile.financial_knowledge.value,
            risk_tolerance=profile.risk_tolerance.value,
            income=profile.income,
            monthly_expenses=profile.monthly_expenses,
            emi_obligations=profile.emi_obligations,
            savings_total=profile.savings + profile.emergency_fund,
            
            health_status=evaluations["health"]["status"],
            savings_rate=evaluations["health"]["savings_rate_pct"],
            dti_pct=evaluations["debt"]["dti_pct"],
            debt_status=evaluations["debt"]["status"],
            emergency_status=evaluations["emergency_fund"]["status"],
            emergency_shortfall=evaluations["emergency_fund"]["shortfall"],
            true_capacity=evaluations["capacity"]["true_disposable_income"]
        )
        
        # Call LLM
        response_text = self.llm.invoke(prompt_val)
        
        # Clean response text (sometimes LLMs wrap JSON in markdown blocks despite instructions)
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        response_text = response_text.strip()
        
        try:
            # Parse JSON and validate against strict Pydantic model
            raw_json = json.loads(response_text)
            return RecommendationEngineResponse(**raw_json)
        except Exception as e:
            raise ValueError(f"Failed to parse or validate LLM JSON response: {e}\nRaw Output: {response_text}")
