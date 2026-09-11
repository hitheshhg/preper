import { prisma } from '@/lib/db/client';
import { isDatabaseConfigured } from '@/lib/config/env';

export interface DashboardMetrics {
  readinessScore: number | null;
  overallScore: number | null;
  interviewsCompleted: number;
  activeStreak: number;
  averageScore: number | null;
  bestScore: number | null;
  technicalScore: number | null;
  communicationScore: number | null;
  structureScore: number | null;
  problemSolvingScore: number | null;
  recentSessions: Array<{
    id: string;
    role: string;
    mode: string;
    score: number | null;
    date: string;
    status: string;
  }>;
  hasData: boolean;
}

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const emptyMetrics: DashboardMetrics = {
    readinessScore: null,
    overallScore: null,
    interviewsCompleted: 0,
    activeStreak: 0,
    averageScore: null,
    bestScore: null,
    technicalScore: null,
    communicationScore: null,
    structureScore: null,
    problemSolvingScore: null,
    recentSessions: [],
    hasData: false,
  };

  if (!isDatabaseConfigured || !userId) {
    return emptyMetrics;
  }

  try {
    const interviews = await prisma.interview.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    if (interviews.length === 0) {
      return emptyMetrics;
    }

    const scoredInterviews = interviews.filter(i => typeof i.overallScore === 'number');
    const totalScore = scoredInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
    const averageScore = scoredInterviews.length > 0 ? Math.round(totalScore / scoredInterviews.length) : null;
    const bestScore = scoredInterviews.length > 0 ? Math.max(...scoredInterviews.map(i => i.overallScore || 0)) : null;

    // Technical score average
    const technicalInterviews = scoredInterviews.filter(i => typeof i.technicalScore === 'number');
    const technicalScore = technicalInterviews.length > 0
      ? Math.round(technicalInterviews.reduce((acc, curr) => acc + (curr.technicalScore || 0), 0) / technicalInterviews.length)
      : null;

    // Communication score average
    const commInterviews = scoredInterviews.filter(i => typeof i.communicationScore === 'number');
    const communicationScore = commInterviews.length > 0
      ? Math.round(commInterviews.reduce((acc, curr) => acc + (curr.communicationScore || 0), 0) / commInterviews.length)
      : null;

    const recentSessions = interviews.slice(0, 5).map(i => ({
      id: i.id,
      role: i.role,
      mode: i.mode,
      score: i.overallScore,
      date: i.completedAt ? new Date(i.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : 'RECENT',
      status: i.status,
    }));

    return {
      readinessScore: averageScore,
      overallScore: averageScore,
      interviewsCompleted: interviews.length,
      activeStreak: calculateStreak(interviews),
      averageScore,
      bestScore,
      technicalScore,
      communicationScore,
      structureScore: null,
      problemSolvingScore: null,
      recentSessions,
      hasData: true,
    };
  } catch (err) {
    console.error('Failed to compute dashboard metrics:', err);
    return emptyMetrics;
  }
}

function calculateStreak(interviews: Array<{ completedAt: Date | null }>): number {
  if (interviews.length === 0) return 0;
  
  const dates = interviews
    .map(i => i.completedAt ? new Date(i.completedAt).toDateString() : null)
    .filter(Boolean);

  const uniqueDates = Array.from(new Set(dates));
  return uniqueDates.length > 0 ? Math.min(uniqueDates.length, 30) : 0;
}
