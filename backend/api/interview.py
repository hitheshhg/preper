from fastapi import APIRouter, HTTPException
from backend.schemas.models import (
    InterviewCreateRequest,
    InterviewSessionResponse,
    AnswerSubmitRequest,
    AdaptiveNextQuestionResponse,
    DetailedInterviewEvaluation,
    IntegrityLogRequest
)
from backend.services.interview_service import interview_service

router = APIRouter(prefix="/interviews", tags=["Proctored AI Mock Interviews 2.0"])

@router.post("/create", response_model=InterviewSessionResponse)
def create_interview(data: InterviewCreateRequest):
    return interview_service.create_session(data)

@router.post("/answer", response_model=AdaptiveNextQuestionResponse)
def submit_answer(data: AnswerSubmitRequest):
    return interview_service.submit_answer(data)

@router.post("/integrity")
def log_integrity_event(data: IntegrityLogRequest):
    new_score = interview_service.log_integrity_event(data.interview_id, data.event)
    return {"status": "recorded", "integrity_score": new_score}

@router.post("/{interview_id}/pause")
def pause_interview(interview_id: str):
    interview_service.pause_session(interview_id)
    return {"status": "paused"}

@router.post("/{interview_id}/resume")
def resume_interview(interview_id: str):
    interview_service.resume_session(interview_id)
    return {"status": "resumed"}

@router.get("/{interview_id}/evaluation", response_model=DetailedInterviewEvaluation)
def get_interview_evaluation(interview_id: str):
    return interview_service.get_evaluation(interview_id)

