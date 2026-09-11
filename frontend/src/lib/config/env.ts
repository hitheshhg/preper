import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database Configuration
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),

  // Authentication
  AUTH_SECRET: z.string().min(16).default('development-only-auth-secret-do-not-use-in-production-min-32-chars'),

  // AI Configuration (Server-side ONLY)
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o'),

  // File Storage (UploadThing or local storage)
  UPLOADTHING_TOKEN: z.string().optional(),

  // Client-Safe Public Variables
  NEXT_PUBLIC_APP_NAME: z.string().default('Prepr'),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment configuration');
  }

  return parsed.data;
}

export const env = validateEnv();

export const isProduction = env.NODE_ENV === 'production';
export const isDatabaseConfigured = Boolean(env.DATABASE_URL);
export const isOpenAIConfigured = Boolean(env.OPENAI_API_KEY);
