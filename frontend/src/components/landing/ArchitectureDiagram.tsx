'use client';

import React from 'react';

export function ArchitectureDiagram() {
  const architecturalTiers = [
    {
      step: '01',
      title: 'Candidate Client Layer',
      tech: 'Next.js 16 App Router · Web Audio VAD · Web Speech API · Canvas Telemetry',
      description: 'Continuous optical proctoring, micro-silence pause detection (1.8s cutoff), and zero-latency audio buffering directly in the candidate browser.',
      metrics: '318ms Audio Latency',
    },
    {
      step: '02',
      title: 'AI Processing & Orchestration Engine',
      tech: 'FastAPI Python Engine · Centralized Gemini 2.5 Flash · Pydantic Validation',
      description: 'Dynamic prompt synthesis enforcing the STAR rubric. Escalates depth when answers are comprehensive; formulates guiding follow-ups if reasoning is incomplete.',
      metrics: 'Structured JSON Schemas',
    },
    {
      step: '03',
      title: 'Multi-Agent Simulation & ATS Analysis',
      tech: '7-Persona Turn-Taking State Machine · Regex Lexical Vector Extractor',
      description: 'Autonomous multi-persona group discussion consensus loop and deep PDF/DOCX resume text analysis with unquantified metric detection.',
      metrics: '7 Autonomous Personas',
    },
    {
      step: '04',
      title: 'Persistence & Placement Readiness',
      tech: 'Supabase PostgreSQL Cloud · 18 Normalized RLS Tables · Dev-Store Memory Mirror',
      description: 'Transparent 7-dimensional weighted calculation (OS, DSA, STAR, ATS) with historical telemetry snapshots and row-level security isolation.',
      metrics: '18 Normalized Tables',
    },
  ];

  const benchmarks = [
    { label: 'Voice Ingestion to LLM Turnaround', value: '318 ms', target: '< 450 ms' },
    { label: 'ATS Text & Keyword Extraction Time', value: '184 ms', target: '< 250 ms' },
    { label: 'Multi-Persona Round-Table Turn Time', value: '440 ms', target: '< 600 ms' },
    { label: 'Database Telemetry Query (p95)', value: '14 ms', target: '< 25 ms' },
  ];

  return (
    <div className="space-y-12">
      {/* 4-Tier Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {architecturalTiers.map((tier, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-4 relative group hover:border-foreground/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-lavender-text font-semibold">{tier.step}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-foreground-muted">
                  {tier.metrics}
                </span>
              </div>
              <h4 className="font-serif text-lg font-normal text-foreground leading-snug">
                {tier.title}
              </h4>
              <p className="text-[11px] font-mono text-foreground-secondary/90 leading-tight">
                {tier.tech}
              </p>
              <p className="text-xs text-foreground-secondary leading-relaxed pt-1">
                {tier.description}
              </p>
            </div>

            {idx < 3 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <span className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center font-mono text-[10px] text-foreground-muted">
                  →
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Latency & Engineering Benchmark Strip */}
      <div className="p-6 rounded-2xl border border-border bg-background space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-xs font-mono uppercase tracking-[0.14em] font-semibold text-foreground">
            System Performance & Latency Telemetry
          </span>
          <span className="text-[10px] font-mono text-mint-text flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            Empirical Test Data
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {benchmarks.map((bench, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-foreground-muted block truncate">
                {bench.label}
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-normal text-foreground block">
                {bench.value}
              </span>
              <span className="text-[10px] font-mono text-foreground-secondary">
                Target: {bench.target}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
