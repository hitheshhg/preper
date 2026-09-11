'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ArrowRight, Clock } from 'lucide-react';

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<'HR' | 'Technical' | 'Behavioral' | 'Mixed'>('Technical');
  const [selectedRole, setSelectedRole] = useState('Software Development Engineer');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [format, setFormat] = useState<'quick' | 'standard' | 'deep'>('quick');

  const formats = [
    {
      id: 'quick',
      title: 'Quick Sprint',
      questions: 5,
      duration: 10,
      desc: 'Rapid daily drill or pre-screening brush up.'
    },
    {
      id: 'standard',
      title: 'Standard Round',
      questions: 10,
      duration: 20,
      desc: 'Simulates a standard 20-minute campus placement round.'
    },
    {
      id: 'deep',
      title: 'Comprehensive',
      questions: 15,
      duration: 30,
      desc: 'Exhaustive exploration of architecture and trade-offs.'
    }
  ];

  const modes = [
    {
      id: 'Technical',
      title: 'Technical Depth',
      desc: 'Operating Systems, Database Concurrency, Networks, and System Design trade-offs.'
    },
    {
      id: 'Behavioral',
      title: 'STAR Methodology',
      desc: 'Structured Situation, Task, Action, Result exploration of your real projects.'
    },
    {
      id: 'HR',
      title: 'HR & Cultural Alignment',
      desc: 'Introduction, professional ambitions, conflict resolution, and leadership values.'
    },
    {
      id: 'Mixed',
      title: 'Comprehensive Rehearsal',
      desc: 'Blended mock testing algorithmic depth followed by behavioral defense.'
    }
  ];

  const selectedFormatConfig = formats.find(f => f.id === format) || formats[0];

  const handleStart = () => {
    router.push(
      `/interview/session?mode=${selectedMode}&role=${encodeURIComponent(selectedRole)}&difficulty=${difficulty}&count=${selectedFormatConfig.questions}&duration=${selectedFormatConfig.duration}`
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-lavender selection:text-foreground transition-colors duration-200">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-4xl overflow-y-auto">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-8">
            <SectionLabel number="01" label="Choose Your Challenge" />
            <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.05]">
              What&apos;s next?
            </h1>
            <p className="text-sm text-foreground-secondary max-w-lg font-sans leading-relaxed">
              Configure your interview session. The AI interviewer speaks automatically, probes incomplete answers, and adapts difficulty live.
            </p>
          </div>

          {/* 1. Assessment Track Selection */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.14em] font-medium text-foreground-secondary">
              1. Assessment Track
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modes.map(m => {
                const isSelected = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMode(m.id as any)}
                    className={`p-6 text-left border rounded-2xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-surface shadow-xs'
                        : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xl font-normal text-foreground">
                        {m.title}
                      </h3>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-foreground-secondary leading-relaxed">
                      {m.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Format & Duration */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.14em] font-medium text-foreground-secondary">
              2. Interview Format
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {formats.map(f => {
                const isSelected = format === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id as any)}
                    className={`p-5 text-left border rounded-2xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-surface'
                        : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-sans text-foreground-secondary mb-2">
                      <span>{f.questions} Questions</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        ~{f.duration}m
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-normal mb-1">{f.title}</h4>
                    <p className="text-[11px] text-foreground-muted">{f.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Role & Rigor Parameters */}
          <div className="space-y-6 pt-2">
            <span className="text-xs uppercase tracking-[0.14em] font-medium text-foreground-secondary">
              3. Target Role & Rigor
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-foreground-secondary mb-2 font-medium">
                  Target Engineering Role
                </label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
                >
                  <option value="Software Development Engineer">Software Development Engineer (SDE)</option>
                  <option value="Frontend Engineer">Frontend Engineer (React / TypeScript)</option>
                  <option value="Backend Engineer">Backend Engineer (Distributed Systems / Python)</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Data Analyst & ML">Data Analyst & Machine Learning</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-foreground-secondary mb-2 font-medium">
                  Initial Difficulty Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-3 rounded-xl border text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground-secondary hover:border-border-strong'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-6 border-t border-border">
            <Button variant="pill-dark" size="lg" onClick={handleStart} className="w-full sm:w-auto">
              <span>Begin Interview Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </main>

      <Footer />
    </div>
  );
}
