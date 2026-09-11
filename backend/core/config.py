import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "PrepQuest API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # AI Credentials
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    
    # Server configuration
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*"
    ]
    
    # Supabase (Optional on server-side if using client-side auth & token validation)
    NEXT_PUBLIC_SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Transparent Readiness Engine Weights (Must sum to 100)
    WEIGHT_TECHNICAL: float = 0.20
    WEIGHT_CODING: float = 0.15
    WEIGHT_COMMUNICATION: float = 0.15
    WEIGHT_HR: float = 0.10
    WEIGHT_RESUME: float = 0.10
    WEIGHT_PROBLEM_SOLVING: float = 0.15
    WEIGHT_CONSISTENCY: float = 0.15

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
