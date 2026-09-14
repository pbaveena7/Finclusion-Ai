import torch
from mlops.fine_tuning.evaluate import load_model_and_tokenizer

class FinclusionInferenceEngine:
    """Provides a simple interface for chatting with the fine-tuned Finclusion model."""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.model, self.tokenizer = load_model_and_tokenizer(config_path)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
    def generate(self, instruction: str, context: str = "") -> str:
        """Generates an educational response based on the fine-tuned style."""
        
        # Format the prompt exactly how it was trained
        if context:
            prompt = f"<s>[INST] {instruction} \n\nContext: {context} [/INST]"
        else:
            prompt = f"<s>[INST] {instruction} [/INST]"
            
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.3,
            do_sample=True,
            top_p=0.9
        )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Strip the input prompt from the output
        return response.split("[/INST]")[-1].strip()

if __name__ == "__main__":
    # Example Usage:
    # engine = FinclusionInferenceEngine()
    # print(engine.generate("Explain the risks of Equity Mutual Funds.", context="Equity funds invest in shares of companies."))
    pass
