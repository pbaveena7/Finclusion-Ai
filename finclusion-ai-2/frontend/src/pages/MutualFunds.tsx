import React, { useState } from 'react';
import { 
  Search, Bell, Filter, Sparkles, ShieldAlert, ArrowRight, 
  TrendingUp, Star, ChevronDown, Zap, Target
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { mockMutualFunds as mutualFunds } from '../data/mockMutualFunds';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Sidebar';
import ScrollReveal from '../components/animations/ScrollReveal';

const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'low':        { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'moderate':   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
  'high':       { bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/20' },
  'very-high':  { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20' },
};

function getRiskStyle(risk: string) {
  const key = risk.toLowerCase().replace(' ', '-');
  return RISK_COLORS[key] || RISK_COLORS['moderate'];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-[var(--border-card)]'}`} 
        />
      ))}
    </div>
  );
}

export default function MutualFunds() {
  const user = useStore(state => state.user);
  const [activeTab, setActiveTab] = useState<'explore' | 'sip'>('explore');
  const [filter, setFilter] = useState('All');
  const [expandedFund, setExpandedFund] = useState<string | null>(null);

  const [monthlySip, setMonthlySip] = useState(10000);
  const [durationYears, setDurationYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const totalInvested = monthlySip * 12 * durationYears;
  const i = expectedReturn / 100 / 12;
  const n = durationYears * 12;
  const totalValue = Math.round(monthlySip * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const totalReturns = totalValue - totalInvested;

  const sipProjectionData = Array.from({ length: durationYears + 1 }).map((_, year) => {
    const months = year * 12;
    const invested = monthlySip * months;
    const val = months === 0 ? 0 : Math.round(monthlySip * ((Math.pow(1 + i, months) - 1) / i) * (1 + i));
    return { year, invested, val };
  });

  const categories = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'ELSS'];
  const filteredFunds = mutualFunds.filter(f => filter === 'All' || f.category === filter);

  return (
    <div className="flex bg-transparent w-full font-sans text-[var(--text-main)]">
      <Sidebar activeId="analytics" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        {/* Header */}
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex gap-2 p-1.5 rounded-full border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <button 
              onClick={() => setActiveTab('explore')} 
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'explore' 
                  ? 'text-white shadow-glow' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
              style={activeTab === 'explore' ? { background: 'var(--accent-gradient)' } : {}}
            >
              Explore Funds
            </button>
            <button 
              onClick={() => setActiveTab('sip')} 
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'sip' 
                  ? 'text-white shadow-glow' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
              style={activeTab === 'sip' ? { background: 'var(--accent-gradient)' } : {}}
            >
              SIP Calculator
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <Bell className="w-4 h-4 text-[var(--text-main)]" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Mutual Funds</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Explore and compare top-rated funds across categories</p>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'explore' && (
              <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                
                {/* Category Filters */}
                <div className="flex items-center gap-4 mb-8 glass-card p-4">
                  <Filter className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(c => (
                      <button 
                        key={c} 
                        onClick={() => setFilter(c)} 
                        className={filter === c ? 'pill-active' : 'pill-inactive'}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fund Cards */}
                <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredFunds.map((fund, idx) => {
                    const riskStyle = getRiskStyle(fund.risk ?? fund.riskLevel);
                    const isExpanded = expandedFund === (fund.id ?? fund.schemeCode);
                    const riskKey = fund.risk ?? fund.riskLevel;
                    const rating = riskKey === 'low' ? 5 : riskKey === 'moderate' ? 4 : riskKey === 'high' ? 3 : 2;

                    return (
                      <motion.div 
                        key={fund.id ?? fund.schemeCode}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                        className={`glass-card p-6 transition-all duration-300 card-hover ${isExpanded ? 'border-[var(--accent-primary)] shadow-glow-sm bg-[var(--bg-card-hover)]' : 'hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]'}`}
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border" style={{ color: 'var(--accent-primary)', background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                                {fund.category}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}>
                                {fund.risk ?? fund.riskLevel}
                              </span>
                            </div>
                            <h3 className="font-extrabold text-lg leading-snug mb-1 truncate">{fund.name ?? fund.schemeName}</h3>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{fund.category} Fund • Min SIP: ₹{fund.minSip ?? fund.minSIP}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>NAV</p>
                            <p className="text-xl font-extrabold mb-1">₹{fund.nav}</p>
                            <StarRating rating={rating} />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-5">
                          {[
                            { label: '1 Year', value: fund.return1Y ?? fund.returns.oneYear },
                            { label: '3 Year', value: fund.return3Y ?? fund.returns.threeYear },
                            { label: '5 Year', value: fund.return5Y ?? fund.returns.fiveYear },
                          ].map(r => (
                            <div key={r.label} className="rounded-xl p-3 border text-center" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                              <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>{r.label}</p>
                              <p className="text-lg font-extrabold tabular-nums" style={{ color: 'var(--accent-primary)' }}>+{r.value}%</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                            Invest Now <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                           onClick={() => setExpandedFund(isExpanded ? null : (fund.id ?? fund.schemeCode))}
                            className="btn-ghost px-5 flex items-center gap-2"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            {isExpanded ? 'Less' : 'More'}
                          </button>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border-card)' }}>
                                <div className="flex items-start gap-3 rounded-xl p-4 border" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent-gradient)' }}>
                                    <Sparkles className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent-primary)' }}>AI Analysis</p>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                                      {fund.subCategory === 'Large Cap' 
                                        ? 'Low-cost large cap exposure. Good stability anchor for your portfolio with consistent returns.' 
                                        : fund.subCategory === 'Small Cap' 
                                        ? 'High-risk, high-reward. Limit to 10% of portfolio. Best via SIP to average out volatility.' 
                                        : fund.category === 'elss' 
                                        ? 'Best ELSS for tax saving under 80C. 3-year lock-in with superior equity returns.'
                                        : 'Balanced approach with moderate risk. Good for 5+ year investment horizon.'}
                                    </p>
                                    <div className="flex gap-4 mt-3">
                                      <div className="text-xs">
                                        <span style={{ color: 'var(--text-muted)' }}>Expense Ratio: </span>
                                        <span className="font-bold">{(0.5 + idx * 0.12).toFixed(2)}%</span>
                                      </div>
                                      <div className="text-xs">
                                        <span style={{ color: 'var(--text-muted)' }}>AUM: </span>
                                        <span className="font-bold">₹{(2000 + idx * 450).toLocaleString('en-IN')} Cr</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
                </ScrollReveal>
              </motion.div>
            )}

            {activeTab === 'sip' && (
              <motion.div key="sip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Controls Panel */}
                  <ScrollReveal delay={0.1} className="lg:col-span-1 space-y-6">
                    <div className="glass-card-lg p-6 card-hover">
                      <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                        <Target className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} /> SIP Target
                      </h3>
                      
                      {[
                        { label: 'Monthly Investment', val: monthlySip, min: 500, max: 100000, step: 500, set: setMonthlySip, pre: '₹', post: '' },
                        { label: 'Expected Return (p.a)', val: expectedReturn, min: 5, max: 30, step: 1, set: setExpectedReturn, pre: '', post: '%' },
                        { label: 'Time Period', val: durationYears, min: 1, max: 40, step: 1, set: setDurationYears, pre: '', post: ' Years' },
                      ].map(ctrl => (
                        <div key={ctrl.label} className="mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{ctrl.label}</label>
                            <span className="text-sm font-extrabold px-3 py-1.5 rounded-lg border tabular-nums" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)', color: 'var(--accent-primary)' }}>
                              {ctrl.pre}{ctrl.val.toLocaleString('en-IN')}{ctrl.post}
                            </span>
                          </div>
                          <input 
                            type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} 
                            value={ctrl.val} onChange={e => ctrl.set(Number(e.target.value))} 
                          />
                        </div>
                      ))}

                      {/* AI Suggestion */}
                      <div className="mt-6 rounded-xl p-4 border" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent-gradient)' }}>
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent-primary)' }}>AI Tip</p>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-main)' }}>
                              Increasing your SIP by just 10% annually could add an extra <strong style={{ color: 'var(--accent-primary)' }}>₹{Math.round(totalReturns * 0.15 / 100000)}L</strong> to your final corpus.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Results Panel */}
                  <ScrollReveal delay={0.2} className="lg:col-span-2 space-y-6">
                    
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Total Wealth', value: `₹${(totalValue / 100000).toFixed(2)}L`, highlight: true },
                        { label: 'Invested', value: `₹${(totalInvested / 100000).toFixed(2)}L`, highlight: false },
                        { label: 'Returns', value: `₹${(totalReturns / 100000).toFixed(2)}L`, highlight: false },
                      ].map(card => (
                        <div 
                          key={card.label} 
                          className="glass-card p-5 text-center transition-all card-hover"
                          style={card.highlight ? { borderColor: 'var(--accent-primary)', boxShadow: '0 0 20px var(--accent-glow-subtle)' } : {}}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>{card.label}</p>
                          <p className="text-2xl font-extrabold tabular-nums" style={card.highlight ? { color: 'var(--accent-primary)' } : { color: 'var(--text-main)' }}>
                            {card.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="glass-card-lg p-6 card-hover">
                      <h3 className="font-bold mb-6 text-sm">Wealth Projection Over Time</h3>
                      <div className="h-[320px] -ml-4 w-[calc(100%+16px)]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sipProjectionData}>
                            <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--text-dim)" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="var(--text-dim)" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="year" stroke="var(--text-dim)" fontSize={11} 
                              tickLine={false} axisLine={false} tickFormatter={v => `Yr ${v}`} dy={10} 
                            />
                            <YAxis 
                              stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} 
                              tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} dx={0} 
                            />
                            <Tooltip 
                              cursor={{ stroke: 'var(--text-dim)', strokeWidth: 1, strokeDasharray: '4 4' }}
                              formatter={(val: any, name: string) => [
                                `₹${Number(val).toLocaleString('en-IN')}`, 
                                name === 'val' ? 'Total Value' : 'Invested'
                              ]} 
                              labelFormatter={l => `Year ${l}`} 
                            />
                            <Area type="monotone" dataKey="val" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            <Area type="monotone" dataKey="invested" stroke="var(--text-muted)" strokeWidth={2} fillOpacity={1} fill="url(#colorInv)" strokeDasharray="5 5" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center gap-6 mt-4 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-1 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                          Total Value
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-1 rounded-full border-t-2" style={{ borderColor: 'var(--text-muted)', borderStyle: 'dashed', background: 'transparent' }} />
                          Amount Invested
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
