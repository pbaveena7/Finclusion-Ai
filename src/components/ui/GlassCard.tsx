import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'emerald' | 'blue' | 'purple' | 'rose' | 'amber' | 'none';
  gradient?: boolean;
  onClick?: () => void;
  padding?: string;
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = 'none',
  gradient = false,
  onClick,
  padding = 'p-6',
}: GlassCardProps) {
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';
  const hoverClass = hover ? 'hover-lift cursor-pointer glass-hover' : '';
  const gradientClass = gradient ? 'gradient-border' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`glass rounded-2xl border border-white/5 ${padding} ${glowClass} ${hoverClass} ${gradientClass} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}
