import { SessionUser, getSession } from '@/lib/auth/session';

export type Permission =
  | 'dashboard.read'
  | 'profile.read'
  | 'profile.update'
  | 'resume.read'
  | 'resume.create'
  | 'resume.update'
  | 'resume.delete'
  | 'interview.create'
  | 'interview.read'
  | 'interview.update'
  | 'interview.submit'
  | 'interview.delete'
  | 'gd.create'
  | 'gd.read'
  | 'analytics.read'
  | 'admin.users.read'
  | 'admin.users.update'
  | 'admin.interviews.read'
  | 'admin.reports.read'
  | 'admin.audit.read'
  | 'admin.settings.manage';

const ROLE_PERMISSIONS: Record<SessionUser['role'], Permission[]> = {
  USER: [
    'dashboard.read',
    'profile.read',
    'profile.update',
    'resume.read',
    'resume.create',
    'resume.update',
    'resume.delete',
    'interview.create',
    'interview.read',
    'interview.update',
    'interview.submit',
    'gd.create',
    'gd.read',
    'analytics.read',
  ],
  INTERVIEWER: [
    'dashboard.read',
    'profile.read',
    'interview.read',
    'interview.update',
  ],
  RECRUITER: [
    'dashboard.read',
    'profile.read',
    'resume.read',
    'interview.read',
    'analytics.read',
  ],
  ADMIN: [
    'dashboard.read',
    'profile.read',
    'profile.update',
    'resume.read',
    'resume.create',
    'resume.update',
    'resume.delete',
    'interview.create',
    'interview.read',
    'interview.update',
    'interview.submit',
    'interview.delete',
    'gd.create',
    'gd.read',
    'analytics.read',
    'admin.users.read',
    'admin.users.update',
    'admin.interviews.read',
    'admin.reports.read',
    'admin.audit.read',
    'admin.settings.manage',
  ],
};

export function can(user: SessionUser | null, permission: Permission): boolean {
  if (!user) return false;
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new Error('UNAUTHORIZED: Authentication required');
  }
  return user;
}

export async function requireRole(role: SessionUser['role']): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== role && user.role !== 'ADMIN') {
    throw new Error(`FORBIDDEN: Requires role ${role}`);
  }
  return user;
}

export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireUser();
  if (!can(user, permission)) {
    throw new Error(`FORBIDDEN: Missing permission ${permission}`);
  }
  return user;
}
