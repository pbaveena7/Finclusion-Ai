import re
from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from rag.config import rag_settings

class Preprocessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=rag_settings.CHUNK_SIZE,
            chunk_overlap=rag_settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
        )
        
    def clean_text(self, text: str) -> str:
        """
        Cleans the input text by removing excessive whitespace, 
        HTML tags, and normalizes characters.
        """
        if not text:
            return ""
            
        # Remove HTML tags
        clean = re.sub(r'<.*?>', '', text)
        
        # Replace multiple spaces/newlines with a single space/newline
        clean = re.sub(r' +', ' ', clean)
        clean = re.sub(r'\n{3,}', '\n\n', clean)
        
        return clean.strip()
        
    def chunk_documents(self, documents: List[Document]) -> List[Document]:
        """
        Takes a list of LangChain Documents, cleans their page_content, 
        and splits them into smaller chunks.
        """
        # Clean before chunking
        for doc in documents:
            doc.page_content = self.clean_text(doc.page_content)
            
        # Split into chunks
        chunks = self.text_splitter.split_documents(documents)
        return chunks
        
    def process_raw_text(self, text: str, metadata: dict = None) -> List[Document]:
        """
        Helper method to process a raw string directly into Document chunks.
        """
        if metadata is None:
            metadata = {}
            
        cleaned_text = self.clean_text(text)
        doc = Document(page_content=cleaned_text, metadata=metadata)
        
        return self.chunk_documents([doc])
