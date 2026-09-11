from fastapi import APIRouter, Query
from typing import List, Optional, Dict, Any

router = APIRouter(tags=["Question Bank & Company Prep"])

COMPANIES_DATA = [
    {
        "id": "google",
        "name": "Google",
        "logo": "🔍",
        "tier": "Tier-1 Tech",
        "rounds": ["Online Assessment (OA)", "Technical Screen (DSA)", "2x Onsite Coding", "System Design / Architecture", "Googleyness & Leadership"],
        "primary_skills": ["Data Structures & Algorithms", "Time/Space Complexity", "System Scalability", "Clean Code"],
        "interview_style": "Heavy emphasis on O(N) optimizations, algorithmic edge cases, and architectural clarity.",
        "difficulty": "Hard",
        "recommended_mock": "/interview?mode=Technical&role=SDE"
    },
    {
        "id": "microsoft",
        "name": "Microsoft",
        "logo": "🪟",
        "tier": "Tier-1 Tech",
        "rounds": ["Codility Assessment", "Data Structures Round", "Design & OOP Round", "Managerial & Behavioral Fit"],
        "primary_skills": ["Trees & Graphs", "Object-Oriented Design", "Concurrency", "Growth Mindset"],
        "interview_style": "Values robust boundary checking, design patterns, and collaborative problem solving.",
        "difficulty": "Medium-Hard",
        "recommended_mock": "/interview?mode=Mixed&role=SDE"
    },
    {
        "id": "amazon",
        "name": "Amazon",
        "logo": "📦",
        "tier": "Tier-1 Tech",
        "rounds": ["Online Coding Assessment", "DSA Problem Solving", "System Architecture", "Bar Raiser (Leadership Principles)"],
        "primary_skills": ["16 Leadership Principles (STAR)", "Dynamic Programming", "Low-Level Design", "Distributed Systems"],
        "interview_style": "Every technical question is paired with a deep STAR behavioral question testing customer obsession and bias for action.",
        "difficulty": "Hard",
        "recommended_mock": "/interview?mode=Behavioral&role=SDE"
    },
    {
        "id": "tcs-digital",
        "name": "TCS (Digital / Prime)",
        "logo": "💼",
        "tier": "National IT Leader",
        "rounds": ["National Qualifier Test (NQT)", "Technical Round (Core CS)", "Managerial Interview", "HR Round"],
        "primary_skills": ["Core Java/Python", "DBMS & SQL Queries", "Operating Systems", "Aptitude & Reasoning"],
        "interview_style": "Thorough assessment of academic core CS fundamentals, project architecture, and versatility.",
        "difficulty": "Medium",
        "recommended_mock": "/interview?mode=HR&role=SDE"
    }
]

QUESTIONS_DATA = [
    {
        "id": "q-bank-1",
        "category": "Technical",
        "topic": "Operating Systems",
        "difficulty": "Medium",
        "question": "What is a race condition, and how do mutexes and semaphores resolve critical section problems?",
        "expected_concepts": ["Race condition definition", "Mutual exclusion", "Binary vs Counting Semaphore", "Deadlock risks"],
        "model_answer": "A race condition occurs when multiple threads concurrently access and manipulate shared data, and the final outcome depends on the order of execution. Mutexes provide exclusive access (locking/unlocking) so only one thread can execute the critical section at any instant, while semaphores maintain a counter to permit a fixed number of simultaneous accesses."
    },
    {
        "id": "q-bank-2",
        "category": "Technical",
        "topic": "DBMS",
        "difficulty": "Medium",
        "question": "Explain the ACID properties in relational databases and how Write-Ahead Logging (WAL) guarantees durability.",
        "expected_concepts": ["Atomicity, Consistency, Isolation, Durability", "WAL protocol", "Commit phase & crash recovery"],
        "model_answer": "ACID stands for Atomicity (all-or-nothing), Consistency (data invariants held), Isolation (transactions execute independently), and Durability (committed data survives crashes). Write-Ahead Logging guarantees durability by ensuring log records are flushed to non-volatile disk storage before actual database pages are updated."
    },
    {
        "id": "q-bank-3",
        "category": "HR",
        "topic": "Behavioral Fit",
        "difficulty": "Easy",
        "question": "Tell me about a time you had a conflict with a team member during a project. How did you handle it?",
        "expected_concepts": ["STAR format", "Objective focus on project goals", "Active listening", "Positive resolution"],
        "model_answer": "During our final-year capstone, my teammate and I disagreed on whether to use GraphQL or REST. Instead of debating subjectively, I proposed setting up a 1-day proof-of-concept benchmarking query payloads and latency. The numbers revealed REST was simpler for our schema, and we shipped ahead of schedule."
    },
    {
        "id": "q-bank-4",
        "category": "Coding",
        "topic": "Data Structures",
        "difficulty": "Medium",
        "question": "How do you detect a cycle in a linked list, and what is Floyd's Cycle-Finding Algorithm?",
        "expected_concepts": ["Fast and Slow pointer approach", "O(N) time complexity", "O(1) space complexity"],
        "model_answer": "Floyd's algorithm uses two pointers: a slow pointer moving 1 step at a time and a fast pointer moving 2 steps. If a cycle exists, the fast pointer will eventually lap and meet the slow pointer within O(N) steps with O(1) auxiliary space."
    },
    {
        "id": "q-bank-5",
        "category": "GD",
        "topic": "Group Discussion Strategy",
        "difficulty": "Medium",
        "question": "How do you constructively intervene when one speaker is dominating a placement group discussion?",
        "expected_concepts": ["Tactful interruption", "Acknowledging their point", "Opening the floor to silent candidates", "Displaying moderation"],
        "model_answer": "Use a bridge phrase: 'Vikram, you've made an interesting point regarding infrastructure cost. To ensure our panel covers all angles, I'd like to hear Ananya's thoughts on the compliance implications.' This demonstrates leadership without confrontation."
    }
]

@router.get("/companies")
def get_companies():
    return COMPANIES_DATA

@router.get("/questions")
def get_questions(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    topic: Optional[str] = None
):
    results = QUESTIONS_DATA
    if category and category.lower() != "all":
        results = [q for q in results if q["category"].lower() == category.lower()]
    if difficulty and difficulty.lower() != "all":
        results = [q for q in results if q["difficulty"].lower() == difficulty.lower()]
    if topic:
        results = [q for q in results if topic.lower() in q["topic"].lower()]
    return results
