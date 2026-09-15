import sys
from pathlib import Path

# Add backend directory to Python path so we can import app modules
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.services.rag_service import rag_service

if __name__ == "__main__":
    print("Starting RAG document ingestion pipeline...")
    rag_service.ingest_documents()
    print("Ingestion pipeline finished successfully!")
