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
  glow = 'none', // Glow is legacy, but we'll map it to a subtle border/shadow in MD3
  gradient = false,
  onClick,
  padding = 'p-6',
}: GlassCardProps) {
  // MD3 Translation:
  // Instead of glass, we use Surface Container (#F3EDF7)
  const hoverClass = hover 
    ? 'cursor-pointer hover:bg-[#E8DEF8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300' 
    : 'transition-all duration-300';
  
  const glowMap: Record<string, string> = {
    emerald: 'border-b-4 border-emerald-500',
    blue: 'border-b-4 border-blue-500',
    purple: 'border-b-4 border-[#6750A4]',
    rose: 'border-b-4 border-rose-500',
    amber: 'border-b-4 border-amber-500',
    none: 'border border-transparent',
  };
  const glowClass = glowMap[glow] || glowMap.none;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-[#F3EDF7] rounded-[24px] shadow-sm ${padding} ${glowClass} ${hoverClass} ${className} w-full`}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
}
