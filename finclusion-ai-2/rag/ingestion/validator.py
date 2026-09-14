from urllib.parse import urlparse
from typing import List

# List of domains considered strictly authoritative for Finclusion AI
AUTHORITATIVE_DOMAINS = [
    "sebi.gov.in",
    "rbi.org.in",
    "amfiindia.com",
    "pfrda.org.in",
    "india.gov.in",
    "incometaxindia.gov.in",
    "epfindia.gov.in",
    "nseindia.com",
    "bseindia.com",
    "nsdl.co.in",
    "cdslindia.com",
    "npci.org.in"
]

class SourceValidator:
    @staticmethod
    def is_authoritative(url: str) -> bool:
        """
        Validates if a given URL belongs to an authoritative financial domain.
        Rejects random blogs, social media, and unverified domains.
        """
        try:
            parsed_uri = urlparse(url)
            domain = parsed_uri.netloc.lower()
            
            # Remove 'www.' if present
            if domain.startswith("www."):
                domain = domain[4:]
                
            # Check against whitelist (exact match or subdomains)
            for auth_domain in AUTHORITATIVE_DOMAINS:
                if domain == auth_domain or domain.endswith(f".{auth_domain}"):
                    return True
                    
            return False
        except Exception:
            return False

    @staticmethod
    def validate_document_source(url: str, enforce: bool = True) -> bool:
        """
        Validates a source and optionally raises an exception if not authoritative.
        """
        is_valid = SourceValidator.is_authoritative(url)
        if enforce and not is_valid:
            raise ValueError(
                f"Source Rejected: {url} is not an recognized authoritative financial source. "
                f"Allowed domains include: {', '.join(AUTHORITATIVE_DOMAINS[:3])}..."
            )
        return is_valid
