import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import DonutChart from '../components/charts/DonutChart';
import AreaChartComponent from '../components/charts/AreaChart';
import Badge from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import { generatePortfolioHistory } from '../data/mockPortfolio';
import { useMemo, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Portfolio() {
  const { portfolio } = useStore();
  const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'pnlPercent'>('value');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const portfolioHistory = useMemo(() => generatePortfolioHistory(), []);

  if (!portfolio) return null;

  const sortedHoldings = [...portfolio.holdings].sort((a, b) => {
    const aVal = sortBy === 'value' ? a.currentValue : sortBy === 'pnl' ? a.pnl : a.pnlPercent;
    const bVal = sortBy === 'value' ? b.currentValue : sortBy === 'pnl' ? b.pnl : b.pnlPercent;
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (key: 'value' | 'pnl' | 'pnlPercent') => {
    if (sortBy === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  const typeColors: Record<string, string> = {
    stock: 'info',
    mutualfund: 'success',
    etf: 'purple',
    nps: 'warning',
    ppf: 'warning',
    fd: 'neutral',
    gold: 'warning',
  };

  return (
    <PageWrapper title="Portfolio" subtitle="Track your investments across all asset classes">
      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <GlassCard padding="p-6">
            <p className="text-sm text-[#49454F] mb-1">Invested Amount</p>
            <p className="text-2xl font-bold text-[#1C1B1F]">
              ₹<AnimatedCounter value={portfolio.totalInvested} format="currency" />
            </p>
          </GlassCard>
        </motion.div>
        <motion.div variants={itemVariants}>
          <GlassCard padding="p-6" glow="emerald">
            <p className="text-sm text-[#49454F] mb-1">Current Value</p>
            <p className="text-2xl font-bold text-[#1C1B1F]">
              ₹<AnimatedCounter value={portfolio.currentValue} format="currency" />
            </p>
          </GlassCard>
        </motion.div>
        <motion.div variants={itemVariants}>
          <GlassCard padding="p-6">
            <p className="text-sm text-[#49454F] mb-1">Total P&L</p>
            <p className={`text-2xl font-bold ${portfolio.totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {portfolio.totalPnl >= 0 ? '+' : ''}₹<AnimatedCounter value={Math.abs(portfolio.totalPnl)} format="currency" />
            </p>
          </GlassCard>
        </motion.div>
        <motion.div variants={itemVariants}>
          <GlassCard padding="p-6">
            <p className="text-sm text-[#49454F] mb-1">Returns</p>
            <p className={`text-2xl font-bold flex items-center gap-1 ${portfolio.totalPnlPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {portfolio.totalPnlPercent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <AnimatedCounter value={portfolio.totalPnlPercent} format="percent" />%
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Chart + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 xl:col-span-3"
        >
          <GlassCard padding="p-6 h-full">
            <h2 className="text-base font-semibold text-[#1C1B1F] mb-4">Portfolio Value Over Time</h2>
            <AreaChartComponent
              data={portfolioHistory.slice(-180)}
              height={300}
              color="#10b981"
              gradientId="portfolioPage"
            />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard padding="p-6 h-full flex flex-col justify-center">
            <h2 className="text-base font-semibold text-[#1C1B1F] mb-4">Allocation</h2>
            <div className="flex-1 flex items-center justify-center">
              <DonutChart
                data={portfolio.allocation}
                centerValue={`₹${(portfolio.currentValue / 100000).toFixed(1)}L`}
                centerLabel="Total"
                height={220}
              />
            </div>
            <div className="mt-6 space-y-3">
              {portfolio.allocation.map((a) => (
                <div key={a.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-[#49454F] font-medium">{a.category}</span>
                  </div>
                  <span className="text-[#1C1B1F] font-semibold">₹{(a.value / 1000).toFixed(0)}K • {a.percentage}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Holdings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard padding="p-0">
          <div className="px-5 py-4 border-b border-[#E7E0EC]">
            <h2 className="text-lg font-semibold text-[#1C1B1F]">Holdings ({portfolio.holdings.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E7E0EC]">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#49454F] uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#49454F] uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-[#49454F] uppercase tracking-wider">Invested</th>
                  <th
                    className="px-5 py-3 text-right text-xs font-semibold text-[#49454F] uppercase tracking-wider cursor-pointer hover:text-[#1C1B1F] transition-colors"
                    onClick={() => handleSort('value')}
                  >
                    Current Value {sortBy === 'value' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-5 py-3 text-right text-xs font-semibold text-[#49454F] uppercase tracking-wider cursor-pointer hover:text-[#1C1B1F] transition-colors"
                    onClick={() => handleSort('pnl')}
                  >
                    P&L {sortBy === 'pnl' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-5 py-3 text-right text-xs font-semibold text-[#49454F] uppercase tracking-wider cursor-pointer hover:text-[#1C1B1F] transition-colors"
                    onClick={() => handleSort('pnlPercent')}
                  >
                    Returns {sortBy === 'pnlPercent' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedHoldings.map((h, i) => (
                  <motion.tr
                    key={h.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[#E7E0EC] hover:bg-[#F3EDF7] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-[#1C1B1F]">{h.name}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={(typeColors[h.type] || 'neutral') as any} size="sm">
                        {h.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-[#49454F] font-medium">
                      ₹{h.investedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-[#1C1B1F] font-semibold">
                      ₹{h.currentValue.toLocaleString('en-IN')}
                    </td>
                    <td className={`px-5 py-3.5 text-right text-sm font-semibold ${h.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {h.pnl >= 0 ? '+' : ''}₹{Math.abs(h.pnl).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${h.pnlPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {h.pnlPercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </PageWrapper>
  );
}
