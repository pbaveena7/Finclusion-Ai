import os
from pathlib import Path
from app.rag.loader import DocumentLoader
from app.rag.chunker import DocumentChunker
from app.rag.embeddings import Embedder
from app.rag.vector_store import ChromaVectorStore
from app.rag.retriever import RAGRetriever

class RAGService:
    def __init__(self):
        # Base paths
        self.base_dir = Path(__file__).resolve().parent.parent.parent
        self.documents_dir = self.base_dir / "app" / "documents"
        self.chroma_dir = self.base_dir / "data" / "chroma_db"
        
        # Ensure directories exist
        self.documents_dir.mkdir(parents=True, exist_ok=True)
        self.chroma_dir.mkdir(parents=True, exist_ok=True)

        # Initialize core RAG components lazily to avoid huge loading times on fast API startup
        self._embedder = None
        self._vector_store = None
        self._retriever = None

    @property
    def embedder(self):
        if self._embedder is None:
            self._embedder = Embedder()
        return self._embedder

    @property
    def vector_store(self):
        if self._vector_store is None:
            self._vector_store = ChromaVectorStore(str(self.chroma_dir))
        return self._vector_store

    @property
    def retriever(self):
        if self._retriever is None:
            self._retriever = RAGRetriever(self.embedder, self.vector_store)
        return self._retriever

    def get_context_for_query(self, query: str, top_k: int = 3) -> str:
        """Retrieves financial context for a given query."""
        try:
            return self.retriever.retrieve_context(query, top_k=top_k)
        except Exception as e:
            print(f"Warning: RAG retrieval failed: {e}")
            return ""

    def ingest_documents(self):
        """Pipeline to load, chunk, embed, and store all documents."""
        print(f"Loading documents from {self.documents_dir}...")
        loader = DocumentLoader(str(self.documents_dir))
        docs = loader.load_all_documents()
        
        if not docs:
            print("No documents found to ingest.")
            return

        print(f"Loaded {len(docs)} documents. Chunking...")
        chunker = DocumentChunker()
        chunks = chunker.chunk_documents(docs)
        
        print(f"Created {len(chunks)} chunks. Generating embeddings...")
        texts = [chunk["content"] for chunk in chunks]
        embeddings = self.embedder.embed_texts(texts)
        
        print(f"Storing into ChromaDB at {self.chroma_dir}...")
        self.vector_store.add_chunks(chunks, embeddings)
        print("Ingestion complete!")

# Singleton instance
rag_service = RAGService()
