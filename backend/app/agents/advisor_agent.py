import os
from openai import AsyncOpenAI
from app.services.rag_service import rag_service

class AdvisorAgent:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def process(self, query: str, history: list, language: str) -> str:
        """Processes general financial queries using RAG context."""
        
        # 1. Retrieve RAG context
        context = rag_service.get_context_for_query(query)
        context_prompt = f"\n\nHere is trustworthy information from your financial database. Use it to answer the user's question:\n{context}\n" if context else ""

        # 2. Build strict Advisor system prompt
        system_prompt = f"""
You are the Finclusion AI Advisor Agent.
Your role is to explain financial concepts (SIP, SWP, mutual funds, NPS, PPF, ETFs) clearly and accurately.
Do NOT give personalized investment advice or guarantee returns.
Always mention risks when discussing investments.
Please reply in {language}. Keep responses concise but informative.{context_prompt}
"""
        
        # 3. Format messages for OpenAI
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add the current query if it's not already the last message in history
        if not history or history[-1].content != query:
            messages.append({"role": "user", "content": query})

        # 4. Call LLM
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Advisor Agent Error: {str(e)}"
