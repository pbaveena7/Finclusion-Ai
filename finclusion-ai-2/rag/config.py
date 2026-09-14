import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class RAGSettings(BaseSettings):
    # Model Configurations
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    LLM_MODEL: str = "mistralai/Mistral-7B-Instruct-v0.3"
    
    # Vector DB Paths
    VECTOR_DB_DIR: str = os.path.join(os.path.dirname(__file__), "..", "data", "vector_store")
    FAISS_INDEX_NAME: str = "finclusion_faiss"
    
    # Chunking Parameters
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # Retrieval Parameters
    TOP_K: int = 5
    
    # API Keys (loaded from .env)
    HUGGINGFACE_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(__file__), "..", ".env"), extra="ignore")

rag_settings = RAGSettings()

# Ensure vector DB directory exists
os.makedirs(rag_settings.VECTOR_DB_DIR, exist_ok=True)
