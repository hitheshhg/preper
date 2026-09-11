'use server';

import { prisma } from '@/lib/db/client';
import { getCurrentUser } from './auth';

export interface AnalyticsTelemetry {
  authenticated: boolean;
  hasRealData: boolean;
  readinessScore: number;
  offerProbability: number;
  sessionsCompleted: number;
  techSessionsCount: number;
  hrSessionsCount: number;
  gdSessionsCount: number;
  weeklyXP: number;
  readinessHistory: Array<{ week: string; score: number }>;
  categoryRadarData: Array<{ category: string; score: number; fullMark: number }>;
  dimensions: Array<{
    name: string;
    score: number;
    benchmark: number;
    delta: string;
    status: string;
    link: string;
  }>;
  recentInterviews: Array<{
    id: string;
    role: string;
    mode: string;
    score: number | null;
    createdAt: string;
  }>;
}

export async function getAnalyticsDataAction(): Promise<AnalyticsTelemetry> {
  const user = await getCurrentUser();

  const baselineTelemetry: AnalyticsTelemetry = {
    authenticated: !!user,
    hasRealData: false,
    readinessScore: 72,
    offerProbability: 78,
    sessionsCompleted: 18,
    techSessionsCount: 12,
    hrSessionsCount: 4,
    gdSessionsCount: 2,
    weeklyXP: 490,
    readinessHistory: [
      { week: 'W1', score: 58 },
      { week: 'W2', score: 62 },
      { week: 'W3', score: 66 },
      { week: 'W4', score: 72 },
    ],
    categoryRadarData: [
      { category: 'Technical CS', score: 75, fullMark: 100 },
      { category: 'Coding DSA', score: 70, fullMark: 100 },
      { category: 'Communication', score: 68, fullMark: 100 },
      { category: 'HR Fit', score: 78, fullMark: 100 },
      { category: 'Resume ATS', score: 74, fullMark: 100 },
      { category: 'Problem Solving', score: 72, fullMark: 100 },
    ],
    dimensions: [
      { name: 'Core Computer Science', score: 75, benchmark: 80, delta: '+14%', status: 'Progressing', link: '/interview?mode=Technical' },
      { name: 'Data Structures & Algorithms', score: 70, benchmark: 85, delta: '+8%', status: 'Focus Required', link: '/interview?mode=Technical' },
      { name: 'Communication & Articulation', score: 68, benchmark: 75, delta: '0%', status: 'Plateaued', link: '/gd' },
      { name: 'Behavioral & Leadership (STAR)', score: 78, benchmark: 75, delta: '+12%', status: 'Benchmark Met', link: '/interview?mode=STAR' },
      { name: 'Resume ATS Compatibility', score: 74, benchmark: 80, delta: '+6%', status: 'Progressing', link: '/resume' },
    ],
    recentInterviews: [],
  };

  if (!user) {
    return baselineTelemetry;
  }

  try {
    const [interviews, gdSessions, resumes] = await Promise.all([
      prisma.interview.findMany({
        where: { userId: user.id, status: 'COMPLETED' },
        orderBy: { completedAt: 'asc' },
      }),
      prisma.groupDiscussion.findMany({
        where: { userId: user.id },
        include: { evaluations: true },
      }),
      prisma.resumeAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    if (interviews.length === 0 && gdSessions.length === 0 && resumes.length === 0) {
      return baselineTelemetry;
    }

    const techInterviews = interviews.filter(i => i.mode.toLowerCase().includes('tech'));
    const hrInterviews = interviews.filter(i => !i.mode.toLowerCase().includes('tech'));
    const totalSessions = interviews.length + gdSessions.length;

    const scoredInterviews = interviews.filter(i => typeof i.overallScore === 'number');
    const avgScore = scoredInterviews.length > 0
      ? Math.round(scoredInterviews.reduce((a, b) => a + (b.overallScore || 0), 0) / scoredInterviews.length)
      : 72;

    const avgTech = scoredInterviews.filter(i => typeof i.technicalScore === 'number');
    const techScore = avgTech.length > 0
      ? Math.round(avgTech.reduce((a, b) => a + (b.technicalScore || 0), 0) / avgTech.length)
      : 75;

    const avgComm = scoredInterviews.filter(i => typeof i.communicationScore === 'number');
    const commScore = avgComm.length > 0
      ? Math.round(avgComm.reduce((a, b) => a + (b.communicationScore || 0), 0) / avgComm.length)
      : 68;

    const latestAtsScore = resumes[0]?.atsScore ?? 74;

    // Calculate progression history points
    const historyPoints = scoredInterviews.map((iv, idx) => ({
      week: `Session ${idx + 1}`,
      score: iv.overallScore || 70,
    }));

    const readinessHistory = historyPoints.length >= 2
      ? historyPoints.slice(-6)
      : baselineTelemetry.readinessHistory;

    return {
      authenticated: true,
      hasRealData: true,
      readinessScore: avgScore,
      offerProbability: Math.min(96, Math.max(40, Math.round(avgScore * 0.95))),
      sessionsCompleted: totalSessions,
      techSessionsCount: techInterviews.length,
      hrSessionsCount: hrInterviews.length,
      gdSessionsCount: gdSessions.length,
      weeklyXP: totalSessions * 120 + 200,
      readinessHistory,
      categoryRadarData: [
        { category: 'Technical CS', score: techScore, fullMark: 100 },
        { category: 'Coding DSA', score: Math.round((techScore + avgScore) / 2), fullMark: 100 },
        { category: 'Communication', score: commScore, fullMark: 100 },
        { category: 'HR Fit', score: Math.min(100, Math.round(avgScore * 1.05)), fullMark: 100 },
        { category: 'Resume ATS', score: latestAtsScore, fullMark: 100 },
        { category: 'Problem Solving', score: Math.round((techScore + 75) / 2), fullMark: 100 },
      ],
      dimensions: [
        { name: 'Core Computer Science', score: techScore, benchmark: 80, delta: `${techScore >= 80 ? '+' : ''}${techScore - 75}%`, status: techScore >= 80 ? 'Benchmark Met' : 'Progressing', link: '/interview?mode=Technical' },
        { name: 'Data Structures & Algorithms', score: Math.round((techScore + avgScore) / 2), benchmark: 85, delta: '+8%', status: 'Focus Required', link: '/interview?mode=Technical' },
        { name: 'Communication & Articulation', score: commScore, benchmark: 75, delta: `${commScore >= 75 ? '+' : ''}${commScore - 70}%`, status: commScore >= 75 ? 'Benchmark Met' : 'Plateaued', link: '/gd' },
        { name: 'Behavioral & Leadership (STAR)', score: Math.min(100, Math.round(avgScore * 1.05)), benchmark: 75, delta: '+12%', status: 'Benchmark Met', link: '/interview?mode=STAR' },
        { name: 'Resume ATS Compatibility', score: latestAtsScore, benchmark: 80, delta: `${latestAtsScore >= 80 ? '+' : ''}${latestAtsScore - 75}%`, status: latestAtsScore >= 80 ? 'Benchmark Met' : 'Progressing', link: '/resume' },
      ],
      recentInterviews: interviews.slice(-5).reverse().map(i => ({
        id: i.id,
        role: i.role,
        mode: i.mode,
        score: i.overallScore,
        createdAt: i.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    console.error('Failed to compute analytics telemetry:', err);
    return baselineTelemetry;
  }
}
