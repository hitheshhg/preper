from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

# ==========================================================
# Common / Coach Models
# ==========================================================
class CoachReaction(BaseModel):
    state: str = Field("happy", description="happy | excited | encouraging | thinking | concerned | celebrating | explaining")
    message: str

# ==========================================================
# User & Onboarding
# ==========================================================
class OnboardingRequest(BaseModel):
    user_id: Optional[str] = "demo-user-123"
    full_name: str
    college: str
    degree: str
    branch: str
    graduation_year: int
    target_role: str
    target_companies: List[str]
    experience_level: str
    strongest_skills: List[str]
    weakest_skills: List[str]
    daily_goal_minutes: int
    confidence_level: int

class ProfileResponse(BaseModel):
    id: str
    full_name: str
    avatar_url: Optional[str] = None
    college: str
    degree: str
    branch: str
    graduation_year: int
    target_role: str
    target_companies: List[str]
    experience_level: str
    daily_goal_minutes: int
    confidence_level: int
    total_xp: int
    current_level: int
    current_streak: int
    max_streak: int
    readiness_score: int
    technical_score: int
    coding_score: int
    communication_score: int
    hr_score: int
    resume_score: int
    problem_solving_score: int

# ==========================================================
# Resume Analysis (V1 & V2)
# ==========================================================
class ScoreDimension(BaseModel):
    score: int
    strengths: List[str] = []
    deductions: List[str] = []
    how_to_improve: str = ""

class DetailedScores(BaseModel):
    ats_compatibility: ScoreDimension
    content_quality: ScoreDimension
    skills: ScoreDimension
    experience: ScoreDimension
    projects: ScoreDimension
    education: ScoreDimension
    impact: ScoreDimension
    formatting: ScoreDimension
    communication: ScoreDimension

class ATSSectionDiagnostics(BaseModel):
    sections_detected: Dict[str, bool] = {}
    missing_sections: List[str] = []
    weak_sections: List[str] = []
    heading_clarity_score: int = 80
    formatting_risks: List[str] = []
    contact_info_found: Dict[str, bool] = {}
    keyword_density_assessment: str = "Optimal"
    reasoning: str = ""

class CategorizedSkill(BaseModel):
    name: str
    category: str # "Programming Languages", "Frameworks", "Databases", "Tools", "Cloud", "AI/ML", "Soft Skills"
    confidence: str # "detected" | "inferred" | "missing"
    relevance_score: int = 85

class JobMatchAnalysis(BaseModel):
    match_percentage: int = 75
    target_role: str = "Software Development Engineer"
    has_job_description: bool = False
    strong_matches: List[str] = []
    missing_skills: List[str] = []
    keyword_gaps: List[str] = []
    experience_gaps: List[str] = []
    explanation: str = ""

class BulletEvaluation(BaseModel):
    original: str
    is_weak: bool = True
    weakness_reason: str = ""
    suggested_improvement: str = ""
    metric_guidance: str = ""

class ProjectAnalysis(BaseModel):
    name: str
    technologies: List[str] = []
    purpose: str = ""
    technical_depth_score: int = 80
    measurable_impact_found: bool = False
    missing_information: List[str] = []
    recommendations: List[str] = []

class ExperienceAnalysisEntry(BaseModel):
    role_title: str
    company: str = ""
    action_verbs_strength: str = "Moderate" # "Strong" | "Moderate" | "Weak"
    technical_depth: str = "Good"
    measurable_results_found: bool = False
    relevance_to_target_role: int = 80
    targeted_suggestions: List[str] = []

class ResumeHealthSummary(BaseModel):
    what_is_strong: List[str] = []
    what_is_holding_back: List[str] = []
    highest_impact_improvements: List[str] = []

class ResumeVersionRecord(BaseModel):
    version_id: str
    version_name: str
    file_name: str
    created_at: str
    overall_score: int
    ats_score: int
    job_match_score: Optional[int] = None
    target_role: str

