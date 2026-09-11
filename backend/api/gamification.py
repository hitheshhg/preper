from fastapi import APIRouter
from typing import List, Dict, Any
from backend.schemas.models import QuestItem
from backend.api.auth import USER_PROFILES

router = APIRouter(tags=["Gamification & Quests"])

ACHIEVEMENTS_LIST = [
    {
        "id": "ach-1",
        "code": "FIRST_INTERVIEW",
        "title": "First Step",
        "description": "Completed your first AI mock interview session",
        "badge_icon": "Sparkles",
        "category": "Interview",
        "xp_reward": 100,
        "is_unlocked": True,
        "unlocked_at": "Yesterday"
    },
    {
        "id": "ach-2",
        "code": "STREAK_7",
        "title": "7-Day Streak Master",
        "description": "Maintained daily placement preparation for 7 consecutive days",
        "badge_icon": "Flame",
        "category": "Consistency",
        "xp_reward": 200,
        "is_unlocked": False,
        "progress": 5,
        "target": 7
    },
    {
        "id": "ach-3",
        "code": "RESUME_MASTER",
        "title": "ATS Champion",
        "description": "Achieved an ATS Compatibility score above 80%",
        "badge_icon": "FileCheck",
        "category": "Resume",
        "xp_reward": 150,
        "is_unlocked": True,
        "unlocked_at": "3 days ago"
    },
    {
        "id": "ach-4",
        "code": "TECH_BEAST",
        "title": "Technical Maestro",
        "description": "Scored 85%+ in a Hard difficulty technical interview",
        "badge_icon": "Award",
        "category": "Technical",
        "xp_reward": 250,
        "is_unlocked": False,
        "progress": 1,
        "target": 2
    },
    {
        "id": "ach-5",
        "code": "GD_LEADER",
        "title": "Discussion Anchor",
        "description": "Demonstrated top-tier leadership in a group discussion simulator",
        "badge_icon": "Crown",
        "category": "GD",
        "xp_reward": 150,
        "is_unlocked": False,
        "progress": 0,
        "target": 1
    },
    {
        "id": "ach-6",
        "code": "XP_1000",
        "title": "1,000 XP Veteran",
        "description": "Earned 1,000 preparation XP across all activities",
        "badge_icon": "TrendingUp",
        "category": "Milestone",
        "xp_reward": 300,
        "is_unlocked": False,
        "progress": 450,
        "target": 1000
    }
]

@router.get("/achievements")
def get_achievements(user_id: str = "demo-user-123"):
    return ACHIEVEMENTS_LIST

@router.post("/quests/{quest_id}/claim")
def claim_quest_reward(quest_id: str, user_id: str = "demo-user-123"):
    reward_xp = 50
    if user_id in USER_PROFILES:
        USER_PROFILES[user_id]["total_xp"] += reward_xp
        # Level up check: every 300 XP = 1 Level
        new_level = max(1, (USER_PROFILES[user_id]["total_xp"] // 300) + 1)
        USER_PROFILES[user_id]["current_level"] = new_level

    return {
        "success": True,
        "quest_id": quest_id,
        "xp_reward": reward_xp,
        "total_xp": USER_PROFILES[user_id]["total_xp"] if user_id in USER_PROFILES else 500,
        "current_level": USER_PROFILES[user_id]["current_level"] if user_id in USER_PROFILES else 2,
        "message": f"Quest completed! You claimed +{reward_xp} XP."
    }
