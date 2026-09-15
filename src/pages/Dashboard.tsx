import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Heart,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Calculator,
  Landmark,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import DonutChart from '../components/charts/DonutChart';
import AreaChartComponent from '../components/charts/AreaChart';
import Badge from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import { mockStocks } from '../data/mockStocks';
import { generatePortfolioHistory } from '../data/mockPortfolio';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const aiInsights = [
  {
    icon: '💡',
    title: 'Optimize Tax Savings',
    text: 'Invest ₹7,325/month more in ELSS to maximize your 80C deduction. Potential tax saving: ₹22,000.',
  },
  {
    icon: '📊',
    title: 'Portfolio Rebalancing',
    text: 'Your equity allocation is at 61%. Consider adding debt funds to balance risk for your moderate profile.',
  },
  {
    icon: '🎯',
    title: 'Goal Alert',
    text: 'Your Dream Vacation goal is behind schedule. Increase monthly SIP by ₹1,200 to stay on track.',
  },
];

export default function Dashboard() {
  const { user, portfolio, goals } = useStore();
  const navigate = useNavigate();
  const [activeInsight, setActiveInsight] = useState(0);

  const portfolioHistory = useMemo(() => generatePortfolioHistory(), []);

  const topGainers = mockStocks
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = mockStocks
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  // Cycle through AI insights
  useMemo(() => {
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % aiInsights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const monthlySIP = goals.reduce((sum, g) => sum + g.monthlyContribution, 0);

  return (
    <PageWrapper>
      {/* Hero Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1C1B1F] flex flex-wrap items-center gap-1.5 tracking-tight">
          <span>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},</span>
          <span className="text-[#6750A4] whitespace-nowrap">{user?.name?.split(' ')[0] || 'User'}</span> 
          <span className="whitespace-nowrap">👋</span>
        </h1>
        <p className="text-sm text-[#49454F] mt-1">Here's your financial overview for today</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            label="Portfolio Value"
            value={portfolio?.currentValue || 0}
            prefix="₹"
            format="currency"
            trend="up"
            trendValue="+₹1.68L (19.1%)"
            icon={<Wallet className="w-5 h-5 text-emerald-400" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Today's P&L"
            value={3245}
            prefix="₹"
            format="currency"
            trend="up"
            trendValue="+0.31%"
            icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="bg-[#F3EDF7] rounded-[24px] p-6 shadow-sm hover:shadow-md hover:bg-[#E8DEF8] transition-all duration-300 group cursor-pointer hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-[#49454F]">Financial Health</span>
              <div className="w-10 h-10 rounded-xl bg-[#6750A4]/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#6750A4]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressRing progress={user?.financialHealthScore || 0} size={56} strokeWidth={5} color="#6750A4" />
              <div>
                <span className="text-2xl font-bold text-[#1C1B1F]">{user?.financialHealthScore}/100</span>
                <Badge variant="purple" size="sm" className="ml-2">Good</Badge>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Monthly SIPs"
            value={monthlySIP}
            prefix="₹"
            format="currency"
            trend="neutral"
            trendValue={`${goals.length} active goals`}
            icon={<IndianRupee className="w-5 h-5 text-cyan-400" />}
          />
        </motion.div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Portfolio Chart — wider on XL screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 xl:col-span-3 h-full"
        >
          <GlassCard padding="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[#1C1B1F]">Portfolio Performance</h2>
                <p className="text-xs text-[#49454F] mt-0.5">Last 12 months</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  +₹<AnimatedCounter value={167500} format="currency" />
                </p>
                <p className="text-xs text-emerald-600 font-medium">+19.14%</p>
              </div>
            </div>
            <AreaChartComponent
              data={portfolioHistory.slice(-90)}
              height={260}
              color="#10b981"
              gradientId="portfolioDash"
            />
          </GlassCard>
        </motion.div>

        {/* Allocation Donut — 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard padding="p-6" className="h-full flex flex-col justify-center">
            <h2 className="text-base font-semibold text-[#1C1B1F] mb-4">Asset Allocation</h2>
            <div className="flex-1 flex items-center justify-center">
              <DonutChart
                data={portfolio?.allocation || []}
                centerValue={`₹${((portfolio?.currentValue || 0) / 100000).toFixed(1)}L`}
                centerLabel="Total"
                height={220}
              />
            </div>
            <div className="mt-6 space-y-3">
              {portfolio?.allocation.slice(0, 4).map((a) => (
                <div key={a.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-[#49454F] font-medium">{a.category}</span>
                  </div>
                  <span className="text-[#1C1B1F] font-semibold">{a.percentage}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Goals + Market + AI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Goals Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2"
        >
          <GlassCard padding="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1C1B1F]">Goals Progress</h2>
              <button
                onClick={() => navigate('/goals')}
                className="text-xs font-semibold text-[#6750A4] hover:text-[#7d63c5] flex items-center gap-1"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 4).map((goal) => (
                <div key={goal.id} className="flex items-center gap-3">
                  <ProgressRing
                    progress={goal.progress}
                    size={44}
                    strokeWidth={4}
                    color={goal.status === 'ahead' ? '#10b981' : goal.status === 'behind' ? '#f43f5e' : '#3b82f6'}
                    showLabel={false}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1C1B1F] truncate">
                        {goal.icon} {goal.name}
                      </p>
                      <Badge
                        variant={goal.status === 'ahead' ? 'success' : goal.status === 'behind' ? 'danger' : 'info'}
                        size="sm"
                      >
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-[#49454F]">
                        ₹{(goal.currentSavings / 100000).toFixed(1)}L / ₹{(goal.targetAmount / 100000).toFixed(1)}L
                      </p>
                      <p className="text-xs font-semibold text-[#1C1B1F]">{goal.progress}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Market Pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <GlassCard padding="p-6 h-full">
            <h2 className="text-lg font-semibold text-[#1C1B1F] mb-4">Market Pulse</h2>

            {/* Nifty / Sensex */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-[16px] bg-[#E7E0EC] border border-[#E7E0EC]">
                <p className="text-xs text-[#49454F] font-medium">NIFTY 50</p>
                <p className="text-lg font-bold text-[#1C1B1F]">21,456</p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +0.82%
                </p>
              </div>
              <div className="p-3 rounded-[16px] bg-[#E7E0EC] border border-[#E7E0EC]">
                <p className="text-xs text-[#49454F] font-medium">SENSEX</p>
                <p className="text-lg font-bold text-[#1C1B1F]">71,232</p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +0.65%
                </p>
              </div>
            </div>

            {/* Top Movers */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#49454F] uppercase tracking-wider">Top Movers</p>
              {topGainers.slice(0, 3).map((s) => (
                <div key={s.symbol} className="flex items-center justify-between py-1.5 px-3 -mx-3 rounded-[12px] hover:bg-[#E8DEF8] transition-colors cursor-default">
                  <div>
                    <p className="text-sm font-bold text-[#1C1B1F]">{s.symbol}</p>
                    <p className="text-xs font-mono tabular-nums text-[#49454F]">₹{s.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-sm font-mono tabular-nums font-semibold text-emerald-600">
                    +{s.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
              {topLosers.slice(0, 2).map((s) => (
                <div key={s.symbol} className="flex items-center justify-between py-1.5 px-3 -mx-3 rounded-[12px] hover:bg-[#E8DEF8] transition-colors cursor-default">
                  <div>
                    <p className="text-sm font-bold text-[#1C1B1F]">{s.symbol}</p>
                    <p className="text-xs font-mono tabular-nums text-[#49454F]">₹{s.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-sm font-mono tabular-nums font-semibold text-rose-600">
                    {s.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard padding="p-6 h-full bg-[#E8DEF8] border-none" glow="purple">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#6750A4]" />
              <h2 className="text-lg font-semibold text-[#1D192B]">AI Insights</h2>
            </div>

            <div className="relative min-h-[140px]">
              {aiInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: activeInsight === i ? 1 : 0,
                    y: activeInsight === i ? 0 : 10,
                    position: activeInsight === i ? 'relative' : 'absolute',
                  }}
                  transition={{ duration: 0.5 }}
                  className="inset-0"
                >
                  <div className="text-3xl mb-3">{insight.icon}</div>
                  <h3 className="text-sm font-bold text-[#1D192B] mb-2">{insight.title}</h3>
                  <p className="text-sm text-[#49454F] leading-relaxed font-medium">{insight.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-4">
              {aiInsights.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveInsight(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeInsight === i ? 'bg-[#6750A4] w-6' : 'bg-[#6750A4]/30'
                  }`}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-lg font-semibold text-[#1C1B1F] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Calculator, label: 'SIP Calculator', path: '/calculator', bg: 'bg-[#E7E0EC]', iconColor: 'text-[#6750A4]' },
            { icon: ShieldCheck, label: 'Fraud Check', path: '/fraud', bg: 'bg-[#FFD8E4]', iconColor: 'text-[#B3261E]' },
            { icon: Landmark, label: 'Scheme Finder', path: '/schemes', bg: 'bg-[#FFDF99]', iconColor: 'text-[#7D5260]' },
            { icon: Sparkles, label: 'Ask AI', path: '/chat', bg: 'bg-[#E8DEF8]', iconColor: 'text-[#6750A4]' },
          ].map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className="bg-[#F3EDF7] rounded-[24px] shadow-sm hover:shadow-md p-5 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:bg-[#E8DEF8] cursor-pointer hover:-translate-y-0.5 w-full"
            >
              <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center`}>
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>
              <span className="text-sm font-semibold text-[#49454F]">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
