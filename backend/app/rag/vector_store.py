import chromadb
from pathlib import Path

class ChromaVectorStore:
    def __init__(self, persist_dir: str, collection_name: str = "finclusion_docs"):
        # Make sure the directory exists
        Path(persist_dir).mkdir(parents=True, exist_ok=True)
        
        # Initialize ChromaDB client with persistence
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def add_chunks(self, chunks: list[dict], embeddings: list[list[float]]):
        """Adds text chunks and their corresponding embeddings to the vector store."""
        if not chunks:
            return

        ids = [chunk["metadata"]["chunk_id"] for chunk in chunks]
        documents = [chunk["content"] for chunk in chunks]
        metadatas = [chunk["metadata"] for chunk in chunks]

        # Upsert allows adding new chunks or updating existing ones with the same ID
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def search(self, query_embedding: list[float], top_k: int = 3):
        """Searches the vector store for the top_k most similar chunks."""
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        # Format results
        formatted_results = []
        if results and results["documents"] and results["documents"][0]:
            for i in range(len(results["documents"][0])):
                formatted_results.append({
                    "content": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if "distances" in results else None
                })
        return formatted_results
