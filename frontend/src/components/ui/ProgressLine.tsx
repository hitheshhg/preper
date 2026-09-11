'use client';

import React from 'react';

interface ProgressLineProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  metric?: string | number;
  color?: 'dark' | 'lavender' | 'pink' | 'mint' | 'blue';
  className?: string;
}

export function ProgressLine({
  value,
  max = 100,
  label,
  metric,
  color = 'dark',
  className = ''
}: ProgressLineProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    dark: 'bg-primary',
    lavender: 'bg-lavender',
    pink: 'bg-pink',
    mint: 'bg-mint',
    blue: 'bg-blue'
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || metric !== undefined) && (
        <div className="flex items-center justify-between text-xs font-sans">
          {label && <span className="text-foreground-secondary uppercase tracking-wider text-[11px]">{label}</span>}
          {metric !== undefined && (
            <span className="font-serif font-bold text-foreground text-sm">
              {metric}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-[3px] bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
