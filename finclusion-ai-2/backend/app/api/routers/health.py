from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
import os

router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Comprehensive system health check for Docker/Kubernetes."""
    status = {
        "status": "healthy",
        "database": "disconnected",
        "faiss_index": "missing",
        "environment": os.getenv("ENVIRONMENT", "development")
    }
    
    # Check DB Connection
    try:
        db.execute(text("SELECT 1"))
        status["database"] = "connected"
    except Exception as e:
        status["status"] = "degraded"
        status["database"] = f"error: {str(e)}"
        
    # Check FAISS Index
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    if os.path.exists(os.path.join(base_dir, "ai", "rag", "faiss_index")):
        status["faiss_index"] = "ready"
    else:
        status["status"] = "degraded"
        
    return status
