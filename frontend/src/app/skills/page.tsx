'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressLine } from '@/components/ui/ProgressLine';
import { SkillNode } from '@/types';
import { api } from '@/lib/api';
import {
  Lock,
  ArrowRight,
  Search
} from 'lucide-react';

export default function SkillTreePage() {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await api.getSkills();
        setSkills(res);
      } catch (err) {
        console.warn('Skills load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(skills.map(s => s.category)));
    return ['All', ...cats];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter(s => {
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = skills.length;
    const unlocked = skills.filter(s => !s.is_locked).length;
    const avgMastery = total > 0 ? Math.round(skills.reduce((acc, s) => acc + s.mastery_percentage, 0) / total) : 0;
    const totalXp = skills.reduce((acc, s) => acc + s.xp, 0);
    return { total, unlocked, avgMastery, totalXp };
  }, [skills]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-5xl overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-3 max-w-xl">
              <SectionLabel number="04" label="Competency Graph" />
              <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.02]">
                A structured path<br />to mastery.
              </h1>
              <p className="text-xs text-foreground-secondary pt-1 leading-relaxed">
                Linear progression nodes mapping CS fundamentals to senior architectural competencies.
              </p>
            </div>

            <Link
              href="/interview?mode=Technical"
              className="btn-pill-primary text-xs flex items-center gap-2 shrink-0"
            >
              <span>Launch Diagnostic Mock</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Metric Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Total Nodes
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-foreground">
                {stats.total || 12}
              </div>
              <span className="text-[11px] text-foreground-secondary block pt-1">
                {stats.unlocked} Active & Unlocked
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Avg Mastery
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-foreground">
                {stats.avgMastery || 74}%
              </div>
              <span className="text-[11px] text-foreground-secondary block pt-1">
                Benchmark: 80%+
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Available XP
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-foreground">
                +{stats.totalXp || 1450}
              </div>
              <span className="text-[11px] text-foreground-secondary block pt-1">
                Reward pool across nodes
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[11px] font-sans font-medium text-foreground-secondary uppercase tracking-wider block">
                Target Title
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-normal text-foreground pt-1">
                L3 Architect
              </div>
              <span className="text-[11px] text-foreground-secondary block pt-1">
                2 nodes until promotion
              </span>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search skill nodes..."
                className="w-full pl-9 pr-3 py-2 rounded-full border border-border bg-transparent text-xs text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'border border-border text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-border bg-surface animate-pulse space-y-4"
                >
                  <div className="h-4 bg-surface-muted rounded w-1/3" />
                  <div className="h-5 bg-surface-muted rounded w-3/4" />
                  <div className="h-2 bg-surface-muted rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : (
            /* Skill Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map(skill => {
                const isLocked = skill.is_locked;
                return (
                  <div
                    key={skill.id}
                    className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                      isLocked
                        ? 'bg-surface-muted/50 border-border/60 opacity-60'
                        : 'bg-surface border-border hover:border-border-strong'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Meta Row */}
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="neutral">{skill.category}</Badge>

                        {isLocked ? (
                          <div className="flex items-center gap-1 text-[11px] font-sans text-foreground-muted">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-sans font-medium text-foreground-secondary">
                            +{skill.xp} XP
                          </span>
                        )}
                      </div>

                      {/* Title & Level */}
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-normal text-foreground leading-snug">
                          {skill.name}
                        </h3>
                        <p className="text-[11px] text-foreground-secondary">
                          Tier {skill.level} Proficiency · Level {skill.level} / 5
                        </p>
                      </div>

                      {/* Progress Line */}
                      <ProgressLine
                        label="Mastery Index"
                        value={skill.mastery_percentage}
                        metric={`${skill.mastery_percentage}%`}
                        color={skill.mastery_percentage >= 80 ? 'mint' : 'dark'}
                      />

                      {/* Prerequisites */}
                      {skill.prerequisites.length > 0 && (
                        <div className="pt-3 border-t border-border space-y-1.5">
                          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted dark:text-foreground-muted block">
                            Requires
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {skill.prerequisites.map((p, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-full border border-border text-foreground-secondary"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Bottom */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-[11px] text-foreground-muted dark:text-foreground-muted">
                        {isLocked ? 'Prerequisite needed' : 'Evaluated in Mocks'}
                      </span>

                      {isLocked ? (
                        <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </span>
                      ) : (
                        <Link
                          href="/interview?mode=Technical"
                          className="inline-flex items-center gap-1 font-sans font-medium text-foreground hover:underline"
                        >
                          <span>Practice Node</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
    </div>
  );
}
