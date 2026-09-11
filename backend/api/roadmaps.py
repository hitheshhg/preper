from fastapi import APIRouter
from backend.schemas.models import RoadmapResponse, RoadmapTask

router = APIRouter(prefix="/roadmaps", tags=["Personalized Roadmaps"])

@router.get("", response_model=RoadmapResponse)
@router.get("/current", response_model=RoadmapResponse)
def get_current_roadmap(user_id: str = "demo-user-123"):
    tasks = [
        # Week 1: Core CS & Foundations
        RoadmapTask(
            id="t1", week=1, day=1,
            title="Operating Systems: Processes, Threads & Deadlocks",
            category="Core CS", action_type="quiz",
            action_link="/interview?mode=Technical", is_completed=True, xp_reward=40
        ),
        RoadmapTask(
            id="t2", week=1, day=2,
            title="DBMS: ACID Properties & SQL Normalization",
            category="Core CS", action_type="quiz",
            action_link="/interview?mode=Technical", is_completed=True, xp_reward=40
        ),
        RoadmapTask(
            id="t3", week=1, day=3,
            title="Computer Networks: TCP vs UDP & HTTP 3.0",
            category="Core CS", action_type="quiz",
            action_link="/interview?mode=Technical", is_completed=True, xp_reward=40
        ),
        RoadmapTask(
            id="t4", week=1, day=4,
            title="Resume Audit & ATS Optimization",
            category="Resume", action_type="resume",
            action_link="/resume", is_completed=True, xp_reward=50
        ),

        # Week 2: Coding & Data Structures (Current Week)
        RoadmapTask(
            id="t5", week=2, day=1,
            title="Arrays, Two Pointers & Sliding Window Patterns",
            category="DSA", action_type="practice",
            action_link="/questions?category=technical", is_completed=True, xp_reward=50
        ),
        RoadmapTask(
            id="t6", week=2, day=2,
            title="Binary Trees & BFS/DFS Traversals",
            category="DSA", action_type="practice",
            action_link="/questions?category=technical", is_completed=False, xp_reward=50
        ),
        RoadmapTask(
            id="t7", week=2, day=3,
            title="Dynamic Programming: 1D Memoization & Knapsack",
            category="DSA", action_type="practice",
            action_link="/questions?category=technical", is_completed=False, xp_reward=60
        ),
        RoadmapTask(
            id="t8", week=2, day=4,
            title="HR & Behavioral STAR Articulation Mock",
            category="HR", action_type="interview",
            action_link="/interview?mode=HR", is_completed=False, xp_reward=60
        ),

        # Week 3: System Design & Group Discussions
        RoadmapTask(
            id="t9", week=3, day=1,
            title="Scalability Patterns: Load Balancers & Caching",
            category="System Design", action_type="practice",
            action_link="/interview?mode=Technical", is_completed=False, xp_reward=70
        ),
        RoadmapTask(
            id="t10", week=3, day=2,
            title="Group Discussion Simulation: Multi-Persona Room",
            category="GD", action_type="gd",
            action_link="/gd", is_completed=False, xp_reward=75
        ),

        # Week 4: Full Dress Rehearsal & Company Mock
        RoadmapTask(
            id="t11", week=4, day=1,
            title="Company-Specific Technical Mock (Tier-1 Tech)",
            category="Full Mock", action_type="interview",
            action_link="/interview?mode=Mixed", is_completed=False, xp_reward=100
        ),
        RoadmapTask(
            id="t12", week=4, day=2,
            title="Final Placement Readiness Certification Review",
            category="Milestone", action_type="readiness",
            action_link="/dashboard", is_completed=False, xp_reward=150
        )
    ]

    return RoadmapResponse(
        target_role="Software Development Engineer",
        total_weeks=4,
        current_week=2,
        tasks=tasks
    )
