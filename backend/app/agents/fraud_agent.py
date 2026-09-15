import os
from openai import AsyncOpenAI

class FraudAgent:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def process(self, query: str, history: list, language: str) -> str:
        """Processes queries related to scams, phishing, and risky schemes."""
        
        system_prompt = f"""
You are the Finclusion AI Fraud Detection Agent.
Your sole purpose is to protect users from financial scams, phishing, and unsafe investments.
If a user asks about high guaranteed returns, share OTPs, or suspicious calls, strongly warn them immediately.
Be firm, clear, and prioritize their financial safety above all else.
Please reply in {language}. Keep responses concise and highly actionable.
"""
        
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history[-3:]: # Only need recent context for fraud
            messages.append({"role": msg.role, "content": msg.content})
        
        if not history or history[-1].content != query:
            messages.append({"role": "user", "content": query})

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.3, # Low temperature for strict, consistent warnings
                max_tokens=800,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Fraud Agent Error: {str(e)}"
