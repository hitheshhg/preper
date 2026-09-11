from fastapi import APIRouter
from typing import List
from backend.schemas.models import SkillNode

router = APIRouter(prefix="/skills", tags=["Skill Tree"])

DEFAULT_SKILLS = [
    SkillNode(
        id="s1",
        name="Python Foundations",
        category="Programming",
        level=3,
        mastery_percentage=75,
        xp=320,
        is_locked=False,
        prerequisites=[]
    ),
    SkillNode(
        id="s2",
        name="Java & OOP Internals",
        category="Programming",
        level=2,
        mastery_percentage=55,
        xp=210,
        is_locked=False,
        prerequisites=[]
    ),
    SkillNode(
        id="s3",
        name="Data Structures (Arrays, Trees, Graphs)",
        category="DSA",
        level=3,
        mastery_percentage=70,
        xp=450,
        is_locked=False,
        prerequisites=["Python Foundations"]
    ),
    SkillNode(
        id="s4",
        name="Algorithms (DP, Greedy, Graphs)",
        category="DSA",
        level=2,
        mastery_percentage=48,
        xp=260,
        is_locked=False,
        prerequisites=["Data Structures (Arrays, Trees, Graphs)"]
    ),
    SkillNode(
        id="s5",
        name="DBMS & SQL Optimization",
        category="Core CS",
        level=3,
        mastery_percentage=68,
        xp=340,
        is_locked=False,
        prerequisites=[]
    ),
    SkillNode(
        id="s6",
        name="Operating Systems (Threads, Memory)",
        category="Core CS",
        level=2,
        mastery_percentage=60,
        xp=280,
        is_locked=False,
        prerequisites=[]
    ),
    SkillNode(
        id="s7",
        name="Computer Networks & Protocols",
        category="Core CS",
        level=2,
        mastery_percentage=58,
        xp=230,
        is_locked=False,
        prerequisites=[]
    ),
    SkillNode(
        id="s8",
        name="High-Level System Design",
        category="System Design",
        level=1,
        mastery_percentage=35,
        xp=150,
        is_locked=False,
        prerequisites=["DBMS & SQL Optimization", "Computer Networks & Protocols"]
    ),
    SkillNode(
        id="s9",
        name="Full-Stack Web Development",
        category="Web Development",
        level=3,
        mastery_percentage=80,
        xp=420,
        is_locked=False,
        prerequisites=["Python Foundations"]
    ),
    SkillNode(
        id="s10",
        name="HR & Behavioral STAR Articulation",
        category="HR & Behavioral",
        level=3,
        mastery_percentage=72,
        xp=360,
        is_locked=False,
        prerequisites=[]
    ),
    SkillNode(
        id="s11",
        name="Group Discussion Strategy",
        category="Group Discussion",
        level=2,
        mastery_percentage=62,
        xp=250,
        is_locked=False,
        prerequisites=["HR & Behavioral STAR Articulation"]
    ),
    SkillNode(
        id="s12",
        name="Microservices & Distributed Systems",
        category="Advanced",
        level=1,
        mastery_percentage=15,
        xp=80,
        is_locked=True, # Locked until System Design mastery reaches 60%
        prerequisites=["High-Level System Design"]
    )
]

@router.get("", response_model=List[SkillNode])
def get_skill_tree():
    return DEFAULT_SKILLS
