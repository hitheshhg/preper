'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-7 w-[88px] rounded-full border border-border bg-surface-muted/50 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const options: Array<{ id: 'light' | 'system' | 'dark'; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'dark', label: 'Dark', icon: Moon }
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className={`inline-flex items-center p-0.5 rounded-full border border-border bg-surface text-foreground-secondary ${className}`}
    >
      {options.map(opt => {
        const Icon = opt.icon;
        const isSelected = theme === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${opt.label} mode`}
            onClick={() => setTheme(opt.id)}
            className={`relative flex items-center justify-center w-7 h-6 rounded-full text-xs transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-foreground ${
              isSelected
                ? 'bg-primary text-primary-foreground font-medium shadow-2xs'
                : 'text-foreground-muted hover:text-foreground'
            }`}
            title={`${opt.label} mode`}
          >
            <Icon className="w-3 h-3" />
          </button>
        );
      })}
    </div>
  );
}
