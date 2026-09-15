from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentChunker:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""]
        )

    def chunk_documents(self, documents):
        """Chunks a list of document dicts into smaller text chunks."""
        chunks = []
        for doc in documents:
            content = doc["content"]
            metadata = doc["metadata"]
            
            splits = self.splitter.split_text(content)
            for i, split in enumerate(splits):
                chunks.append({
                    "content": split,
                    "metadata": {**metadata, "chunk_id": f"{metadata['source']}_{i}"}
                })
        return chunks
