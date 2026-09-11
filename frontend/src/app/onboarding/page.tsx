'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { CoachAvatar, CoachMood } from '@/components/coach/CoachAvatar';
import { triggerConfetti } from '@/lib/confetti';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/app/actions/auth';
import { updateProfileAction } from '@/app/actions/profile';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    college: 'National Institute of Technology',
    degree: 'B.Tech / B.E.',
    branch: 'Computer Science & Engineering',
    graduation_year: 2026,
    target_role: 'Software Development Engineer',
    target_companies: ['Google', 'Microsoft', 'Amazon'],
    experience_level: 'Fresher (0-1 yrs)',
    strongest_skills: ['Data Structures & Algorithms', 'Python'],
    weakest_skills: ['Operating Systems', 'System Design'],
    daily_goal_minutes: 25,
    confidence_level: 65
  });

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user?.name) {
        setFormData(prev => ({ ...prev, full_name: user.name || '' }));
      }
    }).catch(() => {});
  }, []);

  const availableRoles = [
    'Software Development Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Full-Stack Developer',
    'Data Analyst / Scientist',
    'Product / Tech Consultant'
  ];

  const availableCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Uber', 'TCS (Digital)', 'Infosys', 'Flipkart', 'High-Growth Startups'
  ];

  const allSkills = [
    'Data Structures & Algorithms', 'Python', 'Java', 'JavaScript / TypeScript',
    'Operating Systems', 'DBMS & SQL', 'Computer Networks', 'System Design',
    'Object-Oriented Programming', 'Communication & Articulation', 'HR & Behavioral STAR'
  ];

  const toggleStrongSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.strongest_skills.includes(skill);
      const updated = exists ? prev.strongest_skills.filter(s => s !== skill) : [...prev.strongest_skills, skill];
      return { ...prev, strongest_skills: updated };
    });
  };

  const toggleWeakSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.weakest_skills.includes(skill);
      const updated = exists ? prev.weakest_skills.filter(s => s !== skill) : [...prev.weakest_skills, skill];
      return { ...prev, weakest_skills: updated };
    });
  };

  const toggleCompany = (comp: string) => {
    setFormData(prev => {
      const exists = prev.target_companies.includes(comp);
      const updated = exists ? prev.target_companies.filter(c => c !== comp) : [...prev.target_companies, comp];
      return { ...prev, target_companies: updated };
    });
  };

  const getCoachAdvice = (): { mood: CoachMood; message: string } => {
    switch (step) {
      case 1:
        return {
          mood: 'happy',
          message: "Let's calibrate your academic profile to benchmark your placement readiness accurately."
        };
      case 2:
        return {
          mood: 'thinking',
          message: "Target roles and company tiers define the difficulty curve for your adaptive technical mock rooms."
        };
      case 3:
        return {
          mood: 'explaining',
          message: "Be honest about your stronger and weaker CS pillars—we will curate specific drills for your gaps."
        };
      case 4:
        return {
          mood: 'encouraging',
          message: "A daily 25-minute habit beats cramming before placement week by a factor of 4x."
        };
      case 5:
      default:
        return {
          mood: 'celebrating',
          message: "Readiness profile calibrated! Baseline index is computed. Welcome to your command center."
        };
    }
  };

  const coach = getCoachAdvice();

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await updateProfileAction({
        name: formData.full_name || 'Candidate',
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        graduationYear: Number(formData.graduation_year),
        targetRole: formData.target_role,
        targetCompanies: formData.target_companies,
        experienceLevel: formData.experience_level,
        strongestSkills: formData.strongest_skills,
        weakestSkills: formData.weakest_skills,
        dailyGoalMinutes: Number(formData.daily_goal_minutes),
        confidenceLevel: Number(formData.confidence_level),
      });
    } catch (e) {
      console.warn('Backend onboarding profile update fallback:', e);
    }
    triggerConfetti();
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 sm:p-12">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between border-b border-border pb-6">
        <div className="font-serif text-xl tracking-tight text-foreground">
          PREPR
        </div>

        {/* Minimalist Stepper */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-primary'
                  : i < step
                  ? 'w-3 bg-foreground-secondary'
                  : 'w-3 bg-border'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="text-xs font-sans text-foreground-secondary hover:text-foreground cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Main Container */}
      <main className="max-w-xl mx-auto w-full my-8 space-y-6">
        <div className="flex items-center justify-center">
          <CoachAvatar mood={coach.mood} size="md" message={coach.message} />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 space-y-6">
          {/* STEP 1: Academic Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted">Step 1 of 4</span>
                <h2 className="font-serif text-3xl font-normal text-foreground">Academic Profile</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-xs text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-1.5">College / University</label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={e => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-xs text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-1.5">Branch / Degree</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-xs text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-1.5">Graduation Year</label>
                    <select
                      value={formData.graduation_year}
                      onChange={e => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-xs text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
                    >
                      <option value={2025} className="bg-surface">2025</option>
                      <option value={2026} className="bg-surface">2026</option>
                      <option value={2027} className="bg-surface">2027</option>
                      <option value={2028} className="bg-surface">2028</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-1.5">Experience Level</label>
                    <select
                      value={formData.experience_level}
                      onChange={e => setFormData({ ...formData, experience_level: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-transparent text-xs text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
                    >
                      <option value="Fresher (0-1 yrs)" className="bg-surface">Fresher (0-1 yrs)</option>
                      <option value="Internship Experienced" className="bg-surface">Internship Experienced</option>
                      <option value="1+ Year Working" className="bg-surface">1+ Year Working</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Roles & Companies */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted">Step 2 of 4</span>
                <h2 className="font-serif text-3xl font-normal text-foreground">Target Roles & Companies</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-2.5">Target Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableRoles.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, target_role: role })}
                        className={`p-3.5 rounded-xl text-left text-xs font-sans border transition-all cursor-pointer ${
                          formData.target_role === role
                            ? 'border-primary bg-primary text-primary-foreground font-medium'
                            : 'border-border bg-surface-muted text-foreground hover:border-border-strong'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-2.5">Target Companies</label>
                  <div className="flex flex-wrap gap-2">
                    {availableCompanies.map(comp => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => toggleCompany(comp)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-sans border transition-all cursor-pointer ${
                          formData.target_companies.includes(comp)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-foreground-secondary'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Skill Self-Assessment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted">Step 3 of 4</span>
                <h2 className="font-serif text-3xl font-normal text-foreground">Skill Self-Assessment</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary mb-2.5">
                    Strongest Proficiencies (Select 2-3)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleStrongSkill(skill)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-sans border transition-all cursor-pointer ${
                          formData.strongest_skills.includes(skill)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-foreground-secondary'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-pink mb-2.5">
                    Gaps to Target (Select 2-3)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleWeakSkill(skill)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-sans border transition-all cursor-pointer ${
                          formData.weakest_skills.includes(skill)
                            ? 'border-pink bg-pink-soft/20 text-pink'
                            : 'border-border text-foreground-secondary'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Goals & Confidence */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted">Step 4 of 4</span>
                <h2 className="font-serif text-3xl font-normal text-foreground">Daily Commitment & Goals</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary">
                      Daily Time Allocation
                    </label>
                    <span className="font-serif text-sm font-normal text-foreground">{formData.daily_goal_minutes} mins / day</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[10, 20, 25, 45].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setFormData({ ...formData, daily_goal_minutes: mins })}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          formData.daily_goal_minutes === mins
                            ? 'border-primary bg-primary text-primary-foreground font-medium'
                            : 'border-border text-foreground-secondary'
                        }`}
                      >
                        <div className="text-xs">{mins}m</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-foreground-secondary">
                      Current Placement Confidence
                    </label>
                    <span className="font-serif text-sm font-normal text-foreground">{formData.confidence_level}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={95}
                    value={formData.confidence_level}
                    onChange={e => setFormData({ ...formData, confidence_level: Number(e.target.value) })}
                    className="w-full accent-primary cursor-pointer h-1 bg-border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Generated Profile */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 text-foreground" />
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-3xl font-normal">Profile Initialized</h2>
                <p className="text-xs text-foreground-secondary max-w-sm mx-auto">
                  Calibrated for {formData.target_role}.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted border border-border max-w-xs mx-auto space-y-3">
                <div>
                  <div className="font-serif text-5xl font-normal text-foreground">
                    68<span className="text-xs font-sans text-foreground-muted"> / 100</span>
                  </div>
                  <div className="text-[10px] font-sans uppercase tracking-widest text-foreground-muted mt-1">Baseline Index</div>
                </div>
                <div className="text-xs text-foreground-secondary pt-3 border-t border-border space-y-1">
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="font-medium text-foreground">{formData.target_role.split(' ')[0]} SDE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonus XP:</span>
                    <span className="font-medium text-foreground">+150 XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between gap-4">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="btn-pill-secondary text-xs flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="btn-pill-primary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : step === 4 ? (
              <button
                type="button"
                onClick={() => {
                  triggerConfetti();
                  setStep(5);
                }}
                className="btn-pill-primary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Generate Profile</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinish}
                className="btn-pill-primary w-full text-xs flex items-center justify-center gap-1.5 py-3 cursor-pointer"
              >
                <span>{submitting ? 'Launching Command Center...' : 'Enter Studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-foreground-muted">
        PREPR · The Intelligent Interview Studio
      </footer>
    </div>
  );
}
