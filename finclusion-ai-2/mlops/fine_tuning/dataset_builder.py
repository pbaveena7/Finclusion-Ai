import json
import os
import fitz  # PyMuPDF
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from typing import List

# Strict prompt enforcing the exact schema, multilingual requirements, and safety constraints
SYNTHETIC_DATA_PROMPT = """
You are an expert financial educator in India.
I will provide you with a chunk of official text from SEBI, RBI, or a Govt Scheme.
Your task is to generate exactly 3 instruction-response pairs based ON THIS TEXT ONLY.

You must generate 1 pair in English, 1 pair in Hindi, and 1 pair in Tamil.

CRITICAL CONSTRAINTS:
- Responses MUST be simple and factually grounded.
- NEVER guarantee returns or provide personalized financial advice (e.g., never say "Buy this stock").
- ALWAYS explain risks.
- Use Indian financial examples and INR (₹).

Format your output exactly as a JSON array of objects following this schema:
[
  {{
    "instruction": "The user's question here...",
    "context": "The relevant snippet of text...",
    "response": "Your educational, safe answer...",
    "topic": "e.g., SIP, NPS, Mutual Funds, Inflation...",
    "difficulty": "beginner or intermediate",
    "language": "en | hi | ta"
  }}
]

Text Chunk:
{chunk}
"""

class MultilingualDatasetBuilder:
    """
    Parses official documents and uses a teacher model to generate highly-constrained, 
    multilingual (English, Hindi, Tamil) instruction datasets for LLM fine-tuning.
    """
    def __init__(self, teacher_api_key: str):
        self.teacher_llm = ChatOpenAI(
            model="gpt-4-turbo", 
            api_key=teacher_api_key, 
            temperature=0.1 # Low temp for factual consistency
        )
        self.prompt = PromptTemplate(input_variables=["chunk"], template=SYNTHETIC_DATA_PROMPT)

    def extract_text(self, pdf_path: str) -> List[str]:
        doc = fitz.open(pdf_path)
        chunks = []
        for page_num in range(len(doc)):
            text = doc.load_page(page_num).get_text("text").strip()
            if len(text) > 300: 
                chunks.append(text)
        return chunks

    def build_dataset(self, pdf_paths: List[str], output_jsonl_path: str):
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_jsonl_path), exist_ok=True)
        
        for path in pdf_paths:
            print(f"Processing {path}...")
            chunks = self.extract_text(path)
            
            with open(output_jsonl_path, "a", encoding="utf-8") as f:
                for chunk in chunks:
                    try:
                        response_str = self.teacher_llm.invoke(self.prompt.format(chunk=chunk)).content
                        
                        # Strip markdown if present
                        if response_str.startswith("```json"): response_str = response_str[7:]
                        if response_str.endswith("```"): response_str = response_str[:-3]
                        
                        pairs = json.loads(response_str.strip())
                        
                        for pair in pairs:
                            # Validate required fields before writing
                            required_keys = {"instruction", "context", "response", "topic", "difficulty", "language"}
                            if required_keys.issubset(pair.keys()):
                                f.write(json.dumps(pair, ensure_ascii=False) + "\n")
                            else:
                                print("Skipping malformed pair.")
                    except Exception as e:
                        print(f"Error generating pairs for chunk: {e}")
        
        print(f"Dataset successfully appended to {output_jsonl_path}")

if __name__ == "__main__":
    # Example usage for scaling to 2,000+ examples:
    # builder = MultilingualDatasetBuilder(teacher_api_key="your_openai_key")
    # builder.build_dataset(["data/official_sebi_circulars.pdf"], "data/finclusion_instruct.jsonl")
    pass
