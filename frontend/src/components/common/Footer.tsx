'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background transition-colors py-20 px-6 sm:px-12 mt-auto">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
        {/* Left: Large Brand Typography */}
        <div className="space-y-4">
          <span className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-[0.16em] font-normal text-foreground uppercase block select-none">
            PREPER
          </span>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground-secondary">
            Prepare Differently · Intelligent Interview Studio
          </p>
        </div>

        {/* Right: Minimal Editorial Links & Copyright */}
        <div className="space-y-6 md:text-right">
          <nav className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-xs uppercase tracking-[0.14em] text-foreground-secondary">
            <Link href="/interview" className="hover:text-foreground transition-colors">
              Interviews
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Studio
            </Link>
            <Link href="/resume" className="hover:text-foreground transition-colors">
              Resume Intelligence
            </Link>
            <Link href="/gd" className="hover:text-foreground transition-colors">
              Roundtable
            </Link>
            <Link href="/questions" className="hover:text-foreground transition-colors">
              Archive
            </Link>
          </nav>

          <div className="text-[11px] uppercase tracking-[0.12em] text-foreground-muted flex flex-wrap md:justify-end gap-6 pt-2">
            <span>© 2026 PREPER INC.</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
