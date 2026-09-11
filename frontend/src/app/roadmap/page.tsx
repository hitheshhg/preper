'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressLine } from '@/components/ui/ProgressLine';
import { RoadmapData } from '@/types';
import { api } from '@/lib/api';
import {
  Check,
  ArrowRight,
  Clock
} from 'lucide-react';
import { CoachAvatar } from '@/components/coach/CoachAvatar';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const res = await api.getRoadmap();
        setRoadmap(res);
      } catch (err) {
        console.warn('Roadmap load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  const weeks = [1, 2, 3, 4];
  const currentWeek = roadmap?.current_week || 2;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-4xl overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-3 max-w-xl">
              <SectionLabel number="08" label="Curriculum Flight Plan" />
              <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.02]">
                Adaptive 4-week<br />flight plan.
              </h1>
              <p className="text-xs text-foreground-secondary pt-1 leading-relaxed">
                Dynamic curriculum calibrated to advance candidate readiness from 72 to the 85+ offer benchmark.
              </p>
            </div>

            <Badge variant="mint">Week {currentWeek} Active</Badge>
          </div>

          {/* Coach Intelligence Briefing Card */}
          <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4">
            <CoachAvatar
              mood="encouraging"
              size="md"
              message="You are currently pacing through Week 2. Core CS fundamentals are cleared; prioritize Data Structure patterns and behavioral STAR responses today."
            />
          </div>

          {/* Week Overview Progress Track */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { w: 1, title: 'CS Fundamentals', status: 'Completed', progress: 100 },
              { w: 2, title: 'DSA & Behavioral', status: 'In Progress', progress: 60 },
              { w: 3, title: 'Systems & GDs', status: 'Upcoming', progress: 0 },
              { w: 4, title: 'Company Rehearsal', status: 'Upcoming', progress: 0 }
            ].map(item => {
              const isCurrent = item.w === currentWeek;
              const isDone = item.w < currentWeek;

              return (
                <div
                  key={item.w}
                  className={`p-5 rounded-2xl border transition-all space-y-2 ${
                    isCurrent
                      ? 'bg-surface border-primary'
                      : isDone
                      ? 'bg-surface-muted border-border'
                      : 'bg-surface border-border/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <span className="font-medium text-foreground-secondary">Week {item.w}</span>
                    {isDone ? (
                      <span className="text-foreground font-medium flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    ) : isCurrent ? (
                      <span className="text-foreground font-medium">Active</span>
                    ) : (
                      <span className="text-foreground-muted">Locked</span>
                    )}
                  </div>
                  <div className="font-serif text-sm font-normal text-foreground truncate">
                    {item.title}
                  </div>
                  <ProgressLine
                    value={item.progress}
                    color={isDone ? 'mint' : isCurrent ? 'dark' : 'lavender'}
                  />
                </div>
              );
            })}
          </div>

          {/* 4 Weeks Vertical Timeline */}
          <div className="space-y-8 relative pl-6 before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-border">
            {weeks.map(w => {
              const weekTasks = roadmap?.tasks.filter(t => t.week === w) || [];
              const isCurrentWeek = currentWeek === w;
              const isPastWeek = currentWeek > w;

              const weekThemes: Record<number, { title: string; desc: string }> = {
                1: {
                  title: 'Core Computer Science Fundamentals',
                  desc: 'Operating Systems, Database Management Systems, Computer Networks'
                },
                2: {
                  title: 'Data Structures & Behavioral STAR Alignment',
                  desc: 'Binary Trees, Dynamic Programming, Situational leadership narratives'
                },
                3: {
                  title: 'High-Level System Architecture & Collaborative GDs',
                  desc: 'Scalability, Cache design, Group discussion dynamics'
                },
                4: {
                  title: 'Target Company Simulations & Rehearsals',
                  desc: 'Full-length 45-minute timed technical rounds with proctoring'
                }
              };

              return (
                <div key={w} className="space-y-4 relative">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full border-2 -ml-[1.95rem] bg-background ${
                        isPastWeek
                          ? 'border-primary'
                          : isCurrentWeek
                          ? 'border-primary'
                          : 'border-border'
                      }`}
                    />
                    <div>
                      <h3 className="font-serif text-xl font-normal text-foreground">
                        Week {w}: {weekThemes[w]?.title}
                      </h3>
                      <p className="text-xs text-foreground-secondary">
                        {weekThemes[w]?.desc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-4">
                    {weekTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          task.is_completed
                            ? 'bg-surface-muted border-border'
                            : isCurrentWeek
                            ? 'bg-surface border-border'
                            : 'bg-surface/60 border-border/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                              task.is_completed
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border'
                            }`}
                          >
                            {task.is_completed && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-serif text-base font-normal text-foreground block">
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-foreground-secondary">
                              <span>{task.category}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 20 mins
                              </span>
                              <span>·</span>
                              <span>+{task.xp_reward} XP</span>
                            </div>
                          </div>
                        </div>

                        {!task.is_completed && isCurrentWeek && (
                          <Link
                            href={task.action_link || "/interview?mode=Technical"}
                            className="btn-pill-primary text-xs flex items-center gap-1.5 shrink-0"
                          >
                            <span>Start</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
    </div>
  );
}
