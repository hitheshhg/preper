from fastapi import APIRouter
from backend.schemas.models import CoachChatRequest, CoachChatResponse
from backend.services.ai_service import ai_service
from backend.api.auth import USER_PROFILES

router = APIRouter(prefix="/coach", tags=["AI Career Coach"])

@router.post("/chat", response_model=CoachChatResponse)
def chat_with_coach(data: CoachChatRequest):
    user_id = data.user_id or "demo-user-123"
    profile = USER_PROFILES.get(user_id, {
        "full_name": "Student",
        "target_role": "Software Engineer",
        "readiness_score": 70,
        "current_streak": 3,
        "current_level": 1
    })

    history_dicts = [{"role": m.role, "content": m.content} for m in (data.conversation_history or [])]
    
    response = ai_service.coach_chat(
        user_profile=profile,
        history=history_dicts,
        message=data.message
    )
    return response
