from fastapi import APIRouter, HTTPException
from backend.schemas.models import OnboardingRequest, ProfileResponse
from backend.services.readiness_engine import readiness_engine

router = APIRouter(prefix="/auth", tags=["Auth & Profile"])

# In-Memory Cache / State for seamless interactive demo mode & fast response
USER_PROFILES = {
    "demo-user-123": {
        "id": "demo-user-123",
        "full_name": "Aditya Sharma",
        "college": "National Institute of Technology",
        "degree": "B.Tech",
        "branch": "Computer Science & Engineering",
        "graduation_year": 2026,
        "target_role": "Software Development Engineer",
        "target_companies": ["Google", "Microsoft", "Amazon", "Uber"],
        "experience_level": "Fresher",
        "daily_goal_minutes": 25,
        "confidence_level": 68,
        "total_xp": 450,
        "current_level": 2,
        "current_streak": 5,
        "max_streak": 7,
        "readiness_score": 72,
        "technical_score": 75,
        "coding_score": 70,
        "communication_score": 68,
        "hr_score": 78,
        "resume_score": 74,
        "problem_solving_score": 72
    }
}

@router.get("/profile/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: str = "demo-user-123"):
    if user_id not in USER_PROFILES:
        # Generate default profile for new users
        USER_PROFILES[user_id] = {
            "id": user_id,
            "full_name": "Placement Aspirant",
            "college": "Engineering College",
            "degree": "B.Tech",
            "branch": "Computer Science",
            "graduation_year": 2026,
            "target_role": "Software Engineer",
            "target_companies": ["Tech Giants", "High-Growth Startups"],
            "experience_level": "Fresher",
            "daily_goal_minutes": 20,
            "confidence_level": 60,
            "total_xp": 100,
            "current_level": 1,
            "current_streak": 1,
            "max_streak": 1,
            "readiness_score": 65,
            "technical_score": 60,
            "coding_score": 60,
            "communication_score": 65,
            "hr_score": 70,
            "resume_score": 65,
            "problem_solving_score": 60
        }
    
    return ProfileResponse(**USER_PROFILES[user_id])

@router.post("/onboarding", response_model=ProfileResponse)
def submit_onboarding(data: OnboardingRequest):
    user_id = data.user_id or "demo-user-123"
    
    # Calculate initial scores based on user self-assessment
    tech_score = 70 if "Data Structures & Algorithms" in data.strongest_skills or "Python" in data.strongest_skills else 55
    comm_score = 75 if "Communication" in data.strongest_skills else (50 if "Communication" in data.weakest_skills else 65)
    
    overall, _ = readiness_engine.calculate_readiness(
        technical=tech_score,
        coding=65,
        communication=comm_score,
        hr=70,
        resume=65,
        problem_solving=65,
        confidence=data.confidence_level
    )
    
    profile_data = {
        "id": user_id,
        "full_name": data.full_name,
        "college": data.college,
        "degree": data.degree,
        "branch": data.branch,
        "graduation_year": data.graduation_year,
        "target_role": data.target_role,
        "target_companies": data.target_companies,
        "experience_level": data.experience_level,
        "daily_goal_minutes": data.daily_goal_minutes,
        "confidence_level": data.confidence_level,
        "total_xp": 150, # Bonus XP for completing onboarding!
        "current_level": 1,
        "current_streak": 1,
        "max_streak": 1,
        "readiness_score": overall,
        "technical_score": tech_score,
        "coding_score": 65,
        "communication_score": comm_score,
        "hr_score": 70,
        "resume_score": 65,
        "problem_solving_score": 65
    }
    
    USER_PROFILES[user_id] = profile_data
    return ProfileResponse(**profile_data)
