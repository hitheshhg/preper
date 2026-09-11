'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="p-10 sm:p-14 rounded-2xl border border-dashed border-border bg-surface text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground-muted">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-xl font-normal text-foreground">{title}</h3>
        <p className="text-xs text-foreground-secondary leading-relaxed max-w-sm">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <div className="pt-2">
          <Link href={actionHref}>
            <Button variant="primary" size="sm">
              <span>{actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
