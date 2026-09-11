import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from '@/lib/config/env';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN' | 'RECRUITER' | 'INTERVIEWER';
}

const SECRET_KEY = new TextEncoder().encode(env.AUTH_SECRET);
const COOKIE_NAME = 'prepr_session';

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    if (!payload.sub || !payload.email || !payload.role) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email as string,
      name: (payload.name as string) || null,
      role: payload.role as SessionUser['role'],
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
