import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer

class FinclusionQLoRATrainer:
    """
    Configures and executes the QLoRA (Quantized Low-Rank Adaptation) fine-tuning loop.
    """
    def __init__(self, base_model_name: str = "mistralai/Mistral-7B-v0.1"):
        self.base_model_name = base_model_name
        self.device_map = "auto"

    def format_prompt(self, example):
        """Formats the JSONL row into the required prompt format for the model."""
        return f"<s>[INST] {example['instruction']} \n\nContext: {example['context']} [/INST] {example['response']} </s>"

    def train(self, dataset_path: str, output_dir: str):
        """Runs the 4-bit fine-tuning process."""
        print(f"Loading dataset from {dataset_path}")
        dataset = load_dataset("json", data_files=dataset_path, split="train")

        # 4-bit Quantization Config (reduces GPU memory significantly)
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16
        )

        print("Loading Base Model...")
        model = AutoModelForCausalLM.from_pretrained(
            self.base_model_name,
            quantization_config=bnb_config,
            device_map=self.device_map,
            trust_remote_code=True
        )
        model.config.use_cache = False

        tokenizer = AutoTokenizer.from_pretrained(self.base_model_name, trust_remote_code=True)
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.padding_side = "right"

        # LoRA Configuration
        print("Configuring PEFT/LoRA...")
        model = prepare_model_for_kbit_training(model)
        peft_config = LoraConfig(
            lora_alpha=16,
            lora_dropout=0.1,
            r=64,
            bias="none",
            task_type="CAUSAL_LM"
        )
        model = get_peft_model(model, peft_config)

        # Training Arguments
        training_args = TrainingArguments(
            output_dir=output_dir,
            per_device_train_batch_size=4,
            gradient_accumulation_steps=4,
            learning_rate=2e-4,
            logging_steps=10,
            max_steps=500, # Adjust based on dataset size
            optim="paged_adamw_32bit",
            save_steps=50,
            fp16=True,
            bf16=False,
            max_grad_norm=0.3,
            warmup_ratio=0.03,
            group_by_length=True,
            lr_scheduler_type="constant"
        )

        print("Initializing SFT Trainer...")
        trainer = SFTTrainer(
            model=model,
            train_dataset=dataset,
            peft_config=peft_config,
            max_seq_length=1024,
            tokenizer=tokenizer,
            args=training_args,
            formatting_func=lambda x: [self.format_prompt(e) for e in zip(x['instruction'], x['context'], x['response'])]
        )

        print("Starting Training...")
        trainer.train()
        
        print(f"Saving final adapter weights to {output_dir}")
        trainer.model.save_pretrained(output_dir)
        tokenizer.save_pretrained(output_dir)

if __name__ == "__main__":
    # Example usage:
    # trainer = FinclusionQLoRATrainer(base_model_name="mistralai/Mistral-7B-v0.1")
    # trainer.train(dataset_path="data/finclusion_instruct.jsonl", output_dir="./finclusion_adapter")
    pass
