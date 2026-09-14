import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'none' | 'emerald' | 'cyan' | 'rose' | 'amber' | 'purple';
  padding?: string;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = 'none',
  padding = 'p-6',
  onClick,
}: GlassCardProps) {
  const glowClasses = {
    none: '',
    emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.1)] border-emerald-500/20',
    cyan: 'shadow-[0_0_30px_rgba(6,182,212,0.1)] border-cyan-500/20',
    rose: 'shadow-[0_0_30px_rgba(244,63,94,0.1)] border-rose-500/20',
    amber: 'shadow-[0_0_30px_rgba(245,158,11,0.1)] border-amber-500/20',
    purple: 'shadow-[0_0_30px_rgba(139,92,246,0.1)] border-purple-500/20',
  };

  const Component = onClick ? 'button' : 'div';
  const interactionClasses = onClick || hover ? 'hover-lift' : '';
  const textAlignment = onClick ? 'text-left w-full' : '';

  return (
    <Component
      onClick={onClick}
      className={`glass rounded-2xl ${padding} ${glowClasses[glow]} ${interactionClasses} ${textAlignment} ${className}`}
    >
      {children}
    </Component>
  );
}
