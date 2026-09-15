class RAGRetriever:
    def __init__(self, embedder, vector_store):
        self.embedder = embedder
        self.vector_store = vector_store

    def retrieve_context(self, query: str, top_k: int = 3) -> str:
        """
        Embeds the query, searches the vector store, and formats the retrieved chunks
        into a single context string that can be fed to the LLM.
        """
        # Embed the search query
        query_embedding = self.embedder.embed_query(query)
        
        # Search the database
        results = self.vector_store.search(query_embedding, top_k=top_k)
        
        if not results:
            return ""

        # Format context
        context_parts = []
        for res in results:
            source = res['metadata'].get('source', 'Unknown source')
            content = res['content']
            context_parts.append(f"--- SOURCE: {source} ---\n{content}\n")

        return "\n".join(context_parts)
