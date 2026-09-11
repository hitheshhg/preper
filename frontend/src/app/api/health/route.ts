import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { isDatabaseConfigured, isOpenAIConfigured, isGeminiConfigured, env } from '@/lib/config/env';

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

  const aiProvider = isGeminiConfigured
    ? `Google Gemini (${env.GEMINI_MODEL})`
    : isOpenAIConfigured
    ? `OpenAI (${env.OPENAI_MODEL})`
    : 'MockAI (Simulation Mode)';

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
      provider: aiProvider,
      configured: isGeminiConfigured || isOpenAIConfigured,
      model: isGeminiConfigured ? env.GEMINI_MODEL : env.OPENAI_MODEL,
    },
  });
}
