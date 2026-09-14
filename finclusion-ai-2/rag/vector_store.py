import os
from typing import List
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from rag.config import rag_settings

class VectorStoreManager:
    def __init__(self):
        # Initialize the embedding model (runs locally on CPU by default)
        print(f"Loading embedding model: {rag_settings.EMBEDDING_MODEL}")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=rag_settings.EMBEDDING_MODEL,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        self.index_path = os.path.join(rag_settings.VECTOR_DB_DIR, rag_settings.FAISS_INDEX_NAME)
        self.vector_store = None
        
        self.load_or_create_index()
        
    def load_or_create_index(self):
        """Loads an existing FAISS index or prepares to create a new one."""
        if os.path.exists(os.path.join(self.index_path, "index.faiss")):
            print(f"Loading existing FAISS index from {self.index_path}")
            self.vector_store = FAISS.load_local(
                self.index_path, 
                self.embeddings, 
                allow_dangerous_deserialization=True # required for local trusted files
            )
        else:
            print("No existing FAISS index found. A new one will be created upon adding documents.")
            self.vector_store = None
            
    def add_documents(self, documents: List[Document]):
        """Embeds and adds chunked documents to the FAISS index, then saves to disk."""
        if not documents:
            return
            
        if self.vector_store is None:
            print("Creating new FAISS index...")
            self.vector_store = FAISS.from_documents(documents, self.embeddings)
        else:
            print(f"Adding {len(documents)} documents to existing index...")
            self.vector_store.add_documents(documents)
            
        # Persist to disk
        self.vector_store.save_local(self.index_path)
        print(f"Index saved to {self.index_path}")
        
    def get_retriever(self, search_kwargs=None):
        """Returns a LangChain retriever interface for the vector store."""
        if self.vector_store is None:
            raise ValueError("Vector store is empty. Please add documents first.")
            
        if search_kwargs is None:
            search_kwargs = {"k": rag_settings.TOP_K}
            
        # We can use MMR (Maximal Marginal Relevance) for diversity, or standard similarity
        return self.vector_store.as_retriever(
            search_type="mmr", 
            search_kwargs=search_kwargs
        )
