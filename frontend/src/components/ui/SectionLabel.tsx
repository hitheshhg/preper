'use client';

import React from 'react';

interface SectionLabelProps {
  number?: string;
  label: string;
  className?: string;
}

export function SectionLabel({
  number,
  label,
  className = ''
}: SectionLabelProps) {
  return (
    <div className={`inline-flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-foreground-secondary ${className}`}>
      {number && <span className="text-foreground-muted">{number} —</span>}
      <span>{label}</span>
    </div>
  );
}
