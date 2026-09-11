'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Service Unavailable',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-8 sm:p-10 rounded-2xl border border-pink/30 bg-pink-soft/15 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-6">
      <div className="w-10 h-10 rounded-full border border-pink/40 flex items-center justify-center text-pink">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-normal text-foreground">{title}</h3>
        <p className="text-xs text-foreground-secondary leading-relaxed max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RotateCcw className="w-3 h-3 mr-1.5" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </div>
  );
}
