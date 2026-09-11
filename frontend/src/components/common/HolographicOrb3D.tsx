'use client';

import React, { useEffect, useRef } from 'react';

interface HolographicOrb3DProps {
  size?: number;
  particleCount?: number;
  colorScheme?: 'emerald' | 'cyan' | 'indigo' | 'gold';
  pulse?: boolean;
  interactive?: boolean;
  scoreText?: string;
  subText?: string;
  className?: string;
}

export function HolographicOrb3D({
  size = 280,
  particleCount = 120,
  colorScheme = 'emerald',
  pulse = false,
  interactive = true,
  scoreText,
  subText,
  className = ''
}: HolographicOrb3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animRef = useRef<number | null>(null);

  const colors = {
    emerald: {
      primary: '#00f59b',
      glow: 'rgba(0, 245, 155, 0.45)',
      line: 'rgba(0, 245, 155, 0.15)',
      ring: 'rgba(0, 245, 155, 0.3)'
    },
    cyan: {
      primary: '#00e5ff',
      glow: 'rgba(0, 229, 255, 0.45)',
      line: 'rgba(0, 229, 255, 0.15)',
      ring: 'rgba(0, 229, 255, 0.3)'
    },
    indigo: {
      primary: '#818cf8',
      glow: 'rgba(99, 102, 241, 0.45)',
      line: 'rgba(99, 102, 241, 0.15)',
      ring: 'rgba(99, 102, 241, 0.3)'
    },
    gold: {
      primary: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.45)',
      line: 'rgba(245, 158, 11, 0.15)',
      ring: 'rgba(245, 158, 11, 0.3)'
    }
  }[colorScheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display crispness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.36;
    const center = size / 2;

    // Generate 3D spherical particles (Fibonacci sphere distribution)
    interface Point3D {
      x: number;
      y: number;
      z: number;
      origX: number;
      origY: number;
      origZ: number;
      baseSize: number;
    }

    const points: Point3D[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        origX: x * radius,
        origY: y * radius,
        origZ: z * radius,
        baseSize: Math.random() * 1.5 + 1.2
      });
    }

    let angleX = 0;
    let angleY = 0;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, size, size);

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      angleY += 0.006 + mouseRef.current.x * 0.0003;
      angleX = Math.sin(time * 0.5) * 0.2 + mouseRef.current.y * 0.0003;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project points to 2D screen
      const projected = points.map(pt => {
        // Rotate around Y
        let x1 = pt.origX * cosY - pt.origZ * sinY;
        let z1 = pt.origZ * cosY + pt.origX * sinY;

        // Rotate around X
        let y2 = pt.origY * cosX - z1 * sinX;
        let z2 = z1 * cosX + pt.origY * sinX;

        // Pulse expansion
        const pulseFactor = pulse ? 1 + Math.sin(time * 3) * 0.06 : 1;
        const scale = (350 / (350 + z2)) * pulseFactor;
        const projX = center + x1 * scale;
        const projY = center + y2 * scale;
        const alpha = Math.max(0.15, Math.min(1, (z2 + radius) / (2 * radius)));

        return { x: projX, y: projY, z: z2, scale, alpha, size: pt.baseSize * scale };
      });

      // Sort points back-to-front for proper depth occlusion
      projected.sort((a, b) => a.z - b.z);

      // Draw Center Ambient Glow Orb
      const pulseGlowRadius = radius * (pulse ? 0.75 + Math.sin(time * 4) * 0.08 : 0.7);
      const glowGrad = ctx.createRadialGradient(center, center, 0, center, center, pulseGlowRadius);
      glowGrad.addColorStop(0, colors.glow);
      glowGrad.addColorStop(0.6, colors.line);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(center, center, pulseGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw 3D Connective Neural Mesh
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z < -radius * 0.3) continue; // Only connect front-facing

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 42) {
            const lineAlpha = (1 - dist / 42) * Math.min(p1.alpha, p2.alpha) * 0.45;
            ctx.strokeStyle = `rgba(0, 245, 155, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Spherical Particles
      projected.forEach(p => {
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Concentric 3D Orbital Rings
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = colors.ring;
      ctx.lineWidth = 1.2;

      // Equatorial Ring 1
      ctx.beginPath();
      ctx.ellipse(center, center, radius * 1.22, radius * 0.45, angleY * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Polar Ring 2
      ctx.beginPath();
      ctx.ellipse(center, center, radius * 1.15, radius * 0.35, -angleY * 0.4 + 1, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [size, particleCount, colorScheme, pulse, colors]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.targetX = e.clientX - rect.left - size / 2;
    mouseRef.current.targetY = e.clientY - rect.top - size / 2;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block cursor-grab active:cursor-grabbing"
      />

      {/* Center Holographic Metric Overlay (if specified) */}
      {(scoreText || subText) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          {scoreText && (
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_0_16px_rgba(0,245,155,0.6)]">
              {scoreText}
            </div>
          )}
          {subText && (
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400/90 mt-1">
              {subText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
