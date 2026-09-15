import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth
from app.api.routers import chat
from app.api.routers import health
from app.api.routers import dashboard
from app.api.routers import fraud

app = FastAPI(
    title="Finclusion AI 2.0 Backend",
    description="Enterprise API powering the Voice-First Financial Assistant",
    version="2.0.0"
)

# Strict CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(dashboard.router)
app.include_router(fraud.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "finclusion-api"}
