'use server';

import { prisma } from '@/lib/db/client';
import { requireRole } from '@/lib/authorization';
import { revalidatePath } from 'next/cache';

import { devDb } from '@/lib/db/dev-store';

export async function getAdminOverviewAction() {
  const admin = await requireRole('ADMIN');

  try {
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
  } catch (err) {
    console.warn('[Prepr Admin] Prisma offline, loading from devDb');
    const users = devDb.getAllUsers();
    const logs = devDb.getAuditLogs();
    return {
      admin: { id: admin.id, name: admin.name, email: admin.email },
      stats: {
        totalUsers: users.length,
        totalInterviews: 0,
        totalResumes: 0,
        totalAuditLogs: logs.length,
      },
      recentLogs: logs,
      recentUsers: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        profile: u.profile,
        _count: { interviews: 0, resumes: 0 },
      })),
    };
  }
}

export async function updateUserRoleAction(targetUserId: string, newRole: 'USER' | 'ADMIN') {
  const admin = await requireRole('ADMIN');

  try {
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
  } catch (err) {
    console.warn('[Prepr Admin] Prisma offline, updating role in devDb');
    const updated = devDb.updateUserRole(targetUserId, newRole);
    devDb.logAudit({
      actorId: admin.id,
      action: 'ADMIN_ROLE_CHANGED',
      resource: 'User',
      metadata: { targetUserId, newRole },
    });
    revalidatePath('/admin');
    return { success: true, user: updated };
  }
}
