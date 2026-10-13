'use server';

import { prisma } from '@/lib/db/client';
import { devDb } from '@/lib/db/dev-store';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';
import { GDEvaluation, GDMessage } from '@/types';

export interface SaveGDInput {
  topic: string;
  transcript: GDMessage[];
  evaluation: GDEvaluation;
}

export async function saveCompletedGDAction(data: SaveGDInput) {
  const user = await getCurrentUser();

  if (!user) {
    console.warn('[GD Action] Anonymous session completed GD, skipping db persist');
    return { success: false, error: 'User session not found' };
  }

  try {
    const gd = await prisma.groupDiscussion.create({
      data: {
        userId: user.id,
        topic: data.topic,
        transcript: data.transcript as any,
        evaluations: {
          create: {
            overallScore: Math.round(data.evaluation.overall_score || 0),
            contentScore: Math.round(data.evaluation.argument_quality_score || 0),
            leadershipScore: Math.round(data.evaluation.leadership_score || 0),
            communicationScore: Math.round(data.evaluation.communication_score || 0),
            activeListeningScore: Math.round(data.evaluation.interruption_handling_score || 0),
            strengths: data.evaluation.strengths || [],
            weaknesses: data.evaluation.weaknesses || [],
            summary: data.evaluation.speaking_analysis || 'Boardroom discussion completed successfully.',
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'GD_COMPLETED',
        resource: 'GroupDiscussion',
        resourceId: gd.id,
        metadata: {
          topic: data.topic,
          overallScore: data.evaluation.overall_score,
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/gd');
    revalidatePath('/analytics');
    revalidatePath('/admin');

    return { success: true, gdId: gd.id };
  } catch (err: any) {
    console.warn('[Prepr GD] Prisma unavailable, logging GD session to devDb fallback:', err.message);
    devDb.logAudit({
      actorId: user.id,
      action: 'GD_SESSION_COMPLETED',
      resource: 'GDSession',
      metadata: {
        topic: data.topic,
        overallScore: data.evaluation.overall_score,
      },
    });
    return { success: true, gdId: `gd_${Date.now()}` };
  }
}
