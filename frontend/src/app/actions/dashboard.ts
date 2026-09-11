'use server';

import { getCurrentUser } from './auth';
import { getDashboardMetrics } from '@/lib/metrics';
import { prisma } from '@/lib/db/client';

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
}
