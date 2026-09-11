'use client';

import React from 'react';
import Link from 'next/link';
import { WeakArea } from '@/types';
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { Card3D } from '@/components/common/Card3D';

interface WeakAreaAlertProps {
  weakAreas: WeakArea[];
  onActionClick?: (link: string) => void;
}

export const WeakAreaAlert: React.FC<WeakAreaAlertProps> = ({ weakAreas, onActionClick }) => {
  const getBadge = (status: string) => {
    switch (status) {
      case 'Needs Work':
        return {
          icon: AlertCircle,
          label: 'Priority Focus',
          glow: 'rose',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
        };
      case 'Improving':
        return {
          icon: TrendingUp,
          label: 'Progressing',
          glow: 'gold',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
        };
      case 'Strong':
      default:
        return {
          icon: CheckCircle2,
          label: 'Benchmark Met',
          glow: 'emerald',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        };
    }
  };

  return (
    <div className="space-y-3">
      {weakAreas.map((area, idx) => {
        const badge = getBadge(area.status);
        const Icon = badge.icon;

        return (
          <Card3D key={idx} glowColor={badge.glow as any} intensity={5}>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 border ${badge.color} shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {area.category}
                    </h4>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badge.color}`}>
                      {badge.label} · {area.current_score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {area.recommended_action}
                  </p>
                </div>
              </div>

              {onActionClick ? (
                <button
                  type="button"
                  onClick={() => onActionClick(area.action_link)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-slate-800/90 dark:hover:bg-emerald-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 font-black text-xs shrink-0 transition-all cursor-pointer shadow-xs"
                >
                  <span>Launch Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href={area.action_link}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-slate-800/90 dark:hover:bg-emerald-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 font-black text-xs shrink-0 transition-all cursor-pointer shadow-xs"
                >
                  <span>Launch Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </Card3D>
        );
      })}
    </div>
  );
};
