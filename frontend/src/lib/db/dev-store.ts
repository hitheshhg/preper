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
  interviews?: any[];
  resumes?: any[];
}

interface DevDatabase {
  users: DevUser[];
  auditLogs: any[];
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

  updateUserProfile(userId: string, profileData: any): DevUser | null {
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;

    user.profile = {
      ...(user.profile || {}),
      ...profileData,
    };
    if (profileData.name) {
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

  logAudit(entry: any) {
    const db = readDb();
    db.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...entry,
    });
    if (db.auditLogs.length > 50) db.auditLogs.pop();
    writeDb(db);
  },

  getAuditLogs() {
    const db = readDb();
    return db.auditLogs;
  },
};