class ResumeAnalysisV2(BaseModel):
    version_id: str
    version_name: str
    file_name: str
    overall_score: int
    health_status: str = "Good Foundation"
    health_summary: ResumeHealthSummary
    detailed_scores: DetailedScores
    ats_diagnostics: ATSSectionDiagnostics
    skill_taxonomy: List[CategorizedSkill]
    job_match: JobMatchAnalysis
    experience_entries: List[ExperienceAnalysisEntry]
    project_entries: List[ProjectAnalysis]
    bullet_evaluations: List[BulletEvaluation]
    tailored_summary: str = ""
    score_history: List[ResumeVersionRecord] = []
    coach_feedback: CoachReaction

class ResumeAnalyzeRequest(BaseModel):
    user_id: Optional[str] = "demo-user-123"
    raw_text: str
    target_role: Optional[str] = "Software Development Engineer"
    job_description: Optional[str] = None

class ImprovedBullet(BaseModel):
    original: str
    improved: str
    metrics_added: str
    explanation: str

class ResumeAnalyzeResponse(BaseModel):
    overall_score: int
    ats_score: int
    clarity_score: int
    structure_score: int
    relevance_score: int
    skills_detected: Dict[str, List[str]] # technical, soft, tools, frameworks
    matched_skills: List[str]
    missing_skills: List[str]
    experience_analysis: Dict[str, Any]
    recommendations: List[str]
    improved_bullets: List[ImprovedBullet]
    coach_feedback: CoachReaction

class BulletRewriteRequest(BaseModel):
    bullet_point: str
    target_role: Optional[str] = "Software Engineer"
    project_context: Optional[str] = ""

class TailoredSummaryRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Software Development Engineer"

class TailoredSummaryResponse(BaseModel):
    summary: str
    facts_used: List[str] = []

# ==========================================================
# Mock Interview 2.0 (Proctored Virtual Platform)
# ==========================================================
class IntegrityEvent(BaseModel):
    event_type: str # "TAB_SWITCH" | "WINDOW_BLUR" | "FULLSCREEN_EXIT" | "CAMERA_DISABLED" | "MICROPHONE_DISABLED" | "NETWORK_INTERRUPTION" | "SUSPICIOUS_PASTE"
    timestamp: str
    severity: str = "WARNING" # "INFO" | "WARNING" | "HIGH"
    metadata: str = ""

class IntegrityLogRequest(BaseModel):
    interview_id: str
    event: IntegrityEvent

class InterviewCreateRequest(BaseModel):
    user_id: Optional[str] = "demo-user-123"
    mode: str = Field("Technical", description="HR | Technical | Behavioral | Mixed")
    role: str = "Software Development Engineer"
    difficulty: str = Field("Medium", description="Easy | Medium | Hard | Adaptive")
    question_count: int = 5 # 5 (Quick) | 10 (Standard) | 15 (Deep)
    duration_minutes: int = 15 # 10 | 20 | 30
    focus_skills: Optional[List[str]] = []
    target_company: Optional[str] = None
    resume_context: Optional[str] = ""

class InterviewQuestion(BaseModel):
    id: str
    question_order: int
    question_text: str
    category: str
    difficulty: str
    expected_concepts: List[str]
    is_followup: bool = False
    context_reference: Optional[str] = None

class InterviewSessionResponse(BaseModel):
    interview_id: str
    mode: str
    role: str
    difficulty: str
    duration_minutes: int = 15
    current_question: InterviewQuestion
    total_questions: int = 5
    current_step: int = 1
    coach_intro: CoachReaction

class AnswerSubmitRequest(BaseModel):
    interview_id: str
    question_id: str
    user_answer: str
    time_taken_seconds: int = 30
    confidence_metric: Optional[int] = None

class AdaptiveNextQuestionResponse(BaseModel):
    is_completed: bool
    next_question: Optional[InterviewQuestion] = None
    step: int
    total_steps: int
    is_followup: bool = False
    adapted_difficulty: str = "Medium"
    immediate_feedback: Optional[str] = None
    coach_reaction: CoachReaction

class QuestionReviewItem(BaseModel):
    question_order: int
    question_text: str
    category: str
    difficulty: str = "Medium"
    user_answer: str
    score: int
    strengths: List[str] = []
    weaknesses: List[str] = []
    ideal_answer_structure: str = ""

