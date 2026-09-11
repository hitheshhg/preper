'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill-dark' | 'pill-light';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans uppercase tracking-[0.08em] font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-full';

  const sizeStyles = {
    sm: 'text-[11px] px-4 py-2',
    md: 'text-xs px-6 py-3',
    lg: 'text-xs px-8 py-3.5'
  };

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground border border-transparent hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 shadow-2xs',
    'pill-dark': 'bg-primary text-primary-foreground border border-transparent hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 shadow-2xs',
    secondary: 'bg-transparent text-foreground border border-border-strong hover:border-foreground hover:bg-surface-muted hover:-translate-y-0.5 active:translate-y-0',
    'pill-light': 'bg-transparent text-foreground border border-border-strong hover:border-foreground hover:bg-surface-muted hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'bg-transparent text-foreground hover:bg-surface-muted'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
