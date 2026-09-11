export interface CoachReaction {
  state: 'happy' | 'excited' | 'encouraging' | 'thinking' | 'concerned' | 'celebrating' | 'explaining';
  message: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  college: string;
  degree: string;
  branch: string;
  graduation_year: number;
  target_role: string;
  target_companies: string[];
  experience_level: string;
  daily_goal_minutes: number;
  confidence_level: number;
  total_xp: number;
  current_level: number;
  current_streak: number;
  max_streak: number;
  readiness_score: number;
  technical_score: number;
  coding_score: number;
  communication_score: number;
  hr_score: number;
  resume_score: number;
  problem_solving_score: number;
}

export interface ImprovedBullet {
  original: string;
  improved: string;
  metrics_added: string;
  explanation: string;
}

export interface ScoreDimension {
  score: number;
  strengths: string[];
  deductions: string[];
  how_to_improve: string;
}

export interface DetailedScores {
  ats_compatibility: ScoreDimension;
  content_quality: ScoreDimension;
  skills: ScoreDimension;
  experience: ScoreDimension;
  projects: ScoreDimension;
  education: ScoreDimension;
  impact: ScoreDimension;
  formatting: ScoreDimension;
  communication: ScoreDimension;
}

export interface ATSSectionDiagnostics {
  sections_detected: Record<string, boolean>;
  missing_sections: string[];
  weak_sections: string[];
  heading_clarity_score: number;
  formatting_risks: string[];
  contact_info_found: Record<string, boolean>;
  keyword_density_assessment: string;
  reasoning: string;
}

export interface CategorizedSkill {
  name: string;
  category: string;
  confidence: 'detected' | 'inferred' | 'missing';
  relevance_score: number;
}

export interface JobMatchAnalysis {
  match_percentage: number;
  target_role: string;
  has_job_description: boolean;
  strong_matches: string[];
  missing_skills: string[];
  keyword_gaps: string[];
  experience_gaps: string[];
  explanation: string;
}

export interface BulletEvaluation {
  original: string;
  is_weak: boolean;
  weakness_reason: string;
  suggested_improvement: string;
  metric_guidance: string;
}

export interface ProjectAnalysis {
  name: string;
  technologies: string[];
  purpose: string;
  technical_depth_score: number;
  measurable_impact_found: boolean;
  missing_information: string[];
  recommendations: string[];
}

export interface ExperienceAnalysisEntry {
  role_title: string;
  company: string;
  action_verbs_strength: 'Strong' | 'Moderate' | 'Weak';
  technical_depth: string;
  measurable_results_found: boolean;
  relevance_to_target_role: number;
  targeted_suggestions: string[];
}

export interface ResumeHealthSummary {
  what_is_strong: string[];
  what_is_holding_back: string[];
  highest_impact_improvements: string[];
}

export interface ResumeVersionRecord {
  version_id: string;
  version_name: string;
  file_name: string;
  created_at: string;
  overall_score: number;
  ats_score: number;
  job_match_score: number | null;
  target_role: string;
}

export interface ResumeAnalysisV2 {
  version_id: string;
  version_name: string;
  file_name: string;
  overall_score: number;
  health_status: string;
  health_summary: ResumeHealthSummary;
  detailed_scores: DetailedScores;
  ats_diagnostics: ATSSectionDiagnostics;
  skill_taxonomy: CategorizedSkill[];
  job_match: JobMatchAnalysis;
  experience_entries: ExperienceAnalysisEntry[];
  project_entries: ProjectAnalysis[];
  bullet_evaluations: BulletEvaluation[];
  tailored_summary: string;
  score_history: ResumeVersionRecord[];
  coach_feedback: CoachReaction;
}

export interface TailoredSummaryResponse {
  summary: string;
  facts_used: string[];
}

export interface ResumeAnalysis {
  overall_score: number;
  ats_score: number;
  clarity_score: number;
  structure_score: number;
  relevance_score: number;
  skills_detected: {
    technical: string[];
    soft: string[];
    tools: string[];
    frameworks: string[];
  };
  matched_skills: string[];
  missing_skills: string[];
  experience_analysis: {
    has_metrics: boolean;
    missing_metrics_points: string[];
    achievements_count: number;
  };
  recommendations: string[];
  improved_bullets: ImprovedBullet[];
  coach_feedback: CoachReaction;
}

