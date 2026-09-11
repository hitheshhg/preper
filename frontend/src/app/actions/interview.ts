'use server';

import { prisma } from '@/lib/db/client';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export interface SaveInterviewInput {
  interviewId?: string;
  role: string;
  mode: string;
  difficulty: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  structureScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  integrityScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questionsWithAnswers: Array<{
    order: number;
    question: string;
    category: string;
    userAnswer: string;
    score: number;
    feedback?: string;
    strengths?: string[];
    weaknesses?: string[];
  }>;
}

export async function saveCompletedInterviewAction(data: SaveInterviewInput) {
  const user = await getCurrentUser();

  if (!user) {
    console.warn('[Interview Action] Anonymous session completed, skipping db persist');
    return { success: false, error: 'User session not found' };
  }

  try {
    const interview = await prisma.interview.create({
      data: {
        userId: user.id,
        role: data.role,
        mode: data.mode,
        difficulty: data.difficulty,
        status: 'COMPLETED',
        overallScore: data.overallScore,
        technicalScore: data.technicalScore,
        communicationScore: data.communicationScore,
        structureScore: data.structureScore,
        problemSolvingScore: data.problemSolvingScore,
        confidenceScore: data.confidenceScore,
        integrityScore: data.integrityScore,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        recommendations: data.recommendations,
        completedAt: new Date(),
        questions: {
          create: data.questionsWithAnswers.map(q => ({
            questionOrder: q.order,
            questionText: q.question,
            category: q.category,
            difficulty: data.difficulty,
            expectedConcepts: [],
            answers: {
              create: [
                {
                  userId: user.id,
                  userAnswer: q.userAnswer || 'No response recorded',
                  audioDurationSec: 30,
                  score: q.score,
                  feedback: q.feedback || 'Evaluated against core architectural principles',
                },
              ],
            },
          })),
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'INTERVIEW_COMPLETED',
        resource: 'Interview',
        resourceId: interview.id,
        metadata: {
          role: data.role,
          overallScore: data.overallScore,
          mode: data.mode,
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/analytics');
    revalidatePath('/admin');

    return { success: true, interviewId: interview.id };
  } catch (err: any) {
    console.error('[Prepr Interview] Error persisting interview to PostgreSQL:', err);
    return { success: false, error: err.message };
  }
}
