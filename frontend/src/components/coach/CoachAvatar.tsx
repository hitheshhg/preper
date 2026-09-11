'use client';

import React from 'react';
import { Sparkles, Brain, Compass, AlertCircle, CheckCircle2, Bot, Zap, Activity } from 'lucide-react';

export type CoachMood = 'happy' | 'excited' | 'encouraging' | 'thinking' | 'concerned' | 'celebrating' | 'explaining';

interface CoachAvatarProps {
  mood?: CoachMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  animate?: boolean;
  className?: string;
  badgeLabel?: string;
}

export const CoachAvatar: React.FC<CoachAvatarProps> = ({
  mood = 'happy',
  size = 'md',
  message,
  animate = true,
  className = '',
  badgeLabel
}) => {
  const sizeConfig = {
    sm: {
      container: 'w-8 h-8',
      orbSize: 32,
      icon: 'w-3.5 h-3.5',
      ring: 'w-10 h-10 -inset-1',
      ring2: 'w-12 h-12 -inset-2'
    },
    md: {
      container: 'w-12 h-12',
      orbSize: 48,
      icon: 'w-5 h-5',
      ring: 'w-16 h-16 -inset-2',
      ring2: 'w-20 h-20 -inset-4'
    },
    lg: {
      container: 'w-16 h-16',
      orbSize: 64,
      icon: 'w-7 h-7',
      ring: 'w-22 h-22 -inset-3',
      ring2: 'w-28 h-28 -inset-6'
    },
    xl: {
      container: 'w-24 h-24',
      orbSize: 96,
      icon: 'w-10 h-10',
      ring: 'w-32 h-32 -inset-4',
      ring2: 'w-40 h-40 -inset-8'
    }
  };

  const getMoodConfig = () => {
    switch (mood) {
      case 'thinking':
        return {
          icon: Brain,
          label: badgeLabel || 'Analyzing Patterns',
          color: '#818cf8',
          glow: 'shadow-[0_0_30px_rgba(99,102,241,0.5)]',
          border: 'border-indigo-500/50',
          ringBorder: 'border-indigo-400/40',
          bg: 'from-indigo-600/30 via-slate-900 to-indigo-950/80',
          textClass: 'text-indigo-400'
        };
      case 'concerned':
        return {
          icon: AlertCircle,
          label: badgeLabel || 'Priority Calibration',
          color: '#f43f5e',
          glow: 'shadow-[0_0_30px_rgba(244,63,94,0.5)]',
          border: 'border-rose-500/50',
          ringBorder: 'border-rose-400/40',
          bg: 'from-rose-600/30 via-slate-900 to-rose-950/80',
          textClass: 'text-rose-400'
        };
      case 'celebrating':
      case 'excited':
        return {
          icon: Zap,
          label: badgeLabel || 'Readiness Surge',
          color: '#f59e0b',
          glow: 'shadow-[0_0_35px_rgba(245,158,11,0.6)]',
          border: 'border-amber-500/50',
          ringBorder: 'border-amber-400/40',
          bg: 'from-amber-600/30 via-slate-900 to-amber-950/80',
          textClass: 'text-amber-400'
        };
      case 'explaining':
        return {
          icon: Compass,
          label: badgeLabel || 'Interview Insight',
          color: '#00e5ff',
          glow: 'shadow-[0_0_30px_rgba(0,229,255,0.5)]',
          border: 'border-cyan-500/50',
          ringBorder: 'border-cyan-400/40',
          bg: 'from-cyan-600/30 via-slate-900 to-cyan-950/80',
          textClass: 'text-cyan-400'
        };
      case 'encouraging':
      case 'happy':
      default:
        return {
          icon: Sparkles,
          label: badgeLabel || 'Career Intelligence Active',
          color: '#00f59b',
          glow: 'shadow-[0_0_35px_rgba(0,245,155,0.5)]',
          border: 'border-emerald-500/50',
          ringBorder: 'border-emerald-400/40',
          bg: 'from-emerald-500/30 via-slate-900 to-emerald-950/80',
          textClass: 'text-emerald-400'
        };
    }
  };

  const cfg = getMoodConfig();
  const IconComponent = cfg.icon;
  const sz = sizeConfig[size];

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* 3D Holographic Gyroscopic Orb */}
      <div className="relative shrink-0 flex items-center justify-center perspective-1000">
        {/* Outer 3D Gyro Orbital Ring 1 */}
        <div
          className={`absolute rounded-full border border-dashed ${cfg.ringBorder} pointer-events-none transition-all duration-300 ${
            animate ? 'animate-orbit-x' : ''
          }`}
          style={{
            width: sz.orbSize * 1.5,
            height: sz.orbSize * 1.5
          }}
        />

        {/* Outer 3D Gyro Orbital Ring 2 */}
        <div
          className={`absolute rounded-full border border-dotted ${cfg.ringBorder} pointer-events-none transition-all duration-300 ${
            animate ? 'animate-orbit-y' : ''
          }`}
          style={{
            width: sz.orbSize * 1.75,
            height: sz.orbSize * 1.75
          }}
        />

        {/* Core 3D Cyber Orb */}
        <div
          className={`relative ${sz.container} rounded-2xl bg-gradient-to-br ${cfg.bg} border ${cfg.border} ${cfg.glow} flex items-center justify-center overflow-hidden transition-all duration-200 ${
            animate ? 'hover:scale-110 active:scale-95' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'perspective(600px) rotateX(8deg)'
          }}
        >
          {/* Specular Inner Glare */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

          {/* Central Hologram Icon */}
          <div className="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
            <IconComponent className={`${sz.icon} ${cfg.textClass}`} />
          </div>

          {/* Ambient Cyber Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent shimmer-layer pointer-events-none" />
        </div>

        {/* Real-time Status Pulse Beacon */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_#00f59b] animate-pulse" />
      </div>

      {/* 3D Glassmorphic Message Capsule */}
      {message && (
        <div className="relative glass-panel rounded-2xl p-4 shadow-xl max-w-md text-xs border border-white/10 preserve-3d">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-white/10">
            <span className="font-extrabold text-[11px] text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Coach Questy 3D</span>
              <span className="text-[10px] font-medium text-slate-400">· Neural Mentor</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {cfg.label}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};
