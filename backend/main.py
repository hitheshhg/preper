import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.core.config import settings

# Import API routers
from backend.api.health import router as health_router
from backend.api.auth import router as auth_router
from backend.api.resume import router as resume_router
from backend.api.interview import router as interview_router
from backend.api.gd import router as gd_router
from backend.api.dashboard import router as dashboard_router
from backend.api.coach import router as coach_router
from backend.api.skills import router as skills_router
from backend.api.roadmaps import router as roadmaps_router
from backend.api.gamification import router as gamification_router
from backend.api.catalog import router as catalog_router

app = FastAPI(
    title="PrepQuest API",
    description="Backend engine for PrepQuest: AI Placement Preparation Platform. Features Gemini AI, ATS Resume Intelligence, Adaptive Interviews, GD Simulator, and Gamified Readiness Engine.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "PrepQuest service encountered an unexpected error. Please try again shortly.",
            "detail": str(exc)
        }
    )

# Register API Routers with standard /api prefix
app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(resume_router, prefix="/api")
app.include_router(interview_router, prefix="/api")
app.include_router(gd_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(coach_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(roadmaps_router, prefix="/api")
app.include_router(gamification_router, prefix="/api")
app.include_router(catalog_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to PrepQuest API. Train smarter. Interview better. Get placed.",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=True
    )
