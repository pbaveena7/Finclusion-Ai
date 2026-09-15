import os
import json
from openai import AsyncOpenAI
from app.agents.advisor_agent import AdvisorAgent
from app.agents.fraud_agent import FraudAgent
from app.agents.goal_agent import GoalAgent

class AgentRouter:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.advisor = AdvisorAgent()
        self.fraud = FraudAgent()
        self.goal = GoalAgent()

    async def classify_intent(self, query: str) -> str:
        """Uses a fast, lightweight LLM call to classify the user's intent."""
        system_prompt = """
You are a strict routing system. Analyze the user's query and output exactly ONE of these words based on the intent:
- FRAUD: If the query is about scams, phishing, suspicious links, unknown callers asking for OTPs, or "guaranteed" high returns.
- GOAL: If the query is about calculating returns, SIP mathematics, EMI, retirement planning, or asking "how much will I have if...".
- ADVICE: For all other general financial questions, concepts, or advice (e.g. "what is SIP", "how does mutual fund work").

Output ONLY the exact word (FRAUD, GOAL, or ADVICE). No other text.
"""
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                temperature=0.0,
                max_tokens=10,
            )
            intent = response.choices[0].message.content.strip().upper()
            if intent not in ["FRAUD", "GOAL", "ADVICE"]:
                return "ADVICE" # Default fallback
            return intent
        except Exception as e:
            print(f"Router classification error: {e}")
            return "ADVICE" # Fallback on error

    async def route_query(self, query: str, history: list, language: str) -> str:
        """Classifies the query and hands it off to the appropriate specialized agent."""
        
        # 1. Classify Intent
        intent = await self.classify_intent(query)
        print(f"[Router] Query classified as: {intent}")

        # 2. Hand off to specialized agent
        if intent == "FRAUD":
            return await self.fraud.process(query, history, language)
        elif intent == "GOAL":
            return await self.goal.process(query, history, language)
        else:
            return await self.advisor.process(query, history, language)

# Singleton instance
agent_router = AgentRouter()
