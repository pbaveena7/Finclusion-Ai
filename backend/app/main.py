"""
Finclusion AI 2.0 — FastAPI Backend
AI-Powered Financial Intelligence Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Finclusion AI 2.0",
    description="AI-Powered Financial Intelligence, Investment & Wealth Management Platform",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Configuration ────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──────────────────────────────────────────────
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Finclusion AI 2.0",
        "version": "2.0.0",
    }


@app.get("/")
async def root():
    return {
        "message": "Welcome to Finclusion AI 2.0 API",
        "docs": "/docs",
        "health": "/health",
    }


from app.routers import chat, market, auth
from app.db.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
# app.include_router(stocks.router, prefix="/api/stocks", tags=["Stocks"])
# app.include_router(mutual_funds.router, prefix="/api/mutual-funds", tags=["Mutual Funds"])
# app.include_router(goals.router, prefix="/api/goals", tags=["Goals"])
# app.include_router(schemes.router, prefix="/api/schemes", tags=["Government Schemes"])
# app.include_router(fraud.router, prefix="/api/fraud", tags=["Fraud Detection"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chat"])
app.include_router(market.router, prefix="/api/market", tags=["Live Market Data"])
