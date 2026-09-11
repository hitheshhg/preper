'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressLine } from '@/components/ui/ProgressLine';
import { FluidShape } from '@/components/visuals/FluidShape';
import { AbstractOrb } from '@/components/visuals/AbstractOrb';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-lavender-soft selection:text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION — Cinematic, Minimal, Enormous Whitespace */}
        <section className="pt-24 sm:pt-36 pb-28 sm:pb-44 px-6 sm:px-12 max-w-[1360px] mx-auto relative">
          <div className="max-w-4xl space-y-8">
            <SectionLabel number="00" label="AI Interview Studio" />

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[5.75rem] font-normal tracking-tight leading-[0.98] text-foreground">
              Practice interviews that actually adapt to you.
            </h1>

            <p className="text-base sm:text-lg text-foreground-secondary max-w-xl font-sans font-normal leading-relaxed pt-2">
              An intelligent, voice-automated placement preparation platform. Dynamic technical probing, ATS resume audits, and boardroom simulations designed for engineering candidates.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/interview">
                <Button variant="primary" size="lg">
                  <span>Start Practicing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  <span>Explore Studio</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Large Abstract Artwork positioned asymmetrically */}
          <div className="hidden md:block absolute right-4 top-20 lg:right-12 lg:top-16 pointer-events-none opacity-90">
            <FluidShape size="hero" />
          </div>
        </section>

        {/* 01 / THE INTERVIEW */}
        <section className="py-28 sm:py-36 px-6 sm:px-12 border-t border-border max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-4 space-y-3">
              <SectionLabel number="01" label="The Interview" />
              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
                No buttons.<br />Just natural conversation.
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-12">
              <p className="text-lg sm:text-xl font-serif text-foreground-secondary leading-relaxed">
                Traditional interview prep relies on static question banks or awkward push-to-talk buttons. Preper uses continuous voice activity detection: the AI interviewer speaks automatically, listens as you articulate your reasoning, and dynamically evaluates trade-offs when you finish.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4 border-t border-border">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground block">
                    Adaptive Voice Loop
                  </span>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    Speaks first, parses your verbal answers seamlessly, and automatically detects natural pauses to formulate follow-up questions.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground block">
                    Continuous Proctoring
                  </span>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    Enforces full-screen focus, window retention, and optical stream continuity to compute an objective readiness trust index.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 / ADAPTIVE PRACTICE */}
        <section className="py-28 sm:py-36 px-6 sm:px-12 border-t border-border max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7 space-y-6">
              <SectionLabel number="02" label="Adaptive Reasoning" />
              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
                Questions that probe where you hesitate.
              </h2>
              <p className="text-base text-foreground-secondary leading-relaxed max-w-xl">
                If your answer is generic, the interviewer digs into concurrency, memory boundaries, or distributed failure scenarios. If your architecture is solid, it shifts to leadership alignment and scale.
              </p>

              <div className="pt-4">
                <Link href="/interview?mode=Technical">
                  <Button variant="secondary" size="md">
                    Launch Technical Simulation
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <AbstractOrb size="lg" active={true} />
            </div>
          </div>
        </section>

        {/* 03 / YOUR PERFORMANCE */}
        <section className="py-28 sm:py-36 px-6 sm:px-12 border-t border-border max-w-[1360px] mx-auto">
          <div className="space-y-16">
            <div className="max-w-2xl space-y-4">
              <SectionLabel number="03" label="Performance Intelligence" />
              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
                Transparent rubrics. Zero guesswork.
              </h2>
              <p className="text-base text-foreground-secondary leading-relaxed">
                Rather than an opaque single score, Preper measures every response across 7 weighted hiring dimensions calibrated against Tier-1 campus placement rubrics.
              </p>
            </div>

            {/* Editorial Metric Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
              <div className="p-8 border border-border bg-surface rounded-2xl space-y-4">
                <span className="text-xs uppercase tracking-[0.12em] text-foreground-secondary">Placement Readiness</span>
                <span className="font-serif text-5xl font-normal text-foreground block">82%</span>
                <ProgressLine value={82} color="lavender" />
                <span className="text-[11px] text-foreground-muted block">Consistently meeting SDE bar</span>
              </div>

              <div className="p-8 border border-border bg-surface rounded-2xl space-y-4">
                <span className="text-xs uppercase tracking-[0.12em] text-foreground-secondary">Technical Depth</span>
                <span className="font-serif text-5xl font-normal text-foreground block">88%</span>
                <ProgressLine value={88} color="dark" />
                <span className="text-[11px] text-foreground-muted block">OS & Distributed systems</span>
              </div>

              <div className="p-8 border border-border bg-surface rounded-2xl space-y-4">
                <span className="text-xs uppercase tracking-[0.12em] text-foreground-secondary">ATS Compatibility</span>
                <span className="font-serif text-5xl font-normal text-foreground block">84%</span>
                <ProgressLine value={84} color="mint" />
                <span className="text-[11px] text-foreground-muted block">Zero unindexed tables</span>
              </div>

              <div className="p-8 border border-border bg-surface rounded-2xl space-y-4">
                <span className="text-xs uppercase tracking-[0.12em] text-foreground-secondary">Boardroom Cadence</span>
                <span className="font-serif text-5xl font-normal text-foreground block">76%</span>
                <ProgressLine value={76} color="pink" />
                <span className="text-[11px] text-foreground-muted block">High interruption resilience</span>
              </div>
            </div>
          </div>
        </section>

        {/* 04 / SKILL DEVELOPMENT */}
        <section className="py-28 sm:py-36 px-6 sm:px-12 border-t border-border max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 space-y-4">
              <SectionLabel number="04" label="Skill Development" />
              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
                Targeted practice. Faster trajectory.
              </h2>
              <p className="text-base text-foreground-secondary leading-relaxed">
                Preper maps your weak concepts directly into high-yield daily practice drills. Fix metric-poor resume bullets, rehearse tricky system design questions, and master group discussion timing in one unified studio.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4 pt-2">
              <div className="py-4 border-b border-border flex items-center justify-between">
                <span className="font-serif text-lg">System Design & Cache Eviction</span>
                <span className="text-xs uppercase tracking-wider text-foreground-secondary">Ready</span>
              </div>
              <div className="py-4 border-b border-border flex items-center justify-between">
                <span className="font-serif text-lg">Process vs Thread Concurrency</span>
                <span className="text-xs uppercase tracking-wider text-foreground-secondary">Mastered</span>
              </div>
              <div className="py-4 border-b border-border flex items-center justify-between">
                <span className="font-serif text-lg">STAR Behavioral Project Defense</span>
                <span className="text-xs uppercase tracking-wider text-foreground-secondary">In Practice</span>
              </div>
              <div className="py-4 border-b border-border flex items-center justify-between">
                <span className="font-serif text-lg">Database Indexing & Sharding</span>
                <span className="text-xs uppercase tracking-wider text-lavender font-medium">Priority Drill</span>
              </div>
            </div>
          </div>
        </section>

        {/* 05 / FINAL CTA */}
        <section className="py-32 sm:py-48 px-6 sm:px-12 border-t border-border bg-surface transition-colors">
          <div className="max-w-[1360px] mx-auto text-center space-y-8">
            <SectionLabel number="05" label="Enter The Studio" />
            <h2 className="font-serif text-5xl sm:text-7xl font-normal tracking-tight text-foreground max-w-3xl mx-auto leading-[1.02]">
              Prepare differently. Interview with confidence.
            </h2>
            <p className="text-base sm:text-lg text-foreground-secondary max-w-lg mx-auto">
              Join candidates from top engineering institutions practicing on the next generation of AI interview intelligence.
            </p>
            <div className="pt-4">
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  <span>Enter Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
