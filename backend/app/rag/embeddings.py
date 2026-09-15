from sentence_transformers import SentenceTransformer

class Embedder:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        # Load local model from HuggingFace
        self.model = SentenceTransformer(model_name)

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        """Converts a list of strings into a list of vector embeddings."""
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()

    def embed_query(self, query: str) -> list[float]:
        """Converts a single query string into a vector embedding."""
        embedding = self.model.encode([query], convert_to_numpy=True)
        return embedding[0].tolist()
