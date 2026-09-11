'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { getAdminOverviewAction, updateUserRoleAction } from '@/app/actions/admin';
import { Shield, ShieldAlert, Users, FileText, Video, Activity, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminOverviewAction();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Access denied: Administrator privileges required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    setUpdatingUser(userId);
    setMessage(null);
    try {
      await updateUserRoleAction(userId, newRole);
      setMessage(`Updated user role to ${newRole}`);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-card rounded-lg border border-border" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-500">Security Gate · RBAC</span>
          <h1 className="font-serif text-3xl text-foreground font-normal mt-2 mb-4">Access Restricted</h1>
          <p className="text-sm text-foreground-muted mb-8 leading-relaxed">
            {error}. The Prepr Administration Console is exclusively accessible to accounts with elevated{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">ADMIN</code> credentials.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-pill-secondary text-xs px-5 py-2.5">
              Return to Candidate Dashboard
            </Link>
            <Link href="/login" className="btn-pill-primary text-xs px-5 py-2.5">
              Switch Account
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Editorial Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-foreground-muted">System Administration</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono flex items-center gap-1">
                <Shield className="w-3 h-3" /> RBAC Enforced
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-normal">Prepr Management Console</h1>
            <p className="text-sm text-foreground-muted mt-1">
              Live observability, user directories, role permissions, and immutable security audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="btn-pill-secondary text-xs px-4 py-2 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Real KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between text-foreground-muted mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">Registered Users</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-3xl font-mono font-medium">{data?.stats?.totalUsers || 0}</div>
            <div className="text-[11px] text-foreground-muted mt-2">Active database accounts</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between text-foreground-muted mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">Interviews Logged</span>
              <Video className="w-4 h-4" />
            </div>
            <div className="text-3xl font-mono font-medium">{data?.stats?.totalInterviews || 0}</div>
            <div className="text-[11px] text-foreground-muted mt-2">Evaluation sessions</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between text-foreground-muted mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">Resumes Analyzed</span>
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-3xl font-mono font-medium">{data?.stats?.totalResumes || 0}</div>
            <div className="text-[11px] text-foreground-muted mt-2">Parsed & benchmarked</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between text-foreground-muted mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">Core Engine Health</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-mono font-medium text-emerald-500">OPERATIONAL</div>
            <div className="text-[11px] text-foreground-muted mt-2">PostgreSQL + Next.js Engine</div>
          </div>
        </div>

        {/* User Directory Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium">Candidate Directory</h2>
              <p className="text-xs text-foreground-muted">System users and role assignments</p>
            </div>
            <span className="text-xs font-mono text-foreground-muted">
              Showing {data?.recentUsers?.length || 0} users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b border-border font-mono text-[11px] uppercase text-foreground-muted">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Role / RBAC</th>
                  <th className="py-3 px-4">Interviews</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {data?.recentUsers?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-sans font-medium text-foreground">{u.name || 'Unnamed Candidate'}</div>
                      <div className="text-[11px] text-foreground-muted">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-foreground-muted">
                      {u.profile?.targetRole || 'Not specified'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
                            : 'bg-muted border border-border text-foreground-muted'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{u._count?.interviews || 0}</td>
                    <td className="py-3 px-4 text-foreground-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={updatingUser === u.id || u.id === data?.admin?.id}
                        className="text-[11px] px-2.5 py-1 rounded border border-border hover:border-foreground/40 disabled:opacity-40 cursor-pointer"
                      >
                        {updatingUser === u.id
                          ? 'Updating...'
                          : u.role === 'ADMIN'
                          ? 'Revoke Admin'
                          : 'Promote Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Audit Trail Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium">Security & Action Audit Log</h2>
              <p className="text-xs text-foreground-muted">Immutable activity journal</p>
            </div>
            <Clock className="w-4 h-4 text-foreground-muted" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/30 border-b border-border text-[11px] uppercase text-foreground-muted">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.recentLogs?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-foreground-muted">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  data?.recentLogs?.map((log: any) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 text-foreground-muted">
                        {new Date(log.createdAt).toLocaleTimeString()} · {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[11px]">{log.action}</span>
                      </td>
                      <td className="py-3 px-4 text-foreground-muted">{log.resource}</td>
                      <td className="py-3 px-4 font-sans">{log.actor?.email || log.actorId || 'System'}</td>
                      <td className="py-3 px-4 text-foreground-muted max-w-xs truncate">
                        {log.metadata ? JSON.stringify(log.metadata) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
