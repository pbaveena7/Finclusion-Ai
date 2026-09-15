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
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-[#49454F]',
  };

  const trendBg = {
    up: 'bg-emerald-500/10',
    down: 'bg-rose-500/10',
    neutral: 'bg-[#E7E0EC]',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#F3EDF7] rounded-[24px] p-6 shadow-sm hover:shadow-md hover:bg-[#E8DEF8] transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-[#49454F]">{label}</span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#6750A4]/10 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#1C1B1F] whitespace-nowrap flex items-center">
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
