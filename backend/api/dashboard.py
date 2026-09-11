from fastapi import APIRouter
from typing import List, Dict, Any
from backend.schemas.models import (
    DashboardOverviewResponse,
    ProfileResponse,
    ReadinessBreakdown,
    QuestItem,
    WeakArea,
    CoachReaction
)
from backend.api.auth import USER_PROFILES, get_profile
from backend.services.readiness_engine import readiness_engine

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Recommendations"])

@router.get("", response_model=DashboardOverviewResponse)
@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(user_id: str = "demo-user-123"):
    profile = get_profile(user_id)
    prof_dict = profile.dict()

    readiness = readiness_engine.get_breakdown(prof_dict)

    # Dynamic quests for today
    todays_quests = [
        QuestItem(
            id="quest-1",
            title="Complete a 10-Minute HR Interview",
            description="Practice common introductory and behavioral placement questions.",
            category="HR",
            difficulty="Easy",
            estimated_minutes=10,
            xp_reward=60,
            is_completed=False,
            progress=0,
            target=1
        ),
        QuestItem(
            id="quest-2",
            title="Sharpen 3 Resume Project Bullets",
            description="Use AI recommendations to inject quantifiable impact metrics.",
            category="Resume",
            difficulty="Easy",
            estimated_minutes=8,
            xp_reward=50,
            is_completed=True,
            progress=3,
            target=3
        ),
        QuestItem(
            id="quest-3",
            title="Participate in a GD Room Turn",
            description="Speak at least twice in a multi-persona group discussion simulation.",
            category="GD",
            difficulty="Medium",
            estimated_minutes=12,
            xp_reward=75,
            is_completed=False,
            progress=1,
            target=2
        )
    ]

    # Rule-Based Recommendation Engine as specified in Section 48
    weak_areas: List[WeakArea] = []
    recommended_steps: List[str] = []

    # Communication check
    if prof_dict["communication_score"] < 70:
        weak_areas.append(WeakArea(
            category="Communication & Voice Articulation",
            current_score=prof_dict["communication_score"],
            status="Needs Work",
            recommended_action="Practice a 5-minute Behavioral STAR interview or join a GD room",
            action_link="/interview?mode=Behavioral"
        ))
        recommended_steps.append("Take a 5-question Behavioral mock interview to practice STAR answers.")
    else:
        weak_areas.append(WeakArea(
            category="Communication & Articulation",
            current_score=prof_dict["communication_score"],
            status="Improving",
            recommended_action="Maintain clarity by practicing impromptu speaking prompts",
            action_link="/gd"
        ))

    # Technical check
    if prof_dict["technical_score"] < 75:
        weak_areas.append(WeakArea(
            category="Operating Systems & DB Fundamentals",
            current_score=prof_dict["technical_score"],
            status="Needs Work",
            recommended_action="Review indexing, ACID transactions, and thread scheduling",
            action_link="/interview?mode=Technical"
        ))
        recommended_steps.append("Complete 1 Technical interview focusing on Core CS subjects.")
    else:
        weak_areas.append(WeakArea(
            category="Core Computer Science",
            current_score=prof_dict["technical_score"],
            status="Strong",
            recommended_action="Attempt Hard-difficulty System Design scenarios",
            action_link="/interview?mode=Technical"
        ))

    # Resume check
    if prof_dict["resume_score"] < 80:
        weak_areas.append(WeakArea(
            category="Resume ATS Impact Metrics",
            current_score=prof_dict["resume_score"],
            status="Needs Work",
            recommended_action="Elevate project descriptions with quantifiable percentages",
            action_link="/resume"
        ))
        recommended_steps.append("Use the AI Bullet Rewriter to add numbers to your e-commerce project.")

    # Always ensure 3-4 recommended steps
    if len(recommended_steps) < 3:
        recommended_steps.append("Solve 2 DSA questions on Tree Traversals and Binary Search.")
        recommended_steps.append("Consult Coach Questy for personalized guidance on upcoming campus drives.")

    # Weekly XP Activity
    weekly_xp = [
        {"day": "Mon", "xp": 40, "minutes": 15},
        {"day": "Tue", "xp": 80, "minutes": 25},
        {"day": "Wed", "xp": 60, "minutes": 20},
        {"day": "Thu", "xp": 110, "minutes": 35},
        {"day": "Fri", "xp": 90, "minutes": 30},
        {"day": "Sat", "xp": 40, "minutes": 15},
        {"day": "Sun (Today)", "xp": 70, "minutes": 20}
    ]

    return DashboardOverviewResponse(
        profile=profile,
        readiness=readiness,
        todays_quests=todays_quests,
        weak_areas=weak_areas,
        recommended_next_steps=recommended_steps,
        weekly_xp_history=weekly_xp,
        coach_tip=CoachReaction(
            state="encouraging",
            message=f"You're on a {prof_dict['current_streak']}-day preparation streak, {prof_dict['full_name'].split()[0]}! Finish today's HR interview to keep your flame burning! 🔥"
        )
    )
