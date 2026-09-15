import os
from pathlib import Path
import pypdf

class DocumentLoader:
    def __init__(self, documents_dir: str):
        self.documents_dir = Path(documents_dir)

    def load_all_documents(self):
        """Loads all .txt, .md, and .pdf files from the documents directory."""
        docs = []
        if not self.documents_dir.exists():
            return docs

        for filepath in self.documents_dir.rglob("*"):
            if filepath.is_file():
                ext = filepath.suffix.lower()
                text = ""
                try:
                    if ext in [".txt", ".md"]:
                        with open(filepath, "r", encoding="utf-8") as f:
                            text = f.read()
                    elif ext == ".pdf":
                        with open(filepath, "rb") as f:
                            pdf = pypdf.PdfReader(f)
                            for page in pdf.pages:
                                page_text = page.extract_text()
                                if page_text:
                                    text += page_text + "\n"
                    
                    if text.strip():
                        docs.append({
                            "content": text,
                            "metadata": {"source": str(filepath.name)}
                        })
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
        return docs
