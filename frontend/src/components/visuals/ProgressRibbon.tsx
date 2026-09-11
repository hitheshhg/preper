'use client';

import React from 'react';

interface ProgressRibbonProps {
  progress: number; // 0 to 100
  label?: string;
  metric?: string;
  className?: string;
  color?: 'primary' | 'lavender' | 'pink' | 'mint' | 'blue';
}

export function ProgressRibbon({
  progress,
  label,
  metric,
  className = '',
  color = 'primary'
}: ProgressRibbonProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  const colorStyles = {
    primary: 'bg-primary',
    lavender: 'bg-lavender',
    pink: 'bg-pink',
    mint: 'bg-mint',
    blue: 'bg-blue'
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || metric) && (
        <div className="flex items-center justify-between text-xs font-sans">
          {label && <span className="text-foreground-secondary uppercase tracking-wider text-[10px]">{label}</span>}
          {metric && <span className="font-serif text-foreground text-xs font-medium">{metric}</span>}
        </div>
      )}
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full ${colorStyles[color]} transition-all duration-500 rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
