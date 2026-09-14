import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOCS_DIR = os.path.join(BASE_DIR, "docs")
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "ai", "rag", "faiss_index")

def ingest_documents():
    print("Loading documents...")
    # Load all txt files from the docs directory
    loader = DirectoryLoader(DOCS_DIR, glob="**/*.txt", loader_cls=TextLoader)
    documents = loader.load()
    
    print(f"Loaded {len(documents)} documents. Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len
    )
    chunks = text_splitter.split_documents(documents)
    
    print(f"Created {len(chunks)} chunks. Generating embeddings...")
    # Use lightweight local embeddings model
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    print("Building FAISS index...")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    
    print(f"Saving FAISS index to {FAISS_INDEX_PATH}...")
    vectorstore.save_local(FAISS_INDEX_PATH)
    print("Ingestion complete.")

if __name__ == "__main__":
    ingest_documents()
