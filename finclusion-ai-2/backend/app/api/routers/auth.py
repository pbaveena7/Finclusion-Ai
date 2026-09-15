from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import hashlib
import secrets

router = APIRouter(prefix="/api/auth", tags=["Auth"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# In-memory user store (replace with DB in production)
users_db = {
    "test@example.com": {
        "name": "Test User",
        "email": "test@example.com",
        "password": hash_password("password123"),
        "created_at": datetime.utcnow().isoformat()
    }
}
tokens_db = {}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    name: str
    email: str
    created_at: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(email: str) -> str:
    token = secrets.token_urlsafe(32)
    tokens_db[token] = {"email": email, "expires": datetime.utcnow() + timedelta(days=7)}
    return token

def get_current_user(token: str = Depends(oauth2_scheme)) -> Optional[dict]:
    if not token or token not in tokens_db:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token_data = tokens_db[token]
    if datetime.utcnow() > token_data["expires"]:
        del tokens_db[token]
        raise HTTPException(status_code=401, detail="Token expired")
    email = token_data["email"]
    user = users_db.get(email)
    if not user:
        # Return a mock user if they signed in with random credentials
        return {"name": "Test User", "email": email}
    return user

@router.post("/register")
async def register(request: RegisterRequest):
    if request.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users_db[request.email] = {
        "name": request.name,
        "email": request.email,
        "password": hash_password(request.password),
        "created_at": datetime.utcnow().isoformat()
    }
    
    token = create_token(request.email)
    return {"access_token": token, "token_type": "bearer", "user": {"name": request.name, "email": request.email}}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # DEV MODE: Accept ANY email and password and immediately sign them in.
    token = create_token(form_data.username)
    return {"access_token": token, "token_type": "bearer", "user": {"name": "Test User", "email": form_data.username}}

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"name": current_user["name"], "email": current_user["email"]}
