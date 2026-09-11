export interface GenerateQuestionsParams {
  role: string;
  mode: string;
  difficulty: string;
  count: number;
}

export interface GeneratedQuestion {
  order: number;
  question: string;
  category: string;
  expectedConcepts: string[];
}

export interface EvaluateAnswerParams {
  question: string;
  category: string;
  userAnswer: string;
  role: string;
  difficulty: string;
}

export interface AnswerEvaluationResult {
  score: number; // 0 - 100
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  idealAnswerStructure: string;
  followUpQuestion?: string;
}

export interface EvaluateInterviewParams {
  role: string;
  mode: string;
  questionsWithAnswers: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
}

export interface FullInterviewEvaluationResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  structureScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  actionableRecommendations: string[];
}

export interface AnalyzeResumeParams {
  resumeText: string;
  targetRole: string;
  jobDescription?: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  atsScore: number;
  clarityScore: number;
  structureScore: number;
  relevanceScore: number;
  skillsDetected: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  missingSkills: string[];
  experienceInsights: string[];
  actionableRecommendations: string[];
  improvedBullets: Array<{
    original: string;
    improved: string;
    impactDelta: string;
  }>;
}

export interface AIProvider {
  name: string;
  isSimulated: boolean;
  generateQuestions(params: GenerateQuestionsParams): Promise<GeneratedQuestion[]>;
  evaluateAnswer(params: EvaluateAnswerParams): Promise<AnswerEvaluationResult>;
  evaluateInterview(params: EvaluateInterviewParams): Promise<FullInterviewEvaluationResult>;
  analyzeResume(params: AnalyzeResumeParams): Promise<ResumeAnalysisResult>;
}
