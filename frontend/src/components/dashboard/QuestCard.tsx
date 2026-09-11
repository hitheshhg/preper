'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QuestItem } from '@/types';
import { CheckCircle2, Clock, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { triggerConfetti } from '@/lib/confetti';
import { api } from '@/lib/api';
import { Card3D } from '@/components/common/Card3D';

interface QuestCardProps {
  quest: QuestItem;
  onClaim?: (questId: string, xp: number) => void;
  onQuickLaunch?: (quest: QuestItem) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim, onQuickLaunch }) => {
  const [completed, setCompleted] = useState(quest.is_completed);
  const [claiming, setClaiming] = useState(false);

  const getActionLink = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hr':
        return '/interview?mode=HR';
      case 'technical':
        return '/interview?mode=Technical';
      case 'resume':
        return '/resume';
      case 'gd':
        return '/gd';
      default:
        return '/dashboard';
    }
  };

  const handleClaim = async () => {
    if (completed || claiming) return;
    setClaiming(true);
    try {
      await api.claimQuest(quest.id);
      triggerConfetti();
      setCompleted(true);
      if (onClaim) onClaim(quest.id, quest.xp_reward);
    } catch (e) {
      triggerConfetti();
      setCompleted(true);
      if (onClaim) onClaim(quest.id, quest.xp_reward);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Card3D glowColor={completed ? 'none' : 'emerald'} intensity={6} className="w-full">
      <div className={`p-4 sm:p-5 space-y-3 transition-opacity ${completed ? 'opacity-70' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {quest.category}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> {quest.estimated_minutes} min
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
              {quest.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {quest.description}
            </p>
          </div>

          {/* 3D Cyber XP Pill */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-black text-xs shrink-0 shadow-[0_0_12px_rgba(0,245,155,0.2)]">
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>+{quest.xp_reward} XP</span>
          </div>
        </div>

        {/* Progress Bar & Actions */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-medium">
            Progress: <strong className="text-slate-900 dark:text-white font-mono">{completed ? quest.target : quest.progress}/{quest.target}</strong>
          </span>

          {completed ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
          ) : quest.progress >= quest.target ? (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              {claiming ? 'Claiming...' : 'Claim XP Reward'}
            </button>
          ) : onQuickLaunch ? (
            <button
              onClick={() => onQuickLaunch(quest)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <span>Launch Studio Task</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
            </button>
          ) : (
            <Link
              href={getActionLink(quest.category)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white hover:text-emerald-400 transition-colors"
            >
              <span>Launch Task</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
            </Link>
          )}
        </div>
      </div>
    </Card3D>
  );
};
