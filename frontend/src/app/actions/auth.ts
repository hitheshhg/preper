'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSessionToken, setSessionCookie, clearSessionCookie, getSession, SessionUser } from '@/lib/auth/session';
import { isDatabaseConfigured } from '@/lib/config/env';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: SessionUser;
}

export async function registerAction(formData: FormData): Promise<AuthResult> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = registerSchema.safeParse({ name, email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Invalid registration data' };
  }

  if (!isDatabaseConfigured) {
    // If PostgreSQL database is not connected yet, return clear guidance
    return {
      success: false,
      error: 'Database connection is not configured yet. Please configure DATABASE_URL in .env.local to enable account registration.',
    };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
        profile: {
          create: {
            fullName: name,
            targetRole: 'Software Development Engineer',
            experienceLevel: 'Fresher',
            dailyGoalMinutes: 20,
          },
        },
      },
    });

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return { success: true, user: sessionUser };
  } catch (err: any) {
    console.error('Registration error:', err);
    return { success: false, error: 'Registration failed due to a server error. Please try again.' };
  }
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Invalid login data' };
  }

  if (!isDatabaseConfigured) {
    return {
      success: false,
      error: 'Database connection is not configured yet. Please configure DATABASE_URL in .env.local to enable user sign-in.',
    };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return { success: true, user: sessionUser };
  } catch (err: any) {
    console.error('Login error:', err);
    return { success: false, error: 'Authentication failed due to a server error.' };
  }
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSession();
}
