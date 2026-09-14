import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  format?: 'currency' | 'percent' | 'number';
  className?: string;
}

export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendValue,
  icon,
  format = 'number',
  className = '',
}: StatCardProps) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
    neutral: 'text-slate-400',
  };

  const trendBg = {
    up: 'bg-emerald-500/10',
    down: 'bg-rose-500/10',
    neutral: 'bg-slate-500/10',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-5 hover-lift ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">
          {prefix}
          <AnimatedCounter value={value} format={format} />
          {suffix}
        </span>
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trendColors[trend]} ${trendBg[trend]}`}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </span>
        </div>
      )}
    </motion.div>
  );
}
