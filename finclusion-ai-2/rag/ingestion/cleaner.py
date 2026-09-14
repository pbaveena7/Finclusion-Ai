import re

class TextCleaner:
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Cleans extracted text by removing noise, excessive whitespace, 
        and normalizes formatting.
        """
        if not text:
            return ""
            
        # 1. Remove HTML tags (if any slipped through)
        clean = re.sub(r'<[^>]+>', ' ', text)
        
        # 2. Remove URLs (often noisy in chunks, though we keep the source metadata)
        clean = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', clean)
        
        # 3. Normalize whitespace
        # Replace multiple spaces with a single space
        clean = re.sub(r' +', ' ', clean)
        # Replace 3 or more newlines with exactly 2 newlines (paragraph break)
        clean = re.sub(r'\n{3,}', '\n\n', clean)
        
        # 4. Remove unwanted special characters but keep financial symbols (₹, %, etc.)
        # This keeps alphanumerics, basic punctuation, and specific symbols
        clean = re.sub(r'[^\w\s.,;:!?()\[\]"\'%₹$-]', '', clean)
        
        return clean.strip()
        
    @staticmethod
    def extract_text_from_html(html_content: str) -> str:
        """
        Extracts raw text from HTML content (placeholder for BeautifulSoup logic).
        """
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "header", "footer", "nav"]):
                script.extract()
                
            text = soup.get_text(separator=' ')
            return TextCleaner.clean_text(text)
        except ImportError:
            # Fallback if bs4 is not installed
            return TextCleaner.clean_text(html_content)
