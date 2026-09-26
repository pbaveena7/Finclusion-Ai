import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart as PieIcon, TrendingUp, TrendingDown, ArrowUpRight, 
  Wallet, DollarSign, ArrowDownRight, Filter, ChevronDown, 
  Search, ShieldCheck, Plus, Sparkles, RefreshCw 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis 
} from 'recharts';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import { useStore } from '../store/useStore';
import { mockPortfolio } from '../data/mockPortfolio';
import ScrollReveal from '../components/animations/ScrollReveal';

const ASSET_TYPES = ['all', 'stock', 'mutualfund', 'gold', 'fd', 'ppf'];

export default function Portfolio() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'pnlPercent'>('value');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const portfolio = mockPortfolio;

  // Filter & sort holdings
  const filteredHoldings = useMemo(() => {
    return portfolio.holdings.filter(h => {
      const matchType = activeTab === 'all' || h.type === activeTab;
      const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (h.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchType && matchSearch;
    }).sort((a, b) => {
      const aVal = sortBy === 'value' ? a.currentValue : sortBy === 'pnl' ? a.pnl : a.pnlPercent;
      const bVal = sortBy === 'value' ? b.currentValue : sortBy === 'pnl' ? b.pnl : b.pnlPercent;
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [portfolio.holdings, activeTab, searchQuery, sortBy, sortDir]);

  const handleSort = (key: 'value' | 'pnl' | 'pnlPercent') => {
    if (sortBy === key) {
      setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  // Performance history for chart
  const performanceData = [
    { month: 'Oct', value: 875000 },
    { month: 'Nov', value: 910000 },
    { month: 'Dec', value: 940000 },
    { month: 'Jan', value: 990000 },
    { month: 'Feb', value: 1015000 },
    { month: 'Mar', value: 1042500 }
  ];

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full font-sans">
      <Sidebar activeId="investments" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        {/* Topbar */}
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <PieIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">Investment Portfolio</h1>
              <p className="text-xs text-[var(--text-muted)]">Real-time asset allocation & P&L tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSelector />
            <div className="flex items-center gap-3 px-3 py-1.5 border rounded-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--accent-gradient)' }}>
                <span className="text-white text-xs font-bold">{user?.name?.[0] || 'U'}</span>
              </div>
              <span className="text-xs font-bold text-[var(--text-main)]">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
          
          {/* Summary Metric Cards */}
          <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden group card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Portfolio Value</span>
                <Wallet className="w-4 h-4 text-[var(--accent-primary)]" />
              </div>
              <p className="text-3xl font-extrabold text-[var(--text-main)]">₹{portfolio.currentValue.toLocaleString()}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+19.14% All Time</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Invested</span>
                <DollarSign className="w-4 h-4 text-[var(--accent-secondary)]" />
              </div>
              <p className="text-3xl font-extrabold text-[var(--text-main)]">₹{portfolio.totalInvested.toLocaleString()}</p>
              <p className="mt-3 text-xs text-[var(--text-muted)]">Across 5 Asset Classes</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Profit / Return</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">+₹{portfolio.totalPnl.toLocaleString()}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  +{portfolio.totalPnlPercent}% CAGR
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Health & Risk Index</span>
                <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
              </div>
              <p className="text-3xl font-extrabold text-[var(--text-main)]">92<span className="text-base text-[var(--text-muted)]">/100</span></p>
              <p className="mt-3 text-xs text-emerald-400 font-semibold">Low Volatility • Well Diversified</p>
            </motion.div>
          </div>
          </ScrollReveal>

          {/* Charts Row */}
          <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Allocation Donut */}
            <div className="glass-card-lg p-6 lg:col-span-1 flex flex-col justify-between card-hover">
              <div>
                <h3 className="text-base font-bold mb-1 text-[var(--text-main)]">Asset Allocation</h3>
                <p className="text-xs text-[var(--text-muted)] mb-4">Target vs Current Diversification</p>
              </div>

              <div className="h-60 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolio.allocation}
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {portfolio.allocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-base)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Value']}
                      contentStyle={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-card)', borderRadius: 12, color: 'var(--text-main)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-[var(--text-main)]">₹10.4L</span>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {portfolio.allocation.map(item => (
                  <div key={item.category} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-[var(--text-main)]">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[var(--text-muted)] font-sans">₹{(item.value / 1000).toFixed(0)}k</span>
                      <span className="font-bold text-[var(--text-main)]">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Curve */}
            <div className="glass-card-lg p-6 lg:col-span-2 flex flex-col justify-between card-hover">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold mb-1 text-[var(--text-main)]">Portfolio Growth Trajectory</h3>
                  <p className="text-xs text-[var(--text-muted)]">Cumulative 6-month capital progression</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--accent-primary)' }}>
                  6 Months (+19.1%)
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} dx={-5} />
                    <Tooltip 
                      formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Portfolio Value']}
                      contentStyle={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-card)', borderRadius: 12, color: 'var(--text-main)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} fill="url(#portfolioGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Holdings Section */}
          <ScrollReveal delay={0.3}>
          <div className="glass-card-lg p-6 space-y-5 card-hover">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">Asset Holdings Breakdown</h3>
                <p className="text-xs text-[var(--text-muted)]">{filteredHoldings.length} active investment positions</p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search holdings..."
                    className="glass-input pl-9 pr-3 py-1.5 rounded-full text-xs w-48 focus:w-60 transition-all"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-full border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                  {ASSET_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeTab === type ? 'text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                      style={activeTab === type ? { background: 'var(--accent-gradient)' } : {}}
                    >
                      {type === 'all' ? 'All' : type === 'mutualfund' ? 'MF' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--border-card)' }}>
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] font-bold uppercase tracking-wider border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}>
                  <tr>
                    <th className="py-3.5 px-4">Instrument</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4 text-right">Qty</th>
                    <th className="py-3.5 px-4 text-right">Avg Buy Price</th>
                    <th className="py-3.5 px-4 text-right">Current Price</th>
                    <th 
                      onClick={() => handleSort('value')}
                      className="py-3.5 px-4 text-right cursor-pointer hover:text-[var(--text-main)] transition-colors"
                    >
                      Current Value {sortBy === 'value' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    <th 
                      onClick={() => handleSort('pnl')}
                      className="py-3.5 px-4 text-right cursor-pointer hover:text-[var(--text-main)] transition-colors"
                    >
                      P&L / Return {sortBy === 'pnl' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHoldings.map((h) => {
                    const isProfit = h.pnl >= 0;
                    return (
                      <tr key={h.id} className="hover:bg-[var(--bg-card-hover)] transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">{h.name}</div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)]">{h.symbol}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: 'var(--input-bg)', color: 'var(--accent-primary)' }}>
                            {h.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs text-[var(--text-main)]">{h.quantity}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs text-[var(--text-muted)]">₹{h.buyPrice.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-[var(--text-main)]">₹{h.currentPrice.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-[var(--text-main)]">₹{h.currentValue.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs font-bold">
                          <span className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                            {isProfit ? '+' : ''}₹{h.pnl.toLocaleString()}
                          </span>
                          <span className={`block text-[10px] ${isProfit ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                            {isProfit ? '+' : ''}{h.pnlPercent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
