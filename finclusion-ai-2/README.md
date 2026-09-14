# Finclusion AI 2.0

Finclusion AI is a full-stack, AI-powered financial education and planning platform designed to bring high-end fintech capabilities to users with limited digital literacy.

## Architecture
- **Frontend**: React, Vite, Tailwind CSS, Recharts (Voice-First UI & Dashboard).
- **Backend**: FastAPI, PostgreSQL, SQLAlchemy.
- **AI Orchestration**: LangGraph (11-step DAG).
- **Semantic Search**: FAISS Vector DB, HuggingFace Local Embeddings.
- **MCP Layer**: 18 Custom Financial Tools (Calculators, Market Data, Fraud Detection, Schemes).
- **MLOps**: PyTorch, PEFT/QLoRA for custom Educational LLM Fine-tuning.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- API Keys for HuggingFace, yFinance/AlphaVantage

### Environment Setup
1. Copy `.env.example` to `.env`.
2. Fill in your secure API keys and JWT secrets.

### Running with Docker
```bash
docker-compose up --build
```
- **React Frontend**: `http://localhost:5173`
- **FastAPI Backend**: `http://localhost:8000`
- **Swagger API Docs**: `http://localhost:8000/docs`

## Features
- **Walkie-Talkie UI**: Press the massive microphone to speak in English, Hindi, or Tamil. The AI reads responses aloud automatically.
- **Financial Fraud Engine**: Mathematically blocks unregulated crypto claims and unverified scheme recommendations.
- **Advanced Loan Planner**: Automatically calculates DTI (Debt-to-Income) ratios and issues educational warnings if debt exceeds 40%.
- **8-Pillar Health Score**: Generates transparent 0-100 scores and 4-week actionable improvement plans.
- **RAG Pipeline**: Fully local vector search over SEBI/Government documents to prevent LLM hallucination.

## Testing
Run the comprehensive math and engine test suite:
```bash
cd backend
pytest tests/
```
