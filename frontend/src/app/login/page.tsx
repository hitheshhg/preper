'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (!res.success) {
        setError(res.error || 'Authentication failed');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-lavender selection:text-foreground transition-colors duration-200">
      {/* Minimal Header */}
      <header className="border-b border-border py-4 px-6 sm:px-12">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-[0.22em] font-normal text-foreground uppercase">
            PREPR
          </Link>
          <Link
            href="/register"
            className="text-xs uppercase tracking-[0.14em] font-sans text-foreground-secondary hover:text-foreground transition-colors"
          >
            Create Account →
          </Link>
        </div>
      </header>

      {/* Main Login Form Viewport */}
      <main className="flex-1 max-w-md mx-auto w-full px-6 py-12 flex flex-col justify-center">
        <div className="space-y-8">
          <div className="space-y-3">
            <SectionLabel number="00" label="Authentication" />
            <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
              Welcome back.
            </h1>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              Sign in to your private interview studio and access your placement telemetry.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-pink/40 bg-pink-soft/15 text-pink text-xs font-medium flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-foreground-secondary mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@university.edu"
                className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-xs font-medium text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] uppercase tracking-wider text-foreground-secondary font-medium">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border bg-surface rounded-xl text-xs font-medium text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="pt-2">
              <Button variant="primary" size="lg" disabled={loading} className="w-full">
                <span>{loading ? 'Authenticating...' : 'Sign In to Studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </form>

          <div className="pt-6 border-t border-border text-center">
            <p className="text-xs text-foreground-muted">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-foreground underline underline-offset-4 hover:opacity-80">
                Register for Prepr
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border py-4 px-6 sm:px-12 text-center text-[10px] text-foreground-muted uppercase tracking-wider font-mono">
        Prepr · Intelligent Placement System
      </footer>
    </div>
  );
}
