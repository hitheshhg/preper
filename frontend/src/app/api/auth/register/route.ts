import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth/password';
import { createSessionToken, setSessionCookie, SessionUser } from '@/lib/auth/session';
import { devDb } from '@/lib/db/dev-store';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid registration data' },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    let user: any = null;

    try {
      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) {
        return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 });
      }

      const passwordHash = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: 'USER',
          profile: {
            create: {
              fullName: name,
              targetRole: 'Software Development Engineer',
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn('[Prepr API Auth] Database offline, using devDb:', dbErr);
      const existing = devDb.findUserByEmail(email);
      if (existing) {
        return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 });
      }
      const passwordHash = await hashPassword(password);
      user = devDb.createUser({
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
        createdAt: new Date().toISOString(),
        profile: {
          targetRole: 'Software Development Engineer',
          completionPercent: 20,
        },
      });
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
    console.error('API register error:', err);
    return NextResponse.json({ success: false, error: 'Registration failed due to server error' }, { status: 500 });
  }
}
