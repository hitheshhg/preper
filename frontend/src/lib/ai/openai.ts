import OpenAI from 'openai';
import { z } from 'zod';
import { env } from '@/lib/config/env';
import {
  AIProvider,
  GenerateQuestionsParams,
  GeneratedQuestion,
  EvaluateAnswerParams,
  AnswerEvaluationResult,
  EvaluateInterviewParams,
  FullInterviewEvaluationResult,
  AnalyzeResumeParams,
  ResumeAnalysisResult,
} from './provider';
import { MockAIProvider } from './mock';

const QuestionSchema = z.object({
  questions: z.array(
    z.object({
      order: z.number(),
      question: z.string(),
      category: z.string(),
      expectedConcepts: z.array(z.string()),
    })
  ),
});

const AnswerEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  idealAnswerStructure: z.string(),
  followUpQuestion: z.string().optional(),
});

const FullInterviewEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  communicationScore: z.number().min(0).max(100),
  structureScore: z.number().min(0).max(100),
  problemSolvingScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  actionableRecommendations: z.array(z.string()),
});

const ResumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  structureScore: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  skillsDetected: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  missingSkills: z.array(z.string()),
  experienceInsights: z.array(z.string()),
  actionableRecommendations: z.array(z.string()),
  improvedBullets: z.array(
    z.object({
      original: z.string(),
      improved: z.string(),
      impactDelta: z.string(),
    })
  ),
});

export class OpenAIProvider implements AIProvider {
  public readonly name = 'Prepr OpenAI Engine';
  public readonly isSimulated = false;
  private client: OpenAI | null = null;
  private fallbackMock = new MockAIProvider();

  constructor() {
    if (env.OPENAI_API_KEY) {
      this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
  }

  private ensureClient(): OpenAI {
    if (!this.client) {
      throw new Error('OpenAI API key is not configured in server environment.');
    }
    return this.client;
  }

  async generateQuestions(params: GenerateQuestionsParams): Promise<GeneratedQuestion[]> {
    if (!this.client) {
      return this.fallbackMock.generateQuestions(params);
    }

    try {
      const completion = await this.ensureClient().chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an expert technical interviewer for top technology firms.
Generate ${params.count} high-caliber interview questions for a candidate targeting the role: "${params.role}".
Mode: "${params.mode}". Difficulty: "${params.difficulty}".
Return a valid JSON object matching this schema:
{
  "questions": [
    {
      "order": 1,
      "question": "string",
      "category": "string",
      "expectedConcepts": ["concept1", "concept2"]
    }
  ]
}`,
          },
        ],
        temperature: 0.7,
      });

      const raw = JSON.parse(completion.choices[0]?.message?.content || '{}');
      const parsed = QuestionSchema.safeParse(raw);
      if (parsed.success) {
        return parsed.data.questions;
      }
      return this.fallbackMock.generateQuestions(params);
    } catch (err) {
      console.warn('[OpenAIProvider] Error generating questions, falling back to simulation:', err);
      return this.fallbackMock.generateQuestions(params);
    }
  }

  async evaluateAnswer(params: EvaluateAnswerParams): Promise<AnswerEvaluationResult> {
    if (!this.client) {
      return this.fallbackMock.evaluateAnswer(params);
    }

    try {
      const completion = await this.ensureClient().chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a strict, objective, and constructive technical interview evaluator.
Evaluate the candidate's answer for the following question:
Role: ${params.role} (${params.difficulty})
Category: ${params.category}
Question: ${params.question}
Candidate Answer: "${params.userAnswer}"

Return a JSON object matching this schema:
{
  "score": number (0-100),
  "feedback": "string (substantive critique)",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "idealAnswerStructure": "string",
  "followUpQuestion": "string"
}`,
          },
        ],
        temperature: 0.3,
      });

      const raw = JSON.parse(completion.choices[0]?.message?.content || '{}');
      const parsed = AnswerEvaluationSchema.safeParse(raw);
      if (parsed.success) {
        return parsed.data;
      }
      return this.fallbackMock.evaluateAnswer(params);
    } catch (err) {
      console.warn('[OpenAIProvider] Error evaluating answer, falling back to simulation:', err);
      return this.fallbackMock.evaluateAnswer(params);
    }
  }

  async evaluateInterview(params: EvaluateInterviewParams): Promise<FullInterviewEvaluationResult> {
    if (!this.client) {
      return this.fallbackMock.evaluateInterview(params);
    }

    try {
      const completion = await this.ensureClient().chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are the lead engineering hiring manager. Synthesize a comprehensive performance scorecard for the entire interview session.
Target Role: ${params.role}
Mode: ${params.mode}
Transcripts:
${JSON.stringify(params.questionsWithAnswers, null, 2)}

Return a JSON object matching this schema:
{
  "overallScore": number (0-100),
  "technicalScore": number (0-100),
  "communicationScore": number (0-100),
  "structureScore": number (0-100),
  "problemSolvingScore": number (0-100),
  "confidenceScore": number (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "actionableRecommendations": ["string"]
}`,
          },
        ],
        temperature: 0.3,
      });

      const raw = JSON.parse(completion.choices[0]?.message?.content || '{}');
      const parsed = FullInterviewEvaluationSchema.safeParse(raw);
      if (parsed.success) {
        return parsed.data;
      }
      return this.fallbackMock.evaluateInterview(params);
    } catch (err) {
      console.warn('[OpenAIProvider] Error evaluating full interview, falling back:', err);
      return this.fallbackMock.evaluateInterview(params);
    }
  }

  async analyzeResume(params: AnalyzeResumeParams): Promise<ResumeAnalysisResult> {
    if (!this.client) {
      return this.fallbackMock.analyzeResume(params);
    }

    try {
      const completion = await this.ensureClient().chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an executive resume reviewer and ATS intelligence auditor.
Analyze the following resume text for a target role of "${params.targetRole}".
Job Description Context: ${params.jobDescription || 'Standard industry requirements for this role'}

Resume Text:
${params.resumeText}

Return a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "clarityScore": number (0-100),
  "structureScore": number (0-100),
  "relevanceScore": number (0-100),
  "skillsDetected": {
    "technical": ["string"],
    "soft": ["string"],
    "tools": ["string"]
  },
  "missingSkills": ["string"],
  "experienceInsights": ["string"],
  "actionableRecommendations": ["string"],
  "improvedBullets": [
    {
      "original": "string",
      "improved": "string",
      "impactDelta": "string"
    }
  ]
}`,
          },
        ],
        temperature: 0.2,
      });

      const raw = JSON.parse(completion.choices[0]?.message?.content || '{}');
      const parsed = ResumeAnalysisSchema.safeParse(raw);
      if (parsed.success) {
        return parsed.data;
      }
      return this.fallbackMock.analyzeResume(params);
    } catch (err) {
      console.warn('[OpenAIProvider] Error analyzing resume, falling back:', err);
      return this.fallbackMock.analyzeResume(params);
    }
  }
}
