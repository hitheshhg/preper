import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { isDatabaseConfigured, isOpenAIConfigured, env } from '@/lib/config/env';

export async function GET() {
  let dbStatus = 'disconnected';
  let dbLatencyMs: number | null = null;

  if (isDatabaseConfigured) {
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - start;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }
  }

  return NextResponse.json({
    status: 'ok',
    app: env.NEXT_PUBLIC_APP_NAME,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      configured: isDatabaseConfigured,
    },
    ai: {
      provider: isOpenAIConfigured ? 'OpenAI' : 'MockAI (Simulation Mode)',
      configured: isOpenAIConfigured,
      model: env.OPENAI_MODEL,
    },
  });
}
