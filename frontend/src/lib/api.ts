import {
  Profile,
  ResumeAnalysis,
  ResumeAnalysisV2,
  ResumeVersionRecord,
  TailoredSummaryResponse,
  ImprovedBullet,
  InterviewSession,
  InterviewEvaluation,
  GDSession,
  GDEvaluation,
  DashboardData,
  SkillNode,
  RoadmapData
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || `API request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[PrepQuest API Warning] Request to ${url} failed, using resilient fallback:`, error);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => fetchWithFallback('/api/health'),

  // Profile & Onboarding
  getProfile: (userId = 'demo-user-123') =>
    fetchWithFallback<Profile>(`/api/auth/profile/${userId}`),

  submitOnboarding: (data: any) =>
    fetchWithFallback<Profile>('/api/auth/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Dashboard Overview
  getDashboard: (userId = 'demo-user-123') =>
    fetchWithFallback<DashboardData>(`/api/dashboard?user_id=${userId}`),

  // Resume Intelligence 2.0
  analyzeResume: (rawText: string, targetRole = 'Software Development Engineer', jobDescription?: string) =>
    fetchWithFallback<ResumeAnalysisV2>('/api/resume/analyze', {
      method: 'POST',
      body: JSON.stringify({
        raw_text: rawText,
        target_role: targetRole,
        job_description: jobDescription || null
      })
    }),

  uploadResume: async (formData: FormData): Promise<ResumeAnalysisV2> => {
    const res = await fetch(`${API_BASE_URL}/api/resume/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Resume upload failed');
    }
    return res.json();
  },

  getResumeHistory: (userId = 'demo-user-123') =>
    fetchWithFallback<ResumeVersionRecord[]>(`/api/resume/history/${userId}`),

  generateTailoredSummary: (resumeText: string, targetRole = 'Software Development Engineer') =>
    fetchWithFallback<TailoredSummaryResponse>('/api/resume/generate-summary', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText, target_role: targetRole })
    }),

  rewriteBullet: (bullet: string, targetRole = 'Software Engineer', context = '') =>
    fetchWithFallback<ImprovedBullet>('/api/resume/rewrite-bullet', {
      method: 'POST',
      body: JSON.stringify({
        bullet_point: bullet,
        target_role: targetRole,
        project_context: context
      })
    }),

  // Mock Interviews 2.0
  createInterview: (params: { 
    mode: string; 
    role: string; 
    difficulty: string; 
    question_count?: number; 
    duration_minutes?: number; 
    target_company?: string;
    focus_skills?: string[];
  }) =>
    fetchWithFallback<InterviewSession>('/api/interviews/create', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  submitInterviewAnswer: (params: { 
    interview_id: string; 
    question_id: string; 
    user_answer: string; 
    time_taken_seconds: number;
    confidence_metric?: number;
  }) =>
    fetchWithFallback<any>('/api/interviews/answer', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  logIntegrityEvent: (interviewId: string, event: any) =>
    fetchWithFallback<{ status: string; integrity_score: number }>('/api/interviews/integrity', {
      method: 'POST',
      body: JSON.stringify({ interview_id: interviewId, event })
    }),

  pauseInterview: (interviewId: string) =>
    fetchWithFallback<{ status: string }>(`/api/interviews/${interviewId}/pause`, {
      method: 'POST'
    }),

  resumeInterview: (interviewId: string) =>
    fetchWithFallback<{ status: string }>(`/api/interviews/${interviewId}/resume`, {
      method: 'POST'
    }),

  getInterviewEvaluation: (interviewId: string) =>
    fetchWithFallback<InterviewEvaluation>(`/api/interviews/${interviewId}/evaluation`),

  // Group Discussion Simulator
  createGDSession: (topic?: string, difficulty = 'Medium') =>
    fetchWithFallback<GDSession>('/api/gd/create', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty })
    }),

  sendGDMessage: (sessionId: string, message: string) =>
    fetchWithFallback<GDSession>('/api/gd/message', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, message })
    }),

  completeGDSession: (sessionId: string) =>
    fetchWithFallback<GDEvaluation>(`/api/gd/${sessionId}/complete`, {
      method: 'POST'
    }),

  // AI Career Coach
  chatCoach: (message: string, history: any[] = []) =>
    fetchWithFallback<any>('/api/coach/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversation_history: history })
    }),

  // Skills & Roadmaps
  getSkills: () => fetchWithFallback<SkillNode[]>('/api/skills'),
  getRoadmap: () => fetchWithFallback<RoadmapData>('/api/roadmaps'),

  // Gamification & Quests
  claimQuest: (questId: string) =>
    fetchWithFallback<any>(`/api/quests/${questId}/claim`, { method: 'POST' }),
  getAchievements: () => fetchWithFallback<any[]>('/api/achievements'),

  // Catalog
  getCompanies: () => fetchWithFallback<any[]>('/api/companies'),
  getQuestions: (category?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    return fetchWithFallback<any[]>(`/api/questions?${params.toString()}`);
  }
};
