import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Bell, LayoutDashboard, LineChart, PieChart, 
  Wallet, Sprout, FileText, Settings,
  TrendingUp, Cloud, MoreVertical, CheckCircle2,
  User, Leaf, ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line
} from 'recharts';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import { useTranslation } from '../hooks/useTranslation';
import ScrollReveal from '../components/animations/ScrollReveal';

export default function Dashboard() {
  const { user, theme, setTheme } = useStore();
  const { t } = useTranslation();

  const portfolioChart = [
    { name: 'Jan', value: 1000000 }, { name: 'Feb', value: 1050000 },
    { name: 'Mar', value: 1100000 }, { name: 'Apr', value: 1250000 },
    { name: 'May', value: 1200000 }, { name: 'June', value: 1386234 },
  ];

  const marketRiskChart = [
    { name: '1', value: 10 }, { name: '2', value: 12 }, { name: '3', value: 11 },
    { name: '4', value: 15 }, { name: '5', value: 14 }, { name: '6', value: 18 },
    { name: '7', value: 17 }, { name: '8', value: 22 },
  ];

  const volatilityChart = [
    { name: '1', value: 5 }, { name: '2', value: 7 }, { name: '3', value: 6 },
    { name: '4', value: 8 }, { name: '5', value: 7 }, { name: '6', value: 10 },
    { name: '7', value: 9 }, { name: '8', value: 11 }, { name: '9', value: 10 },
    { name: '10', value: 13 },
  ];

  const fundComparisonData = [
    { name: 'Jan', fundA: 10, benchmark: 8, fundB: 5 },
    { name: 'Feb', fundA: 12, benchmark: 9, fundB: 7 },
    { name: 'Mar', fundA: 11, benchmark: 10, fundB: 8 },
    { name: 'Apr', fundA: 15, benchmark: 11, fundB: 10 },
    { name: 'May', fundA: 14, benchmark: 12, fundB: 9 },
    { name: 'Jun', fundA: 18, benchmark: 13, fundB: 12 },
    { name: 'Jul', fundA: 17, benchmark: 14, fundB: 14 },
    { name: 'Aug', fundA: 21, benchmark: 15, fundB: 15 },
    { name: 'Sep', fundA: 20, benchmark: 16, fundB: 17 },
    { name: 'Oct', fundA: 24, benchmark: 17, fundB: 19 },
    { name: 'Nov', fundA: 22, benchmark: 18, fundB: 20 },
    { name: 'Dec', fundA: 26, benchmark: 19, fundB: 22 },
  ];

  const assetAllocation = [
    { name: 'Equities', value: 52, color: 'var(--accent-primary)' },
    { name: 'Green Bonds', value: 21, color: 'var(--accent-secondary)' },
    { name: 'Infrastructure', value: 14, color: 'var(--text-dim)' },
    { name: 'Cash Reserve', value: 13, color: 'var(--border-hover)' },
  ];

  const chartTheme = {
    primary: 'var(--accent-primary)',
    secondary: 'var(--accent-secondary)',
    muted: 'var(--text-muted)',
    dim: 'var(--text-dim)',
  };

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="overview" />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        
        {/* Topbar */}
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="glass-input w-full rounded-full py-2 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border flex items-center justify-center relative hover:bg-[var(--bg-card-hover)] transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <Bell className="w-4 h-4 text-[var(--text-main)]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full border-2 border-[var(--sidebar-bg)]" style={{ background: 'var(--accent-secondary)' }} />
            </button>
            <ThemeSelector />
            <div className="flex items-center gap-3 px-3 py-1.5 border rounded-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--accent-gradient)' }}>
                <span className="text-white text-xs font-bold">{user?.name?.[0] || 'U'}</span>
              </div>
              <div className="pr-1">
                <p className="text-xs font-bold leading-tight truncate max-w-[100px] text-[var(--text-main)]">{user?.name || 'User'}</p>
                <p className="text-[9px] leading-tight text-[var(--text-muted)]">Premium</p>
              </div>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full">
          
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-1 tracking-tight text-[var(--text-main)]">{t('nav.overview')}</h1>
            <p className="text-sm text-[var(--text-muted)]">{t('dashboard.welcome')}, {user?.name?.split(' ')[0] || 'Investor'}! Here is your portfolio summary.</p>
          </div>

          <motion.div 
            initial="hidden" animate="show" 
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} 
            className="grid grid-cols-12 gap-6"
          >
            
            {/* ROW 1 */}
            
            {/* Total Portfolio Value */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-4 glass-card-lg p-6 flex flex-col justify-between relative overflow-hidden group card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: 'var(--accent-primary)' }} />
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>Total Portfolio Value</p>
                  <h2 className="text-4xl font-extrabold text-[var(--text-main)]">$1,386,234.37</h2>
                  <p className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                    <TrendingUp className="w-3 h-3"/> +18.56%
                  </p>
                </div>
              </div>
              <div className="h-40 w-full mt-4 -mb-6 -mx-2 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioChart}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.6}/>
                        <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke={chartTheme.dim} fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis orientation="right" stroke={chartTheme.dim} fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000000 ? `${v/1000000}M` : `${v/1000}K`} dx={10} />
                    <Tooltip cursor={{ stroke: chartTheme.dim, strokeWidth: 1, strokeDasharray: '4 4' }} formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Value']} />
                    <Area type="monotone" dataKey="value" stroke={chartTheme.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, fill: chartTheme.primary, stroke: 'var(--bg-base)', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Key Highlights */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-5 glass-card-lg p-6 flex flex-col justify-between group card-hover">
              <h3 className="font-bold mb-6 text-[var(--text-muted)] uppercase tracking-wider text-xs">Key Highlights</h3>
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="flex flex-col justify-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-glow-subtle)' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>Annual Growth</p>
                  <p className="text-2xl font-bold text-[var(--text-main)]">+18.54%</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Total Last Years</p>
                </div>
                <div className="flex flex-col justify-center border-l border-r px-4" style={{ borderColor: 'var(--border-card)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-glow-subtle)' }}>
                    <Leaf className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>Sustainability</p>
                  <p className="text-2xl font-bold text-[var(--text-main)]">89<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/100</span></p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>ESG Rating</p>
                </div>
                <div className="flex flex-col justify-center pl-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-glow-subtle)' }}>
                    <Cloud className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>Carbon Exp.</p>
                  <p className="text-2xl font-bold text-[var(--text-main)]">-15%</p>
                  <p className="text-[10px] mt-1 font-bold" style={{ color: 'var(--accent-secondary)' }}>Lower Than Benchmark</p>
                </div>
              </div>
            </motion.div>

            {/* Market Status */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-3 glass-card-lg p-6 flex flex-col justify-between card-hover">
              <div>
                <h3 className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs mb-1 flex items-center gap-2">Market Status</h3>
                <p className="text-xl font-bold mt-2" style={{ color: 'var(--accent-primary)' }}>Moderate Growth</p>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>Risk Level</span>
                </div>
                <div className="h-2 w-full rounded-full flex overflow-hidden border" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-card)' }}>
                  <div className="h-full w-1/3" style={{ background: 'var(--accent-primary)' }} />
                  <div className="h-full w-1/3" style={{ background: 'var(--accent-secondary)' }} />
                  <div className="h-full w-1/3 bg-rose-500" />
                </div>
                <div className="w-full relative h-2">
                  <div className="absolute top-[-10px] left-[45%] w-4 h-4 rounded-full border-[3px]" style={{ background: 'var(--text-main)', borderColor: 'var(--bg-card)', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-dim)' }}>Volatility (VIX)</p>
                  <p className="text-xl font-bold text-[var(--text-main)]">13.7</p>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volatilityChart}>
                      <Area type="monotone" dataKey="value" stroke="none" fill={chartTheme.dim} fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* ROW 2 */}
            
            {/* Tax Efficiency */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 md:col-span-4 lg:col-span-3 glass-card-lg p-6 relative card-hover">
              <MoreVertical className="w-4 h-4 absolute top-6 right-6" style={{ color: 'var(--text-dim)' }} />
              <h3 className="font-bold uppercase tracking-wider text-xs mb-6 flex items-center gap-2 text-[var(--text-muted)]">Tax Efficiency</h3>
              
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-dim)' }}>Efficiency Score</p>
                  <p className="text-4xl font-extrabold text-[var(--text-main)]">88<span className="text-lg font-normal" style={{ color: 'var(--text-muted)' }}>/100</span></p>
                  
                  <p className="text-xs font-bold mt-6 mb-1" style={{ color: 'var(--text-dim)' }}>Annual Savings</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>$86,234.37</p>
                </div>
                <div className="w-24 h-24 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={[{value: 88}, {value: 12}]} innerRadius={35} outerRadius={48} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                        <Cell fill={chartTheme.primary} />
                        <Cell fill={chartTheme.dim} opacity={0.2} />
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-glow" style={{ background: 'var(--accent-glow-subtle)' }}>
                      <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Market Risk Analysis */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 md:col-span-4 lg:col-span-4 glass-card-lg p-6 relative card-hover">
              <MoreVertical className="w-4 h-4 absolute top-6 right-6" style={{ color: 'var(--text-dim)' }} />
              <h3 className="font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2 text-[var(--text-muted)]"><LineChart className="w-4 h-4" /> Risk Analysis</h3>
              
              <div className="mb-2">
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-dim)' }}>Risk Profile</p>
                <p className="text-xl font-bold" style={{ color: 'var(--accent-secondary)' }}>Balanced</p>
              </div>

              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={marketRiskChart}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={1}/>
                        <stop offset="95%" stopColor={chartTheme.secondary} stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="value" stroke="url(#colorRisk)" strokeWidth={3} dot={{ r: 3, fill: chartTheme.primary, strokeWidth: 0 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center mt-2 border-t pt-3" style={{ borderColor: 'var(--border-card)' }}>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-dim)' }}>Volatility</p>
                  <p className="text-sm font-bold text-[var(--text-main)]">13.8%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-dim)' }}>Drawdown</p>
                  <p className="text-sm font-bold text-rose-400">-9.8%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-dim)' }}>Beta</p>
                  <p className="text-sm font-bold text-[var(--text-main)]">0.98</p>
                </div>
              </div>
            </motion.div>

            {/* Ethical Investment Insights */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 md:col-span-4 lg:col-span-3 glass-card-lg p-6 relative card-hover">
              <MoreVertical className="w-4 h-4 absolute top-6 right-6" style={{ color: 'var(--text-dim)' }} />
              <h3 className="font-bold uppercase tracking-wider text-xs mb-6 flex items-center gap-2 text-[var(--text-muted)]"><Leaf className="w-4 h-4" /> Ethical Insights</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Environment', score: 74, color: 'var(--accent-primary)' },
                  { label: 'Governance', score: 68, color: 'var(--accent-secondary)' },
                  { label: 'Social Impact', score: 58, color: 'var(--text-dim)' },
                  { label: 'Sustainability', score: 95, color: 'var(--accent-primary)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>{item.label}</span>
                        <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{item.score}/100</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
                        <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Asset Allocation */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-2 lg:row-span-2 p-6 rounded-3xl relative overflow-hidden flex flex-col group" style={{ background: 'var(--accent-gradient)' }}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="font-bold text-xs uppercase tracking-wider mb-6 relative z-10 text-white/90">Asset Allocation</h3>
              
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 mb-8">
                <div className="w-40 h-40 relative group-hover:scale-105 transition-transform duration-500">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={assetAllocation} innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? 'white' : `rgba(255,255,255,${1 - index * 0.25})`} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold text-white">100%</span>
                    <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest">Total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative z-10 mt-auto">
                {assetAllocation.map((item, index) => (
                  <div key={item.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: index === 0 ? 'white' : `rgba(255,255,255,${1 - index * 0.25})` }} />
                      <span className="text-white/90 font-medium">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ROW 3 */}
            
            {/* Retrospective Fund Comparison */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-10 glass-card-lg p-6 flex flex-col lg:flex-row gap-8 card-hover">
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold uppercase tracking-wider text-xs text-[var(--text-muted)]">Retrospective Comparison</h3>
                  <div className="flex gap-1 p-1 rounded-lg border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                    <button className="px-3 py-1 text-[10px] font-bold rounded-md shadow-sm text-white" style={{ background: 'var(--accent-gradient)' }}>1Y</button>
                    <button className="px-3 py-1 text-[10px] font-bold rounded-md transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]">3Y</button>
                    <button className="px-3 py-1 text-[10px] font-bold rounded-md transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]">5Y</button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }} /> Fund A (ESG)</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-1 rounded-full" style={{ background: 'var(--accent-secondary)' }} /> Benchmark</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-dim)' }} /> Fund B (SRI)</div>
                </div>

                <div className="h-56 w-full relative -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fundComparisonData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fundA" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke={chartTheme.dim} fontSize={10} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke={chartTheme.dim} fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} dx={-5} />
                      <Tooltip cursor={{ stroke: chartTheme.dim, strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="fundA" stroke={chartTheme.primary} strokeWidth={2} fillOpacity={1} fill="url(#fundA)" activeDot={{ r: 4, strokeWidth: 0, fill: chartTheme.primary }} />
                      <Area type="monotone" dataKey="fundB" stroke={chartTheme.dim} strokeWidth={2} fill="none" />
                      <Area type="monotone" dataKey="benchmark" stroke={chartTheme.secondary} strokeWidth={2} fill="none" strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table */}
              <div className="w-full lg:w-[450px] flex flex-col justify-center">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-card)' }}>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Fund</th>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>1Y Ret</th>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>ESG</th>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider text-right" style={{ color: 'var(--text-dim)' }}>Sharpe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b transition-colors hover:bg-[var(--bg-card-hover)]" style={{ borderColor: 'var(--border-card)' }}>
                      <td className="py-4 font-bold text-[var(--text-main)]">Fund A (ESG)</td>
                      <td className="py-4 font-bold" style={{ color: 'var(--accent-primary)' }}>+22.12%</td>
                      <td className="py-4 font-bold text-[var(--text-main)]">88</td>
                      <td className="py-4 font-bold text-[var(--text-main)] text-right">1.24</td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-[var(--bg-card-hover)]" style={{ borderColor: 'var(--border-card)' }}>
                      <td className="py-4 font-bold text-[var(--text-main)]">Benchmark</td>
                      <td className="py-4 font-bold" style={{ color: 'var(--accent-primary)' }}>+15.50%</td>
                      <td className="py-4 font-bold text-[var(--text-muted)]">-</td>
                      <td className="py-4 font-bold text-[var(--text-main)] text-right">0.88</td>
                    </tr>
                    <tr className="transition-colors hover:bg-[var(--bg-card-hover)]">
                      <td className="py-4 font-bold text-[var(--text-main)]">Fund B (SRI)</td>
                      <td className="py-4 font-bold" style={{ color: 'var(--accent-primary)' }}>+18.50%</td>
                      <td className="py-4 font-bold text-[var(--text-main)]">79</td>
                      <td className="py-4 font-bold text-[var(--text-main)] text-right">1.08</td>
                    </tr>
                  </tbody>
                </table>
                <button className="mt-6 text-xs font-bold flex items-center gap-1 transition-colors hover:text-[var(--text-main)]" style={{ color: 'var(--accent-primary)' }}>
                  View Full Report →
                </button>
              </div>

            </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
