'use client';

import React from 'react';
import { ReadinessBreakdown } from '@/types';
import { ShieldCheck, Info, TrendingUp, Sparkles, Award } from 'lucide-react';
import { Card3D } from '@/components/common/Card3D';

interface ReadinessGaugeProps {
  readiness: ReadinessBreakdown;
  className?: string;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ readiness, className = '' }) => {
  const score = readiness.overall;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatus = (val: number) => {
    if (val >= 80) return { label: 'Placement Ready (Tier-1)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(0,245,155,0.2)]' };
    if (val >= 65) return { label: 'Interview Contender', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' };
    return { label: 'Foundational Phase', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]' };
  };

  const status = getStatus(score);

  const dimensions = [
    { label: 'Technical Depth', value: readiness.technical, weight: '20%', color: 'from-emerald-500 to-teal-400' },
    { label: 'Coding Proficiency', value: readiness.coding, weight: '15%', color: 'from-teal-400 to-cyan-400' },
    { label: 'Communication & Delivery', value: readiness.communication, weight: '15%', color: 'from-cyan-400 to-blue-500' },
    { label: 'Problem Solving & CS Core', value: readiness.problem_solving, weight: '15%', color: 'from-indigo-500 to-purple-500' },
    { label: 'HR & Cultural Alignment', value: readiness.hr, weight: '10%', color: 'from-purple-500 to-pink-500' },
    { label: 'Resume ATS Health', value: readiness.resume, weight: '10%', color: 'from-amber-400 to-orange-500' },
    { label: 'Confidence & Consistency', value: readiness.confidence, weight: '15%', color: 'from-emerald-400 to-cyan-400' }
  ];

  return (
    <Card3D glowColor="emerald" intensity={8} className={className}>
      <div className="p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#00f59b] animate-pulse" />
              <h3 className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Placement Readiness Index 3D</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Tier-1 Calibrated
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-dimensional placement aptitude calibrated against hiring rubrics of FAANG & top tech firms.
            </p>
          </div>

          <div className={`self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-black border ${status.color}`}>
            {status.label}
          </div>
        </div>

        {/* 3D Gauge & Dimension Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Radial Dimensional Ring */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center preserve-3d">
              {/* Outer Ambient Glow Disk */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-xl pointer-events-none" />

              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]" viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="neonEmeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f59b" />
                    <stop offset="50%" stopColor="#00e5ff" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800/80"
                  strokeWidth="11"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#neonEmeraldGlow)"
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* 3D Beveled Center Platter */}
              <div
                className="absolute w-28 h-28 rounded-full bg-surface-elevated border border-border shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center preserve-3d"
                style={{ transform: 'translateZ(25px)' }}
              >
                <span className="text-4xl font-black tracking-tight text-foreground drop-shadow-sm">
                  {score}
                </span>
                <span className="text-[9px] font-extrabold text-foreground-muted uppercase tracking-widest mt-0.5">
                  READINESS
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Top 18th Percentile Candidate</span>
            </div>
          </div>

          {/* 7 Dimensions Precision Energy Bars */}
          <div className="lg:col-span-8 space-y-3">
            {dimensions.map(d => (
              <div key={d.label} className="space-y-1 group">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold group-hover:text-emerald-400 transition-colors">
                    {d.label} <span className="text-slate-400 font-normal text-[11px]">({d.weight})</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{d.value}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${d.color} rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,245,155,0.3)]`}
                    style={{ width: `${d.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Callout */}
        {readiness.explanation && (
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-white/10 flex items-start gap-3">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <strong className="font-bold text-slate-900 dark:text-white">Algorithmic Attribution: </strong>
              {readiness.explanation}
            </p>
          </div>
        )}
      </div>
    </Card3D>
  );
};
