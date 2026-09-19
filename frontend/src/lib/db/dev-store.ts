import fs from 'fs';
import path from 'path';

export interface DevUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  profile?: {
    college?: string;
    degree?: string;
    branch?: string;
    graduationYear?: number;
    targetRole?: string;
    targetCompanies?: string[];
    experienceLevel?: string;
    strongestSkills?: string[];
    weakestSkills?: string[];
    dailyGoalMinutes?: number;
    confidenceLevel?: number;
    completionPercent?: number;
  };
  interviews?: unknown[];
  resumes?: unknown[];
}

export interface DevAuditLog {
  id: string;
  createdAt: string;
  actorId?: string;
  action: string;
  resource: string;
  actor?: { email?: string; name?: string };
  metadata?: Record<string, unknown>;
}

interface DevDatabase {
  users: DevUser[];
  auditLogs: DevAuditLog[];
}

const DB_FILE = path.join(process.cwd(), '.prepr-dev-db.json');

function readDb(): DevDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Prepr DevDB] Failed to read dev db file, creating new state:', err);
  }
  return { users: [], auditLogs: [] };
}

function writeDb(db: DevDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Prepr DevDB] Failed to write dev db file:', err);
  }
}

export const devDb = {
  findUserByEmail(email: string): DevUser | null {
    const db = readDb();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById(id: string): DevUser | null {
    const db = readDb();
    return db.users.find(u => u.id === id) || null;
  },

  createUser(user: DevUser): DevUser {
    const db = readDb();
    const existingIdx = db.users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIdx >= 0) {
      db.users[existingIdx] = user;
    } else {
      db.users.push(user);
    }
    writeDb(db);
    return user;
  },

  updateUserProfile(userId: string, profileData: Record<string, unknown>): DevUser | null {
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;

    user.profile = {
      ...(user.profile || {}),
      ...profileData,
    };
    if (typeof profileData.name === 'string') {
      user.name = profileData.name;
    }
    writeDb(db);
    return user;
  },

  updateUserRole(userId: string, role: 'USER' | 'ADMIN'): DevUser | null {
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;
    user.role = role;
    writeDb(db);
    return user;
  },

  getAllUsers(): DevUser[] {
    const db = readDb();
    return db.users;
  },

  logAudit(entry: Record<string, unknown>) {
    const db = readDb();
    const auditEntry: DevAuditLog = {
      id: `audit_${Date.now()}`,
      createdAt: new Date().toISOString(),
      action: typeof entry.action === 'string' ? entry.action : 'UNKNOWN_ACTION',
      resource: typeof entry.resource === 'string' ? entry.resource : 'UNKNOWN_RESOURCE',
      actorId: typeof entry.actorId === 'string' ? entry.actorId : undefined,
      metadata: typeof entry.metadata === 'object' && entry.metadata !== null ? (entry.metadata as Record<string, unknown>) : undefined,
      ...entry,
    };
    db.auditLogs.unshift(auditEntry);
    if (db.auditLogs.length > 50) db.auditLogs.pop();
    writeDb(db);
  },

  getAuditLogs() {
    const db = readDb();
    return db.auditLogs;
  },
};
