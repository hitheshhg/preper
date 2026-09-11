'use client';

import React from 'react';

interface SkillWaveProps {
  className?: string;
  intensity?: number;
}

export function SkillWave({ className = '' }: SkillWaveProps) {
  return (
    <div className={`relative w-full h-16 overflow-hidden select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 800 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full preserve-3d"
      >
        <path
          d="M0 50 C150 20, 250 80, 400 45 C550 10, 650 75, 800 40"
          stroke="var(--lavender)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <path
          d="M0 55 C120 70, 280 25, 420 60 C560 95, 680 30, 800 55"
          stroke="var(--pink)"
          strokeWidth="1"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />
        <path
          d="M0 45 C180 35, 300 65, 450 35 C600 5, 700 60, 800 45"
          stroke="var(--mint)"
          strokeWidth="1"
          strokeOpacity="0.60"
          strokeDasharray="3 6"
        />
      </svg>
    </div>
  );
}

export function ThinkingField({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`} aria-label="AI reasoning in progress">
      <div className="w-2 h-2 rounded-full bg-lavender animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-pink animate-pulse [animation-delay:200ms]" />
      <div className="w-2 h-2 rounded-full bg-mint animate-pulse [animation-delay:400ms]" />
    </div>
  );
}
