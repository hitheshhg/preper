'use client';

import React from 'react';

interface FluidShapeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export function FluidShape({
  className = '',
  size = 'md'
}: FluidShapeProps) {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-80 h-80',
    lg: 'w-[480px] h-[480px]',
    hero: 'w-[640px] h-[640px]'
  };

  return (
    <div
      className={`relative select-none pointer-events-none ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full animate-breathe"
      >
        <defs>
          <linearGradient id="fluidGrad1" x1="120" y1="80" x2="480" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--visual-bg-start)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--visual-bg-mid)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--visual-bg-end)" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="fluidGrad2" x1="450" y1="120" x2="150" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--lavender)" stopOpacity="0.38" />
            <stop offset="70%" stopColor="var(--blue)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--pink)" stopOpacity="0.25" />
          </linearGradient>

          <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="35" result="blur" />
          </filter>
        </defs>

        {/* Outer diffused halo */}
        <path
          d="M440 220C480 300 450 420 370 470C290 520 180 490 130 410C80 330 110 200 190 140C270 80 400 140 440 220Z"
          fill="url(#fluidGrad2)"
          filter="url(#softBlur)"
        />

        {/* Primary organic contour */}
        <path
          d="M420 240C465 310 430 410 360 450C290 490 190 460 145 390C100 320 130 210 200 160C270 110 375 170 420 240Z"
          fill="url(#fluidGrad1)"
        />

        {/* Delicate interior ribbon line */}
        <path
          d="M170 380C220 420 320 410 390 320C440 250 410 180 350 150"
          stroke="var(--visual-ribbon)"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeDasharray="4 8"
        />
      </svg>
    </div>
  );
}
