from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from backend.schemas.models import (
    ResumeAnalyzeRequest,
    ResumeAnalysisV2,
    ResumeVersionRecord,
    BulletRewriteRequest,
    ImprovedBullet,
    TailoredSummaryRequest,
    TailoredSummaryResponse
)
from backend.services.resume_parser import resume_parser
from backend.services.resume_service import resume_service

router = APIRouter(prefix="/resume", tags=["Resume Intelligence 2.0"])

@router.post("/upload", response_model=ResumeAnalysisV2)
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    target_role: str = Form("Software Development Engineer"),
    job_description: Optional[str] = Form(None),
    user_id: str = Form("demo-user-123")
):
    """
    Accepts PDF or DOCX file up to 10MB.
    Safely validates file signature, extracts text, and executes comprehensive AI Resume Intelligence audit.
    """
    filename = file.filename or "resume.pdf"
    content_type = file.content_type or ""

    try:
        content_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    extracted_text, err, metadata = resume_parser.extract_text_from_bytes(
        content_bytes,
        filename,
        content_type
    )

    if err:
        raise HTTPException(status_code=422, detail=err)

    # Perform production-grade AI analysis
    analysis = resume_service.analyze_resume(
        raw_text=extracted_text,
        filename=filename,
        target_role=target_role,
        job_description=job_description,
        user_id=user_id
    )

    return analysis

@router.post("/analyze", response_model=ResumeAnalysisV2)
def analyze_resume_text(data: ResumeAnalyzeRequest):
    """
    Direct text analysis endpoint with optional job description matching.
    """
    if not data.raw_text or len(data.raw_text.strip()) < 40:
        raise HTTPException(status_code=422, detail="Resume text is too short. Please provide comprehensive resume content.")

    analysis = resume_service.analyze_resume(
        raw_text=data.raw_text,
        filename="pasted_resume.txt",
        target_role=data.target_role or "Software Development Engineer",
        job_description=data.job_description,
        user_id=data.user_id or "demo-user-123"
    )

    return analysis

@router.get("/history/{user_id}", response_model=List[ResumeVersionRecord])
def get_user_resume_history(user_id: str):
    """
    Returns score history and version records across all uploaded resumes.
    """
    return resume_service.get_user_history(user_id)

@router.post("/generate-summary", response_model=TailoredSummaryResponse)
def generate_tailored_summary(data: TailoredSummaryRequest):
    """
    Generates a role-tailored professional summary based strictly on verified resume facts.
    """
    if not data.resume_text or len(data.resume_text.strip()) < 30:
        raise HTTPException(status_code=422, detail="Insufficient resume text to construct summary.")

    return resume_service.generate_summary(
        resume_text=data.resume_text,
        target_role=data.target_role or "Software Development Engineer"
    )

@router.post("/rewrite-bullet", response_model=ImprovedBullet)
def rewrite_bullet(data: BulletRewriteRequest):
    """
    Replaces passive duty phrasing with active leadership verbs and metric placeholders.
    """
    if not data.bullet_point or len(data.bullet_point.strip()) < 5:
        raise HTTPException(status_code=422, detail="Bullet point text is too short.")

    return resume_service.rewrite_bullet(
        bullet=data.bullet_point,
        target_role=data.target_role or "Software Engineer",
        context=data.project_context or ""
    )
