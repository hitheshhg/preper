import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, setSessionCookie, SessionUser } from '@/lib/auth/session';
import { devDb } from '@/lib/db/dev-store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid login credentials' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    let user: any = null;

    try {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    } catch (dbErr) {
      console.warn('[Prepr API Auth] Database offline, checking devDb');
      user = devDb.findUserByEmail(email);
    }

    if (!user) {
      user = devDb.findUserByEmail(email);
    }

    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (err: any) {
    console.error('API login error:', err);
    return NextResponse.json({ success: false, error: 'Login failed due to server error' }, { status: 500 });
  }
}
