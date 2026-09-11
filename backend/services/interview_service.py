import uuid
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from backend.schemas.models import (
    InterviewCreateRequest,
    InterviewSessionResponse,
    InterviewQuestion,
    AnswerSubmitRequest,
    AdaptiveNextQuestionResponse,
    DetailedInterviewEvaluation,
    QuestionReviewItem,
    IntegrityEvent,
    CoachReaction
)
from backend.services.ai_service import ai_service
from backend.api.auth import USER_PROFILES

logger = logging.getLogger(__name__)

class InterviewService:
    """
    Stateful engine managing virtual mock interview sessions, adaptive questioning,
    integrity event tracking, and detailed performance evaluation.
    """

    def __init__(self):
        self._sessions: Dict[str, Dict[str, Any]] = {}

    def create_session(self, data: InterviewCreateRequest) -> InterviewSessionResponse:
        interview_id = f"interview-{uuid.uuid4().hex[:8]}"
        total_questions = max(3, min(20, data.question_count or 5))
        duration_minutes = data.duration_minutes or (10 if total_questions <= 5 else 20 if total_questions <= 10 else 30)

        # Generate initial question based on role, mode, company, and resume context
        first_question = ai_service.generate_initial_question(
            mode=data.mode,
            role=data.role,
            difficulty=data.difficulty
        )

        coach_intros = {
            "HR": "Welcome to your HR & Cultural Fit Interview. Speak with authenticity, structure, and professional presence.",
            "Technical": "Welcome to your Technical Assessment. Focus on foundational principles, clear architecture, and trade-offs.",
            "Behavioral": "Welcome to your Behavioral Interview. Structure your responses using the STAR method: Situation, Task, Action, Result.",
            "Mixed": "Welcome to your Full Placement Simulation. You'll be evaluated across technical rigor, communication, and situational leadership."
        }

        session_data = {
            "id": interview_id,
            "user_id": data.user_id or "demo-user-123",
            "mode": data.mode,
            "role": data.role,
            "difficulty": data.difficulty,
            "duration_minutes": duration_minutes,
            "total_questions": total_questions,
            "current_step": 1,
            "status": "in_progress",
            "created_at": datetime.now().isoformat(),
            "history": [], # List of answered questions + evaluations
            "current_question": first_question.dict(),
            "integrity_events": [],
            "integrity_score": 100
        }

        self._sessions[interview_id] = session_data

        return InterviewSessionResponse(
            interview_id=interview_id,
            mode=data.mode,
            role=data.role,
            difficulty=data.difficulty,
            duration_minutes=duration_minutes,
            current_question=first_question,
            total_questions=total_questions,
            current_step=1,
            coach_intro=CoachReaction(
                state="encouraging",
                message=coach_intros.get(data.mode, "Let's begin your placement interview rehearsal. Speak clearly and structure your reasoning.")
            )
        )

    def submit_answer(self, data: AnswerSubmitRequest) -> AdaptiveNextQuestionResponse:
        session = self._sessions.get(data.interview_id)
        if not session:
            logger.warning(f"Interview session {data.interview_id} not found in memory.")
            # Graceful session resurrection for resiliency
            session = {
                "id": data.interview_id,
                "user_id": "demo-user-123",
                "mode": "Technical",
                "role": "Software Development Engineer",
                "difficulty": "Medium",
                "duration_minutes": 15,
                "total_questions": 5,
                "current_step": 1,
                "status": "in_progress",
                "history": [],
                "current_question": {
                    "id": data.question_id,
                    "question_order": 1,
                    "question_text": "Describe how you approach software architecture design.",
                    "category": "Architecture",
                    "difficulty": "Medium",
                    "expected_concepts": ["Modularity", "Scalability", "Trade-offs"]
                },
                "integrity_events": [],
                "integrity_score": 100
            }
            self._sessions[data.interview_id] = session

        curr_q = session.get("current_question", {})
        current_step = session["current_step"]
        total_steps = session["total_questions"]

        # Record answer into session history
        history_entry = {
            "question_order": current_step,
            "question_id": curr_q.get("id", data.question_id),
            "question": curr_q.get("question_text", ""),
            "category": curr_q.get("category", "General"),
            "difficulty": curr_q.get("difficulty", session.get("difficulty", "Medium")),
            "expected_concepts": curr_q.get("expected_concepts", []),
            "answer": data.user_answer,
            "time_taken": data.time_taken_seconds
        }
        session["history"].append(history_entry)

        # Check if interview is completed
        if current_step >= total_steps:
            session["status"] = "completed"
            return AdaptiveNextQuestionResponse(
                is_completed=True,
                next_question=None,
                step=total_steps,
                total_steps=total_steps,
                is_followup=False,
                adapted_difficulty=session.get("difficulty", "Medium"),
                immediate_feedback="Interview complete! All questions answered. Synthesizing your comprehensive evaluation report...",
                coach_reaction=CoachReaction(
                    state="celebrating",
                    message="Superb effort! You completed the full interview. Generating your score report and model answer benchmarks now!"
                )
            )

        # Adaptively generate next question or contextual follow-up
        adaptive_result = ai_service.generate_adaptive_followup(
            mode=session["mode"],
            role=session["role"],
            current_step=current_step,
            previous_question=curr_q.get("question_text", ""),
            user_answer=data.user_answer,
            difficulty=session["difficulty"]
        )

        session["current_step"] = adaptive_result.step
        if adaptive_result.next_question:
            session["current_question"] = adaptive_result.next_question.dict()

        return adaptive_result

    def log_integrity_event(self, interview_id: str, event: IntegrityEvent) -> int:
        session = self._sessions.get(interview_id)
        if not session:
            return 100

        session["integrity_events"].append(event.dict())

        # Objective deductions:
        # TAB_SWITCH / WINDOW_BLUR: -4 pts
        # FULLSCREEN_EXIT: -5 pts
        # CAMERA_DISABLED / MICROPHONE_DISABLED: -8 pts
        deduction = 4 if event.event_type in ["TAB_SWITCH", "WINDOW_BLUR"] else 5 if event.event_type == "FULLSCREEN_EXIT" else 8
        session["integrity_score"] = max(40, session.get("integrity_score", 100) - deduction)
        return session["integrity_score"]

    def pause_session(self, interview_id: str):
        if interview_id in self._sessions:
            self._sessions[interview_id]["status"] = "paused"

    def resume_session(self, interview_id: str):
        if interview_id in self._sessions:
            self._sessions[interview_id]["status"] = "in_progress"

    def get_evaluation(self, interview_id: str) -> DetailedInterviewEvaluation:
        session = self._sessions.get(interview_id)
        history = session.get("history", []) if session else []
        mode = session.get("mode", "Technical") if session else "Technical"
        role = session.get("role", "Software Development Engineer") if session else "Software Development Engineer"
        integrity_events = [IntegrityEvent(**e) for e in session.get("integrity_events", [])] if session else []
        integrity_score = session.get("integrity_score", 100) if session else 100

        # Execute in-depth evaluation
        evaluation: DetailedInterviewEvaluation = ai_service.evaluate_interview_detailed(
            interview_id=interview_id,
            mode=mode,
            role=role,
            history=history,
            integrity_events=integrity_events,
            integrity_score=integrity_score
        )

        # Synchronize user gamification profile
        user_id = session.get("user_id", "demo-user-123") if session else "demo-user-123"
        if user_id in USER_PROFILES:
            profile = USER_PROFILES[user_id]
            profile["total_xp"] += evaluation.xp_earned
            profile["technical_score"] = min(98, max(50, int(profile.get("technical_score", 60) * 0.7 + evaluation.technical_score * 0.3)))
            profile["communication_score"] = min(98, max(50, int(profile.get("communication_score", 70) * 0.7 + evaluation.communication_score * 0.3)))
            profile["readiness_score"] = min(98, max(50, int(profile.get("readiness_score", 65) * 0.7 + evaluation.overall_score * 0.3)))

        return evaluation

interview_service = InterviewService()
