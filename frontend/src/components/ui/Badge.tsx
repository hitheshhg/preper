'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'lavender' | 'pink' | 'mint' | 'blue';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  className = ''
}: BadgeProps) {
  const variantStyles = {
    neutral: 'bg-surface-muted text-foreground-secondary border border-border',
    lavender: 'bg-lavender-soft/40 text-lavender-text border border-lavender/50 dark:border-lavender/30 dark:bg-lavender-soft/20',
    pink: 'bg-pink-soft/40 text-pink-text border border-pink/50 dark:border-pink/30 dark:bg-pink-soft/20',
    mint: 'bg-mint-soft/40 text-mint-text border border-mint/50 dark:border-mint/30 dark:bg-mint-soft/20',
    blue: 'bg-blue-soft/40 text-blue-text border border-blue/50 dark:border-blue/30 dark:bg-blue-soft/20'
  };

  return (
    <span
      className={`inline-flex items-center text-[10px] font-sans uppercase tracking-[0.12em] font-semibold px-2.5 py-0.5 rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
