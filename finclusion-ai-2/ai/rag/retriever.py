import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "ai", "rag", "faiss_index")

class FinclusionRetriever:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vectorstore = None
        
        # Load index if it exists
        if os.path.exists(FAISS_INDEX_PATH):
            try:
                self.vectorstore = FAISS.load_local(
                    FAISS_INDEX_PATH, 
                    self.embeddings, 
                    allow_dangerous_deserialization=True
                )
            except Exception as e:
                print(f"Failed to load FAISS index: {e}")
                
    def search(self, query: str, top_k: int = 2) -> str:
        """Searches the FAISS index and returns formatted context."""
        if not self.vectorstore:
            return "No verified knowledge base indexed."
            
        docs = self.vectorstore.similarity_search(query, k=top_k)
        
        if not docs:
            return "No relevant context found in knowledge base."
            
        context_parts = []
        for i, doc in enumerate(docs):
            source = os.path.basename(doc.metadata.get("source", "Unknown Document"))
            context_parts.append(f"[Source: {source}]\n{doc.page_content}")
            
        return "\n\n".join(context_parts)
