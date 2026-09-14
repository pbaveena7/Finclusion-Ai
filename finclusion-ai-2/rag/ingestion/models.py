from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from datetime import date
from enum import Enum

class OrganizationEnum(str, Enum):
    SEBI = "SEBI"
    RBI = "RBI"
    AMFI = "AMFI"
    PFRDA = "PFRDA"
    GOVT = "Government of India"
    NSE = "NSE"
    BSE = "BSE"
    OTHER_OFFICIAL = "Other Official Institution"

class DocumentTypeEnum(str, Enum):
    CIRCULAR = "Circular"
    FAQ = "FAQ"
    GUIDELINE = "Guideline"
    MASTER_CIRCULAR = "Master Circular"
    SCHEME_DOCUMENT = "Scheme Document"
    EDUCATIONAL = "Educational Material"
    REPORT = "Report"

class TopicEnum(str, Enum):
    SIP = "SIP"
    SWP = "SWP"
    MUTUAL_FUNDS = "Mutual Funds"
    NPS = "NPS"
    PPF = "PPF"
    APY = "APY"
    SUKANYA_SAMRIDDHI = "Sukanya Samriddhi"
    ETF = "ETFs"
    STOCKS = "Stocks"
    TAXATION = "Taxation"
    LOANS = "Loans"
    EMI = "EMI"
    FINANCIAL_LITERACY = "Financial Literacy"
    INVESTMENT_RISKS = "Investment Risks"
    GOVT_SCHEMES = "Government Schemes"
    GENERAL = "General Finance"

class DocumentMetadata(BaseModel):
    source: str = Field(..., description="URL or Document name acting as the primary source citation.")
    organization: OrganizationEnum
    document_type: DocumentTypeEnum
    date: date = Field(..., description="Original publication date of the document.")
    last_updated: date = Field(..., description="The date the document was last revised or scraped (used for freshness).")
    topic: TopicEnum
    language: str = Field(default="en", description="Language code (e.g., 'en', 'hi').")
    
    # Internal tracking
    chunk_id: Optional[str] = None
    
    class Config:
        use_enum_values = True
