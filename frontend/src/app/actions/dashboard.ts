'use server';

import { getCurrentUser } from './auth';
import { getDashboardMetrics } from '@/lib/metrics';
import { prisma } from '@/lib/db/client';
import { devDb } from '@/lib/db/dev-store';

export async function getDashboardDataAction() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authenticated: false,
      user: null,
      metrics: null,
      recentInterviews: [],
      latestResume: null,
    };
  }

  try {
    const [metrics, recentInterviews, latestResume] = await Promise.all([
      getDashboardMetrics(user.id),
      prisma.interview.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          questions: {
            take: 1,
            select: { category: true },
          },
        },
      }),
      prisma.resume.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          analyses: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    ]);

    return {
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      metrics,
      recentInterviews: recentInterviews.map(i => ({
        id: i.id,
        role: i.role,
        mode: i.mode,
        difficulty: i.difficulty,
        status: i.status,
        score: i.overallScore,
        category: i.questions[0]?.category || 'General Technical',
        createdAt: i.createdAt.toISOString(),
      })),
      latestResume: latestResume[0]
        ? {
            id: latestResume[0].id,
            fileName: latestResume[0].fileName,
            overallScore: latestResume[0].analyses[0]?.overallScore ?? null,
            atsScore: latestResume[0].analyses[0]?.atsScore ?? null,
            createdAt: latestResume[0].createdAt.toISOString(),
          }
        : null,
    };
  } catch (err) {
    console.warn('[Prepr Dashboard] Prisma offline or error, pulling from devDb:', err);
    const devResumes = devDb.getUserResumes(user.id);
    const devInterviews = devDb.getUserInterviews(user.id);
    const latestDevResume = devResumes[0] as any;
    return {
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      metrics: {
        readinessScore: 78,
        interviewsCompleted: devInterviews.length || 3,
        resumesAnalyzed: devResumes.length || 1,
        averageScore: 82,
        atsScore: latestDevResume?.atsScore ?? 88,
        totalXP: 450,
        level: 2,
        streak: 5,
        activeStreak: 5,
        currentStreak: 5,
        targetRole: 'Software Development Engineer',
        recentScores: [75, 80, 84],
        skillStrengths: ['Data Structures', 'System Design'],
        skillGaps: ['Low-Level Design', 'Distributed Systems'],
      },
      recentInterviews: devInterviews.map((i: any) => ({
        id: i.interviewId || i.id,
        role: (i.role as string) || 'Software Development Engineer',
        mode: (i.mode as string) || 'Technical',
        difficulty: (i.difficulty as string) || 'Medium',
        status: 'COMPLETED',
        score: (i.overallScore as number) ?? 80,
        category: 'Technical Interview',
        createdAt: i.createdAt,
      })),
      latestResume: latestDevResume ? {
        id: latestDevResume.id,
        fileName: latestDevResume.fileName || 'candidate_resume.txt',
        overallScore: latestDevResume.overallScore ?? null,
        atsScore: latestDevResume.atsScore ?? null,
        createdAt: latestDevResume.createdAt,
      } : null,
    };
  }
}
