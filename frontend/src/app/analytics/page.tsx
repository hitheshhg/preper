'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import {
  TrendingUp,
  ArrowRight,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function AnalyticsPage() {
  const readinessHistory = [
    { week: 'W1', score: 58 },
    { week: 'W2', score: 62 },
    { week: 'W3', score: 66 },
    { week: 'W4', score: 72 }
  ];

  const categoryRadarData = [
    { category: 'Technical CS', score: 75, fullMark: 100 },
    { category: 'Coding DSA', score: 70, fullMark: 100 },
    { category: 'Communication', score: 68, fullMark: 100 },
    { category: 'HR Fit', score: 78, fullMark: 100 },
    { category: 'Resume ATS', score: 74, fullMark: 100 },
    { category: 'Problem Solving', score: 72, fullMark: 100 }
  ];

  const weeklyXPData = [
    { day: 'Mon', xp: 40 },
    { day: 'Tue', xp: 80 },
    { day: 'Wed', xp: 60 },
    { day: 'Thu', xp: 110 },
    { day: 'Fri', xp: 90 },
    { day: 'Sat', xp: 40 },
    { day: 'Sun', xp: 70 }
  ];

  const dimensions = [
    { name: 'Core Computer Science', score: 75, benchmark: 80, delta: '+14%', status: 'Progressing', link: '/interview?mode=Technical' },
    { name: 'Data Structures & Algorithms', score: 70, benchmark: 85, delta: '+8%', status: 'Focus Required', link: '/interview?mode=Technical' },
    { name: 'Communication & Articulation', score: 68, benchmark: 75, delta: '0%', status: 'Plateaued', link: '/gd' },
    { name: 'Behavioral & Leadership (STAR)', score: 78, benchmark: 75, delta: '+12%', status: 'Benchmark Met', link: '/interview?mode=STAR' },
    { name: 'Resume ATS Compatibility', score: 74, benchmark: 80, delta: '+6%', status: 'Progressing', link: '/resume' }
  ];

  const actionableInsights = [
    {
      title: "Core CS Score Surged (+14%)",
      desc: "Operating Systems and DBMS mock scores climbed from 61% to 75% over recent mock sessions.",
      type: "positive"
    },
    {
      title: "Technical vs Behavioral Gap",
      desc: "Candidate performs higher on structured architectural topics (82%) than on open-ended situational queries (68%).",
      type: "neutral"
    },
    {
      title: "Communication Plateau Identified",
      desc: "Articulation score has stabilized at 68%. Participate in 2 Group Discussion sessions to overcome this threshold.",
      type: "warning"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-5xl overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-3 max-w-xl">
              <SectionLabel number="03" label="Performance Telemetry" />
              <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.02]">
                Numbers with<br />context.
              </h1>
              <p className="text-xs text-foreground-secondary pt-1 leading-relaxed">
                Comprehensive evaluation analytics tracking your transition toward tier-1 hiring benchmarks.
              </p>
            </div>

            <Badge variant="mint">Top 15% Cohort Velocity</Badge>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Readiness Score
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-foreground">
                72<span className="text-xs font-sans text-foreground-muted">/100</span>
              </div>
              <span className="text-[11px] text-foreground-secondary font-sans flex items-center gap-1 pt-1">
                <TrendingUp className="w-3 h-3 text-mint" /> +14 pts this month
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Offer Probability
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-foreground">
                78%
              </div>
              <span className="text-[11px] text-foreground-secondary block pt-1">
                Tier-2 / Tier-1 Contender
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Sessions Completed
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-foreground">
                18
              </div>
              <span className="text-[11px] text-foreground-secondary block pt-1">
                12 Tech · 4 HR · 2 GD
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Weekly XP Volume
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-foreground flex items-center gap-1.5">
                <span>490</span>
                <span className="text-xs font-sans text-foreground-muted">XP</span>
              </div>
              <span className="text-[11px] text-foreground-secondary block pt-1">
                5 consecutive active days
              </span>
            </div>
          </div>

          {/* Actionable AI Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actionableInsights.map((insight, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface border border-border space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      insight.type === 'positive'
                        ? 'bg-mint'
                        : insight.type === 'warning'
                        ? 'bg-pink'
                        : 'bg-lavender'
                    }`}
                  />
                  <h4 className="font-sans font-medium text-xs uppercase tracking-wider text-foreground">
                    {insight.title}
                  </h4>
                </div>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  {insight.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row 1: Readiness Over Time & Category Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Readiness Curve */}
            <div className="lg:col-span-7 p-8 rounded-2xl bg-surface border border-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-normal text-foreground">Readiness Trajectory</h3>
                  <p className="text-xs text-foreground-secondary">4-week progression towards 85+ offer benchmark</p>
                </div>
                <Badge variant="mint">+14 pts Delta</Badge>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readinessHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.4} />
                    <XAxis dataKey="week" stroke="var(--chart-label)" fontSize={11} tickLine={false} />
                    <YAxis domain={[50, 100]} stroke="var(--chart-label)" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        fontSize: '12px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--chart-primary)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--chart-primary)', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Skill Dimensions */}
            <div className="lg:col-span-5 p-8 rounded-2xl bg-surface border border-border space-y-6">
              <div>
                <h3 className="font-serif text-xl font-normal text-foreground">Competency Radar</h3>
                <p className="text-xs text-foreground-secondary">Hiring dimensions mapped across 6 axes</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={categoryRadarData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <PolarGrid stroke="var(--chart-grid)" opacity={0.5} />
                    <PolarAngleAxis dataKey="category" stroke="var(--chart-label)" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} opacity={0.3} tick={false} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="var(--chart-secondary)"
                      fill="var(--chart-secondary)"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Weekly Practice Volume */}
          <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-normal text-foreground">Daily Practice Volume & XP</h3>
                <p className="text-xs text-foreground-secondary">Consistency index for current sprint week</p>
              </div>
              <Badge variant="neutral">Streak: 5 Days Active</Badge>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyXPData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.4} />
                  <XAxis dataKey="day" stroke="var(--chart-label)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--chart-label)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="xp" fill="var(--chart-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dimension Breakdown Table */}
          <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <div>
              <h3 className="font-serif text-xl font-normal text-foreground">Dimension Diagnostics & Action Plan</h3>
              <p className="text-xs text-foreground-secondary">Granular breakdown of evaluation pillars against target criteria</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-foreground-secondary">
                    <th className="pb-3 font-sans font-medium uppercase tracking-wider text-[10px]">Dimension</th>
                    <th className="pb-3 font-sans font-medium uppercase tracking-wider text-[10px]">Candidate Score</th>
                    <th className="pb-3 font-sans font-medium uppercase tracking-wider text-[10px]">Benchmark</th>
                    <th className="pb-3 font-sans font-medium uppercase tracking-wider text-[10px]">Recent Delta</th>
                    <th className="pb-3 font-sans font-medium uppercase tracking-wider text-[10px]">Status</th>
                    <th className="pb-3 text-right font-sans font-medium uppercase tracking-wider text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dimensions.map(d => (
                    <tr key={d.name} className="hover:bg-surface-muted transition-colors">
                      <td className="py-4 font-medium text-foreground">
                        {d.name}
                      </td>
                      <td className="py-4 font-serif text-sm font-normal text-foreground">
                        {d.score}%
                      </td>
                      <td className="py-4 text-foreground-secondary">
                        {d.benchmark}%
                      </td>
                      <td className="py-4 font-sans font-medium text-foreground">
                        {d.delta}
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            d.status === 'Benchmark Met'
                              ? 'mint'
                              : d.status === 'Focus Required'
                              ? 'pink'
                              : d.status === 'Plateaued'
                              ? 'lavender'
                              : 'neutral'
                          }
                        >
                          {d.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={d.link}
                          className="inline-flex items-center gap-1 font-sans text-xs font-medium text-foreground hover:underline"
                        >
                          <span>Practice</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
    </div>
  );
}
