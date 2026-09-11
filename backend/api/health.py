from fastapi import APIRouter
from backend.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "gemini_configured": bool(settings.GEMINI_API_KEY and "your_gemini" not in settings.GEMINI_API_KEY),
        "environment": settings.ENVIRONMENT
    }
