import yaml
import torch
import os
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
from huggingface_hub import login

def format_prompt(example):
    """Formats the instruction dataset into the Mistral instruct template."""
    return f"<s>[INST] {example['instruction']} \n\nContext: {example['context']} [/INST] {example['response']} </s>"

def main():
    # Load Config
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    # 1. Dataset Loading & Train/Val Split
    print(f"Loading dataset from {config['data']['dataset_path']}...")
    dataset = load_dataset("json", data_files=config['data']['dataset_path'], split="train")
    
    # Split into Train and Validation
    dataset_split = dataset.train_test_split(test_size=1.0 - config['data']['train_split_ratio'], seed=42)
    train_dataset = dataset_split["train"]
    eval_dataset = dataset_split["test"]
    print(f"Train size: {len(train_dataset)} | Eval size: {len(eval_dataset)}")

    # 2. 4-bit Quantization (QLoRA)
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16 if config['training']['bf16'] else torch.float16
    )

    print(f"Loading Base Model: {config['model']['base_model_name']}...")
    model = AutoModelForCausalLM.from_pretrained(
        config['model']['base_model_name'],
        quantization_config=bnb_config,
        device_map=config['model']['device_map'],
        trust_remote_code=config['model']['trust_remote_code']
    )
    model.config.use_cache = False

    tokenizer = AutoTokenizer.from_pretrained(
        config['model']['base_model_name'], 
        trust_remote_code=config['model']['trust_remote_code']
    )
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    # 3. LoRA Configuration
    print("Configuring PEFT/LoRA...")
    model = prepare_model_for_kbit_training(model)
    peft_config = LoraConfig(
        r=config['lora']['r'],
        lora_alpha=config['lora']['lora_alpha'],
        lora_dropout=config['lora']['lora_dropout'],
        bias="none",
        task_type=config['lora']['task_type']
    )
    model = get_peft_model(model, peft_config)

    # 4. Training Arguments
    training_args = TrainingArguments(
        output_dir=config['training']['output_dir'],
        per_device_train_batch_size=config['training']['per_device_train_batch_size'],
        per_device_eval_batch_size=config['training']['per_device_eval_batch_size'],
        gradient_accumulation_steps=config['training']['gradient_accumulation_steps'],
        learning_rate=config['training']['learning_rate'],
        logging_steps=config['training']['logging_steps'],
        save_steps=config['training']['save_steps'],
        eval_steps=config['training']['eval_steps'],
        evaluation_strategy="steps",
        max_steps=config['training']['max_steps'],
        optim=config['training']['optim'],
        fp16=config['training']['fp16'],
        bf16=config['training']['bf16'],
        max_grad_norm=config['training']['max_grad_norm'],
        warmup_ratio=config['training']['warmup_ratio'],
        group_by_length=config['training']['group_by_length'],
        lr_scheduler_type=config['training']['lr_scheduler_type'],
        push_to_hub=config['hub']['push_to_hub'],
        hub_model_id=config['hub']['hub_model_id'] if config['hub']['push_to_hub'] else None
    )

    # 5. Initialize SFT Trainer
    print("Initializing SFT Trainer...")
    trainer = SFTTrainer(
        model=model,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        peft_config=peft_config,
        max_seq_length=1024,
        tokenizer=tokenizer,
        args=training_args,
        formatting_func=lambda x: [format_prompt(e) for e in zip(x['instruction'], x['context'], x['response'])]
    )

    # 6. Train and Save
    print("Starting Training...")
    trainer.train()
    
    print(f"Saving final adapter weights to {config['training']['output_dir']}")
    trainer.model.save_pretrained(config['training']['output_dir'])
    tokenizer.save_pretrained(config['training']['output_dir'])

    # 7. Push to Hub
    if config['hub']['push_to_hub']:
        print(f"Pushing model to Hugging Face Hub: {config['hub']['hub_model_id']}")
        # Ensure HF_TOKEN env var is set
        login(token=os.environ.get("HF_TOKEN"))
        trainer.model.push_to_hub(config['hub']['hub_model_id'])
        tokenizer.push_to_hub(config['hub']['hub_model_id'])
        print("Push complete!")

if __name__ == "__main__":
    main()
