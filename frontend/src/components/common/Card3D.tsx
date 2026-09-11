'use client';

import React, { useRef, useState, useCallback } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'cyan' | 'indigo' | 'purple' | 'gold' | 'none';
  intensity?: number; // tilt sensitivity
  onClick?: () => void;
}

export function Card3D({
  children,
  className = '',
  glowColor = 'emerald',
  intensity = 12,
  onClick
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-intensity to +intensity)
      const rotX = ((y - centerY) / centerY) * -intensity;
      const rotY = ((x - centerX) / centerX) * intensity;

      setRotateX(rotX);
      setRotateY(rotY);

      // Specular glare position in percentage
      setGlarePos({
        x: Math.round((x / rect.width) * 100),
        y: Math.round((y / rect.height) * 100)
      });
    },
    [intensity]
  );

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const glowStyles = {
    emerald: 'hover:shadow-[0_20px_45px_-10px_rgba(0,245,155,0.25)] hover:border-emerald-500/40',
    cyan: 'hover:shadow-[0_20px_45px_-10px_rgba(0,229,255,0.25)] hover:border-cyan-500/40',
    indigo: 'hover:shadow-[0_20px_45px_-10px_rgba(99,102,241,0.28)] hover:border-indigo-500/40',
    purple: 'hover:shadow-[0_20px_45px_-10px_rgba(168,85,247,0.28)] hover:border-purple-500/40',
    gold: 'hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.25)] hover:border-amber-500/40',
    none: ''
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transition-all duration-200 ease-out select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className={`relative rounded-2xl glass-panel transition-all duration-150 ease-out overflow-hidden ${
          glowStyles[glowColor]
        }`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.35s ease-out'
        }}
      >
        {/* Specular Light Flare Overlay */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.12), transparent 75%)`
            }}
          />
        )}

        {/* Card Content with 3D Pop Layer */}
        <div style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)', transition: 'transform 0.15s ease-out' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
