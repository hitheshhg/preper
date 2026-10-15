'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  FileText,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressLine } from '@/components/ui/ProgressLine';

export function EngineLab() {
  const [activeTab, setActiveTab] = useState<'interview' | 'resume' | 'gd' | 'readiness'>('interview');

  // Resume Interactive State
  const [selectedBulletIndex, setSelectedBulletIndex] = useState(0);

  const sampleBullets = [
    {
      role: 'Backend Microservices',
      raw: 'Created backend REST APIs in Node.js and MongoDB to handle user requests.',
      atsScoreBefore: 42,
      critique: 'Missing traffic metrics, latency measurements, database indexing, and fault-tolerance guarantees.',
      rewritten:
        'Engineered 14 resilient Node.js / PostgreSQL microservices handling 12,500 req/sec at 99.95% uptime, reducing p99 response times from 340ms to 48ms via Redis read-replicas and connection pooling.',
      atsScoreAfter: 96,
      injectedKeywords: ['12,500 req/sec', 'Redis read-replicas', 'p99 latency 48ms', '99.95% uptime'],
    },
    {
      role: 'Distributed Systems',
      raw: 'Implemented a cache system to make our database run faster and avoid crashes.',
      atsScoreBefore: 38,
      critique: 'Lacks quantitative scale, cache eviction algorithms, and concurrent write-conflict handling.',
      rewritten:
        'Architected a multi-tier distributed caching layer utilizing Redis and LRU eviction, buffering 85% of queries from primary databases and mitigating cache stampede under 40k peak concurrent connections.',
      atsScoreAfter: 94,
      injectedKeywords: ['LRU eviction', '85% query buffering', 'Cache stampede mitigation', '40k concurrent'],
    },
    {
      role: 'Frontend Performance',
      raw: 'Worked on web app frontend with React and made page load quicker.',
      atsScoreBefore: 45,
      critique: 'Does not cite Core Web Vitals (LCP, FID, CLS), bundle size reductions, or code-splitting metrics.',
      rewritten:
        'Optimized Next.js enterprise dashboard by implementing dynamic code-splitting and asset pre-fetching, elevating Google Lighthouse performance from 54 to 98 and cutting LCP by 68% (2.8s → 0.9s).',
      atsScoreAfter: 98,
      injectedKeywords: ['Lighthouse 98', 'LCP reduced 68%', 'Dynamic code-splitting', 'Asset pre-fetching'],
    },
  ];

  // GD Personas
  const gdPersonas = [
    {
      name: 'Rohan Sharma',
      archetype: 'The Leader',
      color: 'border-lavender text-lavender-text bg-lavender-soft/10',
      description: 'Synthesizes conflicting arguments, manages turn-taking, and guides discussion to actionable consensus.',
      sampleQuote: '"Both perspectives hold weight. Priya highlighted cost scalability while Arun identified data governance. Let us bridge these two by examining a hybrid cloud posture."',
    },
    {
      name: 'Vikramaditya',
      archetype: 'The Aggressive Speaker',
      color: 'border-pink text-pink-text bg-pink-soft/10',
      description: 'Frequently intervenes, challenges assumptions, and stresses high urgency under time pressure.',
      sampleQuote: '"That architecture will collapse before Q3! If you ignore the database migration overhead, the entire budget is burned in 30 days."',
    },
    {
      name: 'Ananya Rao',
      archetype: 'The Data Person',
      color: 'border-blue text-blue-text bg-blue-soft/10',
      description: 'Anchors every counterpoint in peer-reviewed benchmarks, statistical surveys, and financial telemetry.',
      sampleQuote: '"Gartner’s 2025 enterprise telemetry reports that 73% of companies implementing microservices without service meshes encounter observability regressions within 6 months."',
    },
    {
      name: 'Dr. Siddharth',
      archetype: 'The Silent Expert',
      color: 'border-mint text-mint-text bg-mint-soft/10',
      description: 'Rarely interrupts, but delivers decisive architectural depth that reframes the entire discussion.',
      sampleQuote: '"We are confusing throughput with linearizability. The underlying constraint here is Raft consensus heartbeat latency across cross-region availability zones."',
    },
  ];

  // Readiness Weights
  const readinessDimensions = [
    { name: 'Technical Depth', weight: '20%', score: 88, desc: 'OS, Memory Model, Distributed Consistency & Concurrency' },
    { name: 'Coding Proficiency', weight: '15%', score: 82, desc: 'DSA complexity, edge cases, time/space trade-offs' },
    { name: 'Communication & Structuring', weight: '15%', score: 78, desc: 'STAR articulation, pause cadence, clear reasoning' },
    { name: 'CS Core Principles', weight: '15%', score: 85, desc: 'DBMS ACID, Networking TCP/IP, Computer Architecture' },
    { name: 'Consistency & Confidence', weight: '15%', score: 80, desc: 'Daily practice streak, proctoring optical gaze continuity' },
    { name: 'ATS Resume Strength', weight: '10%', score: 94, desc: 'Quantified metrics, lexical vector overlap, clean layout' },
    { name: 'HR & Cultural Alignment', weight: '10%', score: 84, desc: 'Conflict resolution, ownership mindset, ethics' },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('interview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
            activeTab === 'interview'
              ? 'bg-foreground text-background font-semibold shadow-xs'
              : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>01 / Adaptive Mock Arena</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
            activeTab === 'resume'
              ? 'bg-foreground text-background font-semibold shadow-xs'
              : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>02 / ATS Resume Diagnostics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gd')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
            activeTab === 'gd'
              ? 'bg-foreground text-background font-semibold shadow-xs'
              : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>03 / 7-Persona GD Boardroom</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('readiness')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
            activeTab === 'readiness'
              ? 'bg-foreground text-background font-semibold shadow-xs'
              : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>04 / Transparent Readiness Index</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 min-h-[460px] flex flex-col justify-between">
        {/* TAB 1: MOCK INTERVIEW */}
        {activeTab === 'interview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[11px] font-mono text-lavender-text uppercase tracking-widest block font-semibold">
                  Continuous Voice Activity Loop
                </span>
                <h3 className="font-serif text-3xl font-normal leading-tight">
                  No awkward buttons.<br />Just natural engineering discourse.
                </h3>
                <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                  Most platforms force candidates to press push-to-talk buttons. Preper listens in continuous optical and voice streams. When you finish articulating your reasoning, the adaptive AI formulates contextual follow-ups within 320ms.
                </p>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="primary" size="md">
                      <span>Launch Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 rounded-2xl border border-border bg-background space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-foreground" />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">Live Proctored Session Telemetry</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint-soft/30 text-mint-text border border-mint/40">
                    Proctor Trust: 99.4%
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                    <span className="text-foreground-secondary">Voice Activity Detection (VAD)</span>
                    <span className="font-mono font-semibold text-foreground">Streaming · Silence Cutoff 1.8s</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                    <span className="text-foreground-secondary">Adaptive Probing Threshold</span>
                    <span className="font-mono font-semibold text-foreground">Depth Escalation enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                    <span className="text-foreground-secondary">Evaluation Rubric Matrix</span>
                    <span className="font-mono font-semibold text-foreground">STAR Methodology + Big-O Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATS RESUME REWRITER */}
        {activeTab === 'resume' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-[11px] font-mono text-lavender-text uppercase tracking-widest block font-semibold">
                  Quantifiable Impact Injection
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                  Neural ATS Bullet Transformer
                </h3>
              </div>

              {/* Sample Selector */}
              <div className="flex items-center gap-2">
                {sampleBullets.map((bullet, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedBulletIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      selectedBulletIndex === idx
                        ? 'bg-foreground text-background font-semibold'
                        : 'border border-border bg-background text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    {bullet.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-Side Before & After */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unoptimized Bullet */}
              <div className="p-6 rounded-2xl border border-pink/40 bg-pink-soft/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-pink-text font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Unquantified Bullet
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-pink/40 text-pink-text">
                    ATS Score: {sampleBullets[selectedBulletIndex].atsScoreBefore}%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-foreground/80 font-sans leading-relaxed">
                  &ldquo;{sampleBullets[selectedBulletIndex].raw}&rdquo;
                </p>

                <div className="text-[11px] text-pink-text/90 pt-2 border-t border-pink/20">
                  <strong>ATS Diagnostic:</strong> {sampleBullets[selectedBulletIndex].critique}
                </div>
              </div>

              {/* Neural Optimized Bullet */}
              <div className="p-6 rounded-2xl border border-mint/60 bg-mint-soft/15 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-mint-text font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Quantified Metric Bullet
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-mint/60 bg-mint-soft/30 text-mint-text font-semibold">
                    ATS Score: {sampleBullets[selectedBulletIndex].atsScoreAfter}%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-foreground font-sans font-medium leading-relaxed">
                  &ldquo;{sampleBullets[selectedBulletIndex].rewritten}&rdquo;
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-mint/20">
                  {sampleBullets[selectedBulletIndex].injectedKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface border border-mint/40 text-foreground">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 7-PERSONA GD BOARDROOM */}
        {activeTab === 'gd' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <span className="text-[11px] font-mono text-lavender-text uppercase tracking-widest block font-semibold">
                Multi-Agent Psychological Simulation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                7 Distinct Group Discussion Personas
              </h3>
              <p className="text-xs text-foreground-secondary pt-1">
                Simulates authentic boardroom dynamics with real-time interruptions, contrarian arguments, and turn-taking moderation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gdPersonas.map((persona, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">{persona.name}</span>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${persona.color}`}>
                        {persona.archetype}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {persona.description}
                  </p>
                  <p className="text-xs italic text-foreground font-serif border-l-2 border-border pl-2.5">
                    {persona.sampleQuote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: READINESS RADAR */}
        {activeTab === 'readiness' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <span className="text-[11px] font-mono text-lavender-text uppercase tracking-widest block font-semibold">
                Objective Weighted Calculation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                Transparent Placement Readiness Index
              </h3>
              <p className="text-xs text-foreground-secondary pt-1">
                Rather than an arbitrary percentage, Prepr aggregates candidate performance across 7 weighted hiring dimensions calibrated for Tier-1 companies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readinessDimensions.map((dim, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-background space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{dim.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[10px] text-foreground-muted">Weight: {dim.weight}</span>
                      <span className="font-semibold text-foreground">{dim.score}%</span>
                    </div>
                  </div>
                  <ProgressLine value={dim.score} color="dark" />
                  <span className="text-[10px] text-foreground-muted block">{dim.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom studio status ticker */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-foreground-muted">
          <span>Module Calibration: SDE-1 / Tier-1 Campus Placement Standard</span>
          <Link href="/login" className="text-foreground hover:underline font-medium flex items-center gap-1">
            <span>Access Placement Studio</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
