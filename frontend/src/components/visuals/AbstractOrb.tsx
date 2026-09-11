'use client';

import React from 'react';

interface AbstractOrbProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export function AbstractOrb({
  className = '',
  size = 'md',
  active = false
}: AbstractOrbProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-72 h-72'
  };

  return (
    <div
      className={`relative select-none pointer-events-none flex items-center justify-center ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {/* Outer ambient diffused blur */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ${
          active ? 'blur-2xl scale-110 opacity-90' : 'blur-xl opacity-60'
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--visual-orb-glow1) 0%, var(--visual-orb-glow2) 100%)'
        }}
      />

      {/* Core orb body with Day/Night surface adaptation */}
      <div
        className={`relative w-4/5 h-4/5 rounded-full border border-border/40 shadow-xs backdrop-blur-md overflow-hidden transition-all duration-700 ${
          active ? 'animate-breathe' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--visual-orb-core) 0%, var(--lavender-soft) 60%, var(--pink-soft) 100%)'
        }}
      >
        {/* Soft specular reflection line */}
        <div className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-white/20 dark:bg-white/10 blur-md pointer-events-none" />

        {/* Minimal concentric hairline ring */}
        <div className="absolute inset-2.5 rounded-full border border-border/40" />
      </div>
    </div>
  );
}

// Alias for explicit interview rooms
export const InterviewOrb = AbstractOrb;
