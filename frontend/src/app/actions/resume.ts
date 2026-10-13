'use server';

import { prisma } from '@/lib/db/client';
import { devDb } from '@/lib/db/dev-store';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export interface SaveResumeInput {
  fileName?: string;
  rawText: string;
  targetRole: string;
  overallScore: number;
  atsScore: number;
  clarityScore?: number;
  structureScore?: number;
  relevanceScore?: number;
  skillsDetected?: any;
  missingSkills?: any;
  experienceAnalysis?: any;
  recommendations?: any;
}

export async function saveResumeAnalysisAction(data: SaveResumeInput) {
  const user = await getCurrentUser();

  if (!user) {
    console.warn('[Resume Action] Anonymous session analyzed resume, skipping db persist');
    return { success: false, error: 'User session not found' };
  }

  try {
    // Demote any previously primary resumes
    await prisma.resume.updateMany({
      where: { userId: user.id },
      data: { isPrimary: false },
    });

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: data.fileName || 'candidate_resume.txt',
        rawText: data.rawText,
        isPrimary: true,
        analyses: {
          create: {
            userId: user.id,
            targetRole: data.targetRole,
            overallScore: data.overallScore,
            atsScore: data.atsScore,
            clarityScore: data.clarityScore || 85,
            structureScore: data.structureScore || 85,
            relevanceScore: data.relevanceScore || 85,
            skillsDetected: data.skillsDetected || [],
            missingSkills: data.missingSkills || [],
            experienceAnalysis: data.experienceAnalysis || {},
            recommendations: data.recommendations || [],
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'RESUME_ANALYZED',
        resource: 'Resume',
        resourceId: resume.id,
        metadata: {
          targetRole: data.targetRole,
          atsScore: data.atsScore,
          overallScore: data.overallScore,
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/resume');
    revalidatePath('/analytics');
    return { success: true, resumeId: resume.id };
  } catch (err: any) {
    console.warn('[Prepr Resume] Prisma unavailable, saving to devDb fallback:', err.message);
    const devResume = devDb.saveResume(user.id, {
      fileName: data.fileName || 'candidate_resume.txt',
      targetRole: data.targetRole,
      overallScore: data.overallScore,
      atsScore: data.atsScore,
      rawText: data.rawText,
      recommendations: data.recommendations,
    });
    devDb.logAudit({
      actorId: user.id,
      action: 'RESUME_ANALYZED',
      resource: 'Resume',
      resourceId: devResume.id,
      metadata: {
        targetRole: data.targetRole,
        atsScore: data.atsScore,
        overallScore: data.overallScore,
      },
    });
    return { success: true, resumeId: devResume.id };
  }
}
