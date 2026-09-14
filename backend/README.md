# Finclusion AI 2.0 — Backend

AI-Powered Financial Intelligence Platform — FastAPI Backend

## Architecture

```
backend/
├── app/
│   ├── main.py           # FastAPI app, CORS, health check
│   ├── routers/           # API route handlers
│   │   └── __init__.py    # Router stubs
│   └── models/
│       └── schemas.py     # Pydantic validation models
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variable template
└── README.md             # This file
```

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment
cp .env.example .env
# Edit .env with your API keys and database URLs

# 4. Run development server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints (Planned)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login (JWT) |
| `/api/portfolio` | GET | Get portfolio summary |
| `/api/stocks` | GET | List stocks with AI insights |
| `/api/stocks/{symbol}` | GET | Stock detail + analysis |
| `/api/mutual-funds` | GET | List mutual funds |
| `/api/mutual-funds/compare` | POST | Compare funds |
| `/api/goals` | GET/POST | CRUD financial goals |
| `/api/schemes` | GET | Government schemes |
| `/api/schemes/eligibility` | POST | Check eligibility |
| `/api/fraud/analyze` | POST | Analyze message for fraud |
| `/api/chat` | POST | AI chat message |
| `/api/chat/history` | GET | Chat history |
| `/api/news` | GET | Financial news |
| `/api/learning` | GET | Learning modules |

## Tech Stack

- **Framework**: FastAPI + Uvicorn
- **AI Orchestrator**: LangGraph + LangChain
- **LLM**: Hugging Face (Mistral-7B) / OpenAI
- **RAG**: FAISS + ChromaDB + Sentence Transformers
- **Database**: PostgreSQL (users, portfolio) + MongoDB (chat, content)
- **Auth**: JWT (python-jose) + bcrypt