export interface IntegrityEvent {
  event_type: 'TAB_SWITCH' | 'WINDOW_BLUR' | 'FULLSCREEN_EXIT' | 'CAMERA_DISABLED' | 'MICROPHONE_DISABLED' | 'NETWORK_INTERRUPTION' | 'SUSPICIOUS_PASTE';
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'HIGH';
  metadata?: string;
}

export interface QuestionReviewItem {
  question_order: number;
  question_text: string;
  category: string;
  difficulty: string;
  user_answer: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  ideal_answer_structure: string;
}

export type InterviewLiveState = 
  | 'PREFLIGHT'
  | 'AI_SPEAKING'
  | 'LISTENING'
  | 'PROCESSING'
  | 'PAUSED'
  | 'COMPLETED';

export interface InterviewQuestion {
  id: string;
  question_order: number;
  question_text: string;
  category: string;
  difficulty: string;
  expected_concepts: string[];
  is_followup?: boolean;
  context_reference?: string;
}

export interface InterviewSession {
  interview_id: string;
  mode: string;
  role: string;
  difficulty: string;
  duration_minutes?: number;
  current_question: InterviewQuestion;
  total_questions: number;
  current_step: number;
  coach_intro: CoachReaction;
}

export interface InterviewEvaluation {
  interview_id: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  confidence_score: number;
  structure_score: number;
  problem_solving_score: number;
  relevance_score: number;
  integrity_score?: number;
  integrity_events?: IntegrityEvent[];
  question_reviews?: QuestionReviewItem[];
  strengths: string[];
  weaknesses: string[];
  missed_opportunities: string[];
  actionable_recommendations?: string[];
  model_answer_highlights?: string;
  recommended_practice?: string[];
  xp_earned: number;
  coach_celebration: CoachReaction;
}

export interface GDPersona {
  id: string;
  name: string;
  role_type: string;
  avatar: string;
  traits: string;
}

export interface GDMessage {
  id: string;
  sender_type: 'user' | 'ai';
  speaker_name: string;
  speaker_persona?: string;
  message: string;
  timestamp_seconds: number;
}

export interface GDSession {
  session_id: string;
  topic: string;
  participants: GDPersona[];
  messages: GDMessage[];
  status: string;
}

export interface GDEvaluation {
  session_id: string;
  overall_score: number;
  communication_score: number;
  leadership_score: number;
  interruption_handling_score: number;
  argument_quality_score: number;
  logical_reasoning_score: number;
  participation_balance_score: number;
  strengths: string[];
  weaknesses: string[];
  speaking_analysis: string;
  improvement_plan: string;
  xp_earned: number;
  coach_reaction: CoachReaction;
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_minutes: number;
  xp_reward: number;
  is_completed: boolean;
  progress: number;
  target: number;
}

export interface WeakArea {
  category: string;
  current_score: number;
  status: 'Needs Work' | 'Improving' | 'Strong';
  recommended_action: string;
  action_link: string;
}

export interface ReadinessBreakdown {
  overall: number;
  technical: number;
  coding: number;
  communication: number;
  hr: number;
  resume: number;
  problem_solving: number;
  confidence: number;
  explanation: string;
}

export interface DashboardData {
  profile: Profile;
  readiness: ReadinessBreakdown;
  todays_quests: QuestItem[];
  weak_areas: WeakArea[];
  recommended_next_steps: string[];
  weekly_xp_history: Array<{ day: string; xp: number; minutes: number }>;
  coach_tip: CoachReaction;
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number;
  mastery_percentage: number;
  xp: number;
  is_locked: boolean;
  prerequisites: string[];
}

export interface RoadmapTask {
  id: string;
  week: number;
  day: number;
  title: string;
  category: string;
  action_type: string;
  action_link: string;
  is_completed: boolean;
  xp_reward: number;
}

export interface RoadmapData {
  target_role: string;
  total_weeks: number;
  current_week: number;
  tasks: RoadmapTask[];
}
