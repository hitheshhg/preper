'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { api } from '@/lib/api';
import {
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { CoachAvatar } from '@/components/coach/CoachAvatar';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCompanies();
        setCompanies(res);
        if (res.length > 0) setSelectedCompany(res[0]);
      } catch (err) {
        console.warn('Companies error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-5xl overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-3 max-w-xl">
              <SectionLabel number="07" label="Recruitment Blueprints" />
              <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.02]">
                Target company<br />interview blueprints.
              </h1>
              <p className="text-xs text-foreground-secondary pt-1 leading-relaxed">
                Company-specific hiring rounds, evaluation rubrics, and calibrated mock interview simulations.
              </p>
            </div>

            <Badge variant="mint">Tier-1 / FAANG / Fintech</Badge>
          </div>

          {/* Company Selection Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {companies.map(c => {
              const isSelected = selectedCompany?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompany(c)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-4 shrink-0 w-64 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface border-border text-foreground hover:border-border-strong'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl shrink-0 font-serif ${
                    isSelected
                      ? 'border-white/20 bg-white/10'
                      : 'border-border bg-surface-muted'
                  }`}>
                    {c.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-base font-normal truncate">
                      {c.name}
                    </div>
                    <div className={`flex items-center gap-2 text-[11px] font-sans mt-0.5 ${
                      isSelected ? 'text-white/70 dark:text-black/70' : 'text-foreground-secondary'
                    }`}>
                      <span>{c.tier}</span>
                      <span>·</span>
                      <span>{c.difficulty}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Company Deep Dive */}
          {selectedCompany && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Hiring Rounds & Focus */}
              <div className="lg:col-span-8 space-y-6">
                {/* Rounds Card */}
                <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-normal text-foreground">
                        {selectedCompany.name} Pipeline
                      </h3>
                      <p className="text-xs text-foreground-secondary">Sequential evaluation stages and elimination rounds</p>
                    </div>
                    <Badge variant="neutral">Difficulty: {selectedCompany.difficulty}</Badge>
                  </div>

                  <div className="space-y-3">
                    {selectedCompany.rounds.map((round: string, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-border bg-surface-muted flex items-center gap-4"
                      >
                        <span className="w-7 h-7 rounded-full border border-border font-serif text-xs font-normal flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-sans font-medium text-foreground">
                            {round}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interview Evaluation Style */}
                <div className="p-8 rounded-2xl bg-surface border border-border space-y-3">
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    Evaluation Philosophy & Interview Culture
                  </h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {selectedCompany.interview_style}
                  </p>
                </div>
              </div>

              {/* Right Column: Skills Checklist & Mock Action */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                  <div>
                    <h4 className="font-serif text-lg font-normal text-foreground">Core Pillars</h4>
                    <p className="text-xs text-foreground-secondary">Must-clear competencies</p>
                  </div>

                  <div className="space-y-2">
                    {selectedCompany.primary_skills.map((skill: string) => (
                      <div key={skill} className="flex items-center gap-2 text-xs font-sans text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="text-[11px] text-foreground-secondary">
                      Estimated candidate readiness for {selectedCompany.name}:
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-3xl font-normal text-foreground">74%</span>
                      <Badge variant="mint">Competitive</Badge>
                    </div>

                    <Link
                      href={selectedCompany.recommended_mock}
                      className="btn-pill-primary w-full text-xs flex items-center justify-center gap-2 py-3"
                    >
                      <span>Launch {selectedCompany.name} Mock</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Coach Tactical Tip */}
                <div className="p-5 rounded-2xl bg-surface border border-border flex items-start gap-3">
                  <CoachAvatar mood="explaining" size="sm" animate={false} />
                  <p className="text-xs text-foreground-secondary font-normal leading-relaxed">
                    "When interviewing with {selectedCompany.name}, articulate trade-offs between memory and CPU latency before committing to a final algorithm."
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}
