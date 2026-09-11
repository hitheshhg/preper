import uuid
import random
from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any
from backend.schemas.models import (
    GDPersona,
    GDCreateRequest,
    GDMessage,
    GDUserMessageRequest,
    GDSessionState,
    GDEvaluationResponse
)
from backend.services.ai_service import ai_service
from backend.api.auth import USER_PROFILES

router = APIRouter(prefix="/gd", tags=["Group Discussion Simulator"])

# 7 Distinct AI Personas as requested in Section 14
DEFAULT_PERSONAS = [
    GDPersona(
        id="p1",
        name="Aarav Sharma",
        role_type="The Leader",
        avatar="👑",
        traits="Confident, structured, sets the initial direction, seeks consensus."
    ),
    GDPersona(
        id="p2",
        name="Vikram Rao",
        role_type="The Aggressive Speaker",
        avatar="⚡",
        traits="Speaks loudly, frequently interrupts, questions others sharply, high energy."
    ),
    GDPersona(
        id="p3",
        name="Ananya Iyer",
        role_type="The Silent Expert",
        avatar="🧠",
        traits="Speaks rarely but delivers deeply impactful, precise, architectural points."
    ),
    GDPersona(
        id="p4",
        name="Rohan Mehta",
        role_type="The Data Person",
        avatar="📊",
        traits="Backs every argument with percentages, market surveys, and research data."
    ),
    GDPersona(
        id="p5",
        name="Kavya Nair",
        role_type="The Contrarian",
        avatar="🔄",
        traits="Challenges popular assumptions, plays devil's advocate to provoke deeper debate."
    ),
    GDPersona(
        id="p6",
        name="Priya Sengupta",
        role_type="The Moderator",
        avatar="⚖️",
        traits="Balances participation, calms heated exchanges, brings focus back to the core topic."
    ),
    GDPersona(
        id="p7",
        name="Sameer Khan",
        role_type="The Emotional Speaker",
        avatar="💡",
        traits="Persuasive, appeals to human ethics, societal impact, and employee well-being."
    )
]

DEFAULT_TOPICS = [
    "Artificial Intelligence in Engineering: Accelerator or Threat to Entry-Level Software Roles?",
    "Remote Work vs In-Office Collaboration: Which Model Better Fosters Innovation and Mentorship?",
    "Monolithic Architecture vs Microservices for High-Growth Tech Startups.",
    "Open-Source AI Models vs Proprietary Closed-Source Ecosystems: The Future of Computing."
]

GD_SESSIONS: Dict[str, Dict[str, Any]] = {}

@router.post("/create", response_model=GDSessionState)
def create_gd_session(data: GDCreateRequest):
    session_id = f"gd-{uuid.uuid4().hex[:8]}"
    topic = data.topic or random.choice(DEFAULT_TOPICS)

    # Select 4 AI participants for a balanced 5-person panel (4 AI + 1 user)
    selected_personas = random.sample(DEFAULT_PERSONAS, 4)

    # Initial opening message from The Leader or Moderator
    leader_persona = next((p for p in selected_personas if "Leader" in p.role_type or "Moderator" in p.role_type), selected_personas[0])
    
    first_msg = GDMessage(
        id="m1",
        sender_type="ai",
        speaker_name=leader_persona.name,
        speaker_persona=leader_persona.role_type,
        message=f"Good day everyone. Today's placement discussion topic is '{topic}'. To begin, I propose we look at both the technological leverage and the organizational trade-offs. I'd love to hear how the panel views this.",
        timestamp_seconds=5
    )

    GD_SESSIONS[session_id] = {
        "session_id": session_id,
        "topic": topic,
        "participants": [p.dict() for p in selected_personas],
        "messages": [first_msg.dict()],
        "status": "active"
    }

    return GDSessionState(
        session_id=session_id,
        topic=topic,
        participants=selected_personas,
        messages=[first_msg],
        status="active"
    )

@router.post("/message", response_model=GDSessionState)
def post_user_message(data: GDUserMessageRequest):
    session = GD_SESSIONS.get(data.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="GD session not found.")

    curr_messages = session["messages"]
    last_time = curr_messages[-1]["timestamp_seconds"] if curr_messages else 0

    # User message
    user_msg = GDMessage(
        id=f"m-{len(curr_messages) + 1}",
        sender_type="user",
        speaker_name="You (Candidate)",
        speaker_persona="Candidate",
        message=data.message,
        timestamp_seconds=last_time + 15
    )
    curr_messages.append(user_msg.dict())

    # AI bot reacts to user
    participants = session["participants"]
    responding_ai = random.choice(participants)

    history_formatted = [{"speaker": m["speaker_name"], "message": m["message"]} for m in curr_messages]
    
    ai_reply_text = ai_service.simulate_gd_speaker(
        topic=session["topic"],
        history=history_formatted,
        persona_name=responding_ai["name"],
        persona_role=responding_ai["role_type"],
        traits=responding_ai["traits"]
    )

    ai_msg = GDMessage(
        id=f"m-{len(curr_messages) + 1}",
        sender_type="ai",
        speaker_name=responding_ai["name"],
        speaker_persona=responding_ai["role_type"],
        message=ai_reply_text,
        timestamp_seconds=last_time + 30
    )
    curr_messages.append(ai_msg.dict())

    return GDSessionState(
        session_id=session["session_id"],
        topic=session["topic"],
        participants=[GDPersona(**p) for p in session["participants"]],
        messages=[GDMessage(**m) for m in curr_messages],
        status="active"
    )

@router.post("/{session_id}/complete", response_model=GDEvaluationResponse)
def complete_gd_session(session_id: str):
    session = GD_SESSIONS.get(session_id)
    topic = session["topic"] if session else "Placement Group Discussion"
    messages = [GDMessage(**m) for m in session["messages"]] if session else []

    evaluation = ai_service.evaluate_gd_session(topic=topic, messages=messages)

    if "demo-user-123" in USER_PROFILES:
        USER_PROFILES["demo-user-123"]["total_xp"] += evaluation.xp_earned
        USER_PROFILES["demo-user-123"]["communication_score"] = min(99, USER_PROFILES["demo-user-123"]["communication_score"] + 3)

    return evaluation
