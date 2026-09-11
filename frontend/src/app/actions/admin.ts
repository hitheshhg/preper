'use server';

import { prisma } from '@/lib/db/client';
import { requireRole } from '@/lib/authorization';
import { revalidatePath } from 'next/cache';

export async function getAdminOverviewAction() {
  const admin = await requireRole('ADMIN');

  const [totalUsers, totalInterviews, totalResumes, recentLogs, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.interview.count(),
    prisma.resume.count(),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        actor: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: {
        profile: { select: { targetRole: true, college: true } },
        _count: {
          select: { interviews: true, resumes: true },
        },
      },
    }),
  ]);

  return {
    admin: { id: admin.id, name: admin.name, email: admin.email },
    stats: {
      totalUsers,
      totalInterviews,
      totalResumes,
      totalAuditLogs: recentLogs.length,
    },
    recentLogs,
    recentUsers,
  };
}

export async function updateUserRoleAction(targetUserId: string, newRole: 'USER' | 'ADMIN') {
  const admin = await requireRole('ADMIN');

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'ADMIN_ROLE_CHANGED',
      resource: 'User',
      metadata: { targetUserId, newRole },
    },
  });

  revalidatePath('/admin');
  return { success: true, user: updated };
}