class DetailedInterviewEvaluation(BaseModel):
    interview_id: str
    overall_score: int
    technical_score: int
    communication_score: int
    confidence_score: int
    structure_score: int
    problem_solving_score: int
    relevance_score: int
    integrity_score: int = 100
    integrity_events: List[IntegrityEvent] = []
    question_reviews: List[QuestionReviewItem] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    missed_opportunities: List[str] = []
    actionable_recommendations: List[str] = []
    xp_earned: int = 150
    coach_celebration: CoachReaction

# Legacy compatibility alias
class InterviewEvaluationResponse(DetailedInterviewEvaluation):
    model_answer_highlights: str = ""
    recommended_practice: List[str] = []

# ==========================================================
# Group Discussion
# ==========================================================
class GDPersona(BaseModel):
    id: str
    name: str
    role_type: str # 'The Leader', 'The Aggressive Speaker', 'The Silent Expert', 'The Data Person', 'The Contrarian', 'The Moderator', 'The Emotional Speaker'
    avatar: str
    traits: str

class GDCreateRequest(BaseModel):
    user_id: Optional[str] = "demo-user-123"
    topic: Optional[str] = None
    difficulty: str = "Medium"

class GDMessage(BaseModel):
    id: str
    sender_type: str # 'user' or 'ai'
    speaker_name: str
    speaker_persona: Optional[str] = None
    message: str
    timestamp_seconds: int

class GDUserMessageRequest(BaseModel):
    session_id: str
    message: str
    interrupted_speaker: Optional[str] = None

class GDSessionState(BaseModel):
    session_id: str
    topic: str
    participants: List[GDPersona]
    messages: List[GDMessage]
    status: str = "active"

class GDEvaluationResponse(BaseModel):
    session_id: str
    overall_score: int
    communication_score: int
    leadership_score: int
    interruption_handling_score: int
    argument_quality_score: int
    logical_reasoning_score: int
    participation_balance_score: int
    strengths: List[str]
    weaknesses: List[str]
    speaking_analysis: str
    improvement_plan: str
    xp_earned: int
    coach_reaction: CoachReaction

# ==========================================================
# Dashboard & Analytics
# ==========================================================
class ReadinessBreakdown(BaseModel):
    overall: int
    technical: int
    coding: int
    communication: int
    hr: int
    resume: int
    problem_solving: int
    confidence: int
    explanation: str

class QuestItem(BaseModel):
    id: str
    title: str
    description: str
    category: str
    difficulty: str
    estimated_minutes: int
    xp_reward: int
    is_completed: bool = False
    progress: int = 0
    target: int = 1

class WeakArea(BaseModel):
    category: str
    current_score: int
    status: str # "Needs Work", "Improving", "Strong"
    recommended_action: str
    action_link: str

class DashboardOverviewResponse(BaseModel):
    profile: ProfileResponse
    readiness: ReadinessBreakdown
    todays_quests: List[QuestItem]
    weak_areas: List[WeakArea]
    recommended_next_steps: List[str]
    weekly_xp_history: List[Dict[str, Any]]
    coach_tip: CoachReaction

# ==========================================================
# Coach Chat
# ==========================================================
class CoachChatMessage(BaseModel):
    role: str # "user" or "coach"
    content: str

class CoachChatRequest(BaseModel):
    user_id: Optional[str] = "demo-user-123"
    message: str
    conversation_history: Optional[List[CoachChatMessage]] = []

class CoachChatResponse(BaseModel):
    reply: str
    coach_state: str # "happy" | "explaining" | "thinking" | "encouraging" | "concerned" | "celebrating"
    suggested_actions: Optional[List[Dict[str, str]]] = []

# ==========================================================
# Skill Tree & Roadmaps
# ==========================================================
class SkillNode(BaseModel):
    id: str
    name: str
    category: str
    level: int
    mastery_percentage: int
    xp: int
    is_locked: bool
    prerequisites: List[str]

class RoadmapTask(BaseModel):
    id: str
    week: int
    day: int
    title: str
    category: str
    action_type: str
    action_link: str
    is_completed: bool
    xp_reward: int

class RoadmapResponse(BaseModel):
    target_role: str
    total_weeks: int
    current_week: int
    tasks: List[RoadmapTask]
