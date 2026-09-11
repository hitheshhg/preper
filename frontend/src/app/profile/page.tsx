'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { getProfileAction, updateProfileAction } from '@/app/actions/profile';
import { User, Award, Building, BookOpen, Clock, Target, CheckCircle2, AlertCircle, Save, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    college: '',
    degree: '',
    branch: '',
    graduationYear: 2026,
    targetRole: 'Software Development Engineer',
    targetCompanies: [] as string[],
    experienceLevel: 'Fresher (0-1 yrs)',
    strongestSkills: [] as string[],
    weakestSkills: [] as string[],
    dailyGoalMinutes: 30,
    confidenceLevel: 50,
  });

  const [completionPercent, setCompletionPercent] = useState(0);
  const [totalInterviews, setTotalInterviews] = useState(0);

  const availableRoles = [
    'Software Development Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Full-Stack Developer',
    'Data Analyst / Scientist',
    'Machine Learning Engineer',
    'DevOps / SRE',
    'Product Manager',
  ];

  const availableCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Uber', 'Stripe', 'Atlassian', 'Infosys', 'TCS (Digital)'
  ];

  const skillOptions = [
    'Data Structures & Algorithms',
    'System Design',
    'Database Engineering & SQL',
    'Operating Systems',
    'Computer Networks',
    'Object-Oriented Design',
    'TypeScript / JavaScript',
    'Python',
    'Java',
    'Behavioral & STAR Method',
  ];

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfileAction();
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          role: data.user.role,
          college: data.profile?.college || '',
          degree: data.profile?.degree || '',
          branch: data.profile?.branch || '',
          graduationYear: data.profile?.graduationYear || 2026,
          targetRole: data.profile?.targetRole || 'Software Development Engineer',
          targetCompanies: data.profile?.targetCompanies || [],
          experienceLevel: data.profile?.experienceLevel || 'Fresher (0-1 yrs)',
          strongestSkills: data.profile?.strongestSkills || [],
          weakestSkills: data.profile?.weakestSkills || [],
          dailyGoalMinutes: data.profile?.dailyGoalMinutes || 30,
          confidenceLevel: data.profile?.confidenceLevel || 50,
        });
        setCompletionPercent(data.completionPercent);
        setTotalInterviews(data.totalInterviews);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setErrorMsg('Please log in to view and edit your profile settings.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleTargetCompany = (comp: string) => {
    setFormData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.includes(comp)
        ? prev.targetCompanies.filter(c => c !== comp)
        : [...prev.targetCompanies, comp],
    }));
  };

  const toggleStrongSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      strongestSkills: prev.strongestSkills.includes(skill)
        ? prev.strongestSkills.filter(s => s !== skill)
        : [...prev.strongestSkills, skill],
    }));
  };

  const toggleWeakSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      weakestSkills: prev.weakestSkills.includes(skill)
        ? prev.weakestSkills.filter(s => s !== skill)
        : [...prev.weakestSkills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateProfileAction({
        name: formData.name,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        graduationYear: Number(formData.graduationYear),
        targetRole: formData.targetRole,
        targetCompanies: formData.targetCompanies,
        experienceLevel: formData.experienceLevel,
        strongestSkills: formData.strongestSkills,
        weakestSkills: formData.weakestSkills,
        dailyGoalMinutes: Number(formData.dailyGoalMinutes),
        confidenceLevel: Number(formData.confidenceLevel),
      });

      if (res.success) {
        setSuccessMsg('Profile changes saved successfully.');
        setCompletionPercent(res.profile.completionPercent);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="h-64 bg-card rounded-lg border border-border" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Editorial Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-foreground-muted">Account & Dossier</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted/50 font-mono">
                {formData.role}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-normal">Candidate Profile</h1>
            <p className="text-sm text-foreground-muted mt-1">
              Calibrate your career benchmarks, target companies, and skill competencies.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Completion Gauge */}
            <div className="bg-card border border-border px-4 py-3 rounded-lg flex items-center gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted">Profile Calibration</div>
                <div className="text-xl font-mono font-medium text-foreground">{completionPercent}%</div>
              </div>
              <div className="w-20 bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className="bg-foreground h-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
            {errorMsg.includes('log in') && (
              <Link href="/login" className="underline font-medium ml-2">Go to Login</Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Identity & Credentials */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
              <User className="w-4 h-4 text-foreground-muted" />
              <h2 className="text-base font-medium">Candidate Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">Account Email</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-muted/40 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground-muted cursor-not-allowed"
                />
                <span className="text-[11px] text-foreground-muted mt-1 block">Managed by authentication credentials</span>
              </div>
            </div>
          </div>

          {/* Section 2: Education & Background */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
              <BookOpen className="w-4 h-4 text-foreground-muted" />
              <h2 className="text-base font-medium">Academic Foundation</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">University / Institute</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={e => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.Tech / B.E."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">Branch / Major</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">Graduation Year</label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={e => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                  min={2020}
                  max={2035}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Target Role & Companies */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
              <Target className="w-4 h-4 text-foreground-muted" />
              <h2 className="text-base font-medium">Placement Calibration</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">Target Role</label>
                  <select
                    value={formData.targetRole}
                    onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">Experience Tier</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  >
                    <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                    <option value="Early Career (1-3 yrs)">Early Career (1-3 yrs)</option>
                    <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                    <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                  Target Companies (Interview Room Calibration)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCompanies.map(comp => {
                    const isSelected = formData.targetCompanies.includes(comp);
                    return (
                      <button
                        type="button"
                        key={comp}
                        onClick={() => toggleTargetCompany(comp)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-foreground text-background border-foreground font-medium'
                            : 'bg-background text-foreground border-border hover:border-foreground/40'
                        }`}
                      >
                        {comp}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Skills Calibration */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
              <Award className="w-4 h-4 text-foreground-muted" />
              <h2 className="text-base font-medium">Competency Calibration</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                  Strongest Pillars (Used to tailor mock difficulty upward)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => {
                    const isSelected = formData.strongestSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleStrongSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 font-medium'
                            : 'bg-background text-foreground border-border hover:border-foreground/40'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                  Focus Gap Pillars (Targeted by Prepr adaptive recommendations)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => {
                    const isSelected = formData.weakestSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleWeakSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 font-medium'
                            : 'bg-background text-foreground border-border hover:border-foreground/40'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="btn-pill-primary flex items-center gap-2 text-xs px-6 py-2.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
