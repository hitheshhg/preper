'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 animate-pulse">
      <div className="h-4 bg-surface-muted rounded w-1/3" />
      <div className="h-8 bg-surface-muted rounded w-2/3" />
      <div className="h-3 bg-surface-muted rounded w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-surface-muted rounded-xl w-full" />
      ))}
    </div>
  );
}
