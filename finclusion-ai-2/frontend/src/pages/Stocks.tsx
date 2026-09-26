import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Leaf, LayoutDashboard, LineChart, PieChart, 
  Wallet, Sprout, FileText, Settings, Headphones, HelpCircle,
  TrendingUp, TrendingDown, BrainCircuit, Activity, ChevronDown, Sparkles
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, Line, AreaChart, Area, XAxis, YAxis, 
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { topStocks, sectorPerformance } from '../data/marketData';
import { useStore } from '../store/useStore';
import { fetchIndices } from '../api';
import Sidebar from '../components/Sidebar';
import ScrollReveal from '../components/animations/ScrollReveal';

export default function Stocks() {
  const user = useStore(state => state.user);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [activeIndex, setActiveIndex] = useState<string>('NIFTY');

  // Options payoff state
  const [optionType, setOptionType] = useState<'CE'|'PE'>('CE');
  const [strike, setStrike] = useState<number>(24500);
  const [premium, setPremium] = useState<number>(150);
  const [lotSize, setLotSize] = useState<number>(50);

  const chartData = [];
  const minSpot = strike * 0.85;
  const maxSpot = strike * 1.15;
  const step = (maxSpot - minSpot) / 20;
  for (let spot = minSpot; spot <= maxSpot; spot += step) {
    let grossPayoff = 0;
    if (optionType === 'CE' && spot > strike) grossPayoff = (spot - strike) * lotSize;
    else if (optionType === 'PE' && spot < strike) grossPayoff = (strike - spot) * lotSize;
    const netPL = grossPayoff - (premium * lotSize);
    chartData.push({ spot: Math.round(spot), pl: Math.round(netPL) });
  }
  const breakEven = optionType === 'CE' ? strike + premium : strike - premium;
  const maxLoss = premium * lotSize;

  const sectors = ['All', ...Array.from(new Set(topStocks.map(s => s.sector)))];
  const filteredStocks = topStocks.filter(s => 
    (selectedSector === 'All' || s.sector === selectedSector) &&
    (s.symbol.includes(searchQuery.toUpperCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const [liveIndices, setLiveIndices] = useState<{nifty: any[], sensex: any[]}>({nifty: [], sensex: []});

  useEffect(() => {
    fetchIndices().then(data => setLiveIndices(data)).catch(console.error);
  }, []);

  const indexData = activeIndex === 'NIFTY' ? liveIndices.nifty : liveIndices.sensex;
  
  let indexCurrent = 0, indexPrev = 0, indexChange = '0.00', indexUp = true;
  if (indexData.length > 1) {
    indexCurrent = indexData[indexData.length - 1]?.close;
    indexPrev = indexData[indexData.length - 2]?.close;
    indexChange = ((indexCurrent - indexPrev) / indexPrev * 100).toFixed(2);
    indexUp = parseFloat(indexChange) >= 0;
  }

  // Fallback dummy data if API fails to load history for top boxes
  const niftyCurrent = liveIndices.nifty.length ? liveIndices.nifty[liveIndices.nifty.length-1].close : 24350;
  const niftyPrev = liveIndices.nifty.length > 1 ? liveIndices.nifty[liveIndices.nifty.length-2].close : 24200;
  
  const sensexCurrent = liveIndices.sensex.length ? liveIndices.sensex[liveIndices.sensex.length-1].close : 79800;
  const sensexPrev = liveIndices.sensex.length > 1 ? liveIndices.sensex[liveIndices.sensex.length-2].close : 79500;

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="investments" />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 h-screen overflow-y-auto">
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              placeholder="Search stocks, indices..." 
              className="glass-input w-full rounded-full py-2 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <Bell className="w-4 h-4 text-[var(--text-main)]" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-1 tracking-tight text-[var(--text-main)]">Investments</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Markets & Stocks Overview</p>
          </div>

          {/* Index Cards */}
          <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { name: 'NIFTY 50', val: niftyCurrent, prev: niftyPrev },
              { name: 'SENSEX', val: sensexCurrent, prev: sensexPrev },
              { name: 'BANK NIFTY', val: 52340, prev: 51900 },
              { name: 'NIFTY IT', val: 38920, prev: 38450 },
            ].map(idx => {
              const chg = ((idx.val - idx.prev) / idx.prev * 100);
              const up = chg >= 0;
              const isActive = activeIndex === idx.name;
              return (
                <div 
                  key={idx.name}
                  onClick={() => setActiveIndex(idx.name)}
                  className={`glass-card p-5 cursor-pointer transition-all duration-300 card-hover ${isActive ? 'bg-[var(--bg-card-hover)] shadow-glow-sm' : 'hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]'}`}
                  style={isActive ? { borderColor: 'var(--accent-primary)' } : {}}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>{idx.name}</p>
                  <p className="text-2xl font-extrabold text-[var(--text-main)]">₹{idx.val.toLocaleString('en-IN')}</p>
                  <p className={`text-sm font-bold flex items-center gap-1 mt-1 ${up ? 'text-[var(--accent-primary)]' : 'text-rose-500'}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {up ? '+' : ''}{chg.toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
          </ScrollReveal>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} initial="hidden" animate="show" className="grid grid-cols-12 gap-6 mb-8">
            {/* Index Chart */}
            <div className="col-span-12 lg:col-span-8 glass-card-lg p-6 card-hover">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{activeIndex} — 1 Year Performance</h3>
                  <p className={`text-lg font-bold flex items-center gap-2 ${indexUp ? 'text-[var(--accent-primary)]' : 'text-rose-500'}`}>
                    {indexCurrent?.toLocaleString('en-IN')}
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: indexUp ? 'var(--accent-glow-subtle)' : 'rgba(244,63,94,0.1)' }}>
                      {indexUp ? '▲' : '▼'} {Math.abs(parseFloat(indexChange))}%
                    </span>
                  </p>
                </div>
                <Activity className="w-6 h-6 animate-pulse" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div className="h-[250px] -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={indexData.map(d => ({ date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), close: d.close }))}>
                    <defs>
                      <linearGradient id="indexGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} interval={5} dy={10} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => v.toLocaleString('en-IN')} dx={0} />
                    <RechartsTooltip cursor={{ stroke: 'var(--text-dim)', strokeWidth: 1, strokeDasharray: '4 4' }} formatter={(val: any) => [val.toLocaleString('en-IN'), activeIndex]} />
                    <Area type="monotone" dataKey="close" stroke="var(--accent-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#indexGrad)" dot={false} activeDot={{ r: 6, fill: 'var(--accent-primary)', stroke: 'var(--bg-base)', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sector Performance */}
            <div className="col-span-12 lg:col-span-4 rounded-3xl p-6 relative flex flex-col group overflow-hidden border card-hover" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: 'var(--accent-secondary)' }} />
              <h3 className="font-bold uppercase tracking-wider text-xs mb-6 relative z-10" style={{ color: 'var(--text-main)' }}>Sector Performance (1Y)</h3>
              <div className="h-[220px] relative z-10 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorPerformance} barCategoryGap="20%">
                    <XAxis dataKey="sector" stroke="var(--text-dim)" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <RechartsTooltip cursor={{ fill: 'var(--border-card)' }} formatter={(val: any) => [`+${val}%`, 'Returns']} />
                    <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                      {sectorPerformance.map((entry, i) => (
                        <Cell key={i} fill={i % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Smart Watchlist */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} initial="hidden" animate="show" className="mb-8 glass-card-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-main)]">
                <BrainCircuit className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} /> Smart Watchlist
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search stocks..."
                    className="glass-input py-2 pl-9 pr-4 w-48 rounded-full"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sectors.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSector(s)} 
                      className={selectedSector === s ? 'pill-active' : 'pill-inactive'}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStocks.map((stock, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={stock.symbol} 
                  className="glass-card overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] card-hover"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-extrabold text-lg text-[var(--text-main)]">{stock.symbol}</h4>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{stock.name}</p>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border" style={{ color: 'var(--accent-primary)', background: 'var(--accent-glow-subtle)', borderColor: 'var(--border-card)' }}>
                          {stock.sector}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-lg text-[var(--text-main)]">₹{stock.price.toLocaleString('en-IN')}</p>
                        <p className={`text-xs font-bold flex items-center justify-end gap-0.5 mt-0.5 ${stock.change >= 0 ? 'text-[var(--accent-primary)]' : 'text-rose-500'}`}>
                          {stock.change >= 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </p>
                      </div>
                    </div>

                    <div className="h-16 w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={(stock.history ?? stock.historicalPrices ?? []).slice(-20)}>
                          <Line type="monotone" dataKey="close" stroke={stock.change >= 0 ? 'var(--accent-primary)' : '#f43f5e'} strokeWidth={2.5} dot={false} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                      <div className="rounded-lg p-2 text-center border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                        <p className="font-medium uppercase tracking-wider mb-0.5 text-[10px]" style={{ color: 'var(--text-dim)' }}>P/E</p>
                        <p className="font-bold text-[var(--text-main)]">{stock.pe}</p>
                      </div>
                      <div className="rounded-lg p-2 text-center border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                        <p className="font-medium uppercase tracking-wider mb-0.5 text-[10px]" style={{ color: 'var(--text-dim)' }}>52W H</p>
                        <p className="font-bold" style={{ color: 'var(--accent-primary)' }}>₹{((stock.high52w ?? stock.yearHigh)/1000).toFixed(1)}k</p>
                      </div>
                      <div className="rounded-lg p-2 text-center border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                        <p className="font-medium uppercase tracking-wider mb-0.5 text-[10px]" style={{ color: 'var(--text-dim)' }}>52W L</p>
                        <p className="font-bold text-rose-400">₹{((stock.low52w ?? stock.yearLow)/1000).toFixed(1)}k</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setExpandedStock(expandedStock === stock.symbol ? null : stock.symbol)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all text-xs border"
                      style={{ 
                        background: expandedStock === stock.symbol ? 'var(--accent-glow-subtle)' : 'var(--input-bg)', 
                        borderColor: expandedStock === stock.symbol ? 'var(--accent-primary)' : 'var(--border-card)',
                        color: expandedStock === stock.symbol ? 'var(--text-main)' : 'var(--accent-primary)'
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> 
                      {expandedStock === stock.symbol ? 'Hide Insights' : 'AI Insights'}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedStock === stock.symbol && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t"
                        style={{ borderColor: 'var(--border-card)', background: 'var(--bg-surface)' }}
                      >
                        <div className="p-5 space-y-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--accent-primary)' }}>Strengths</p>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Strong revenue growth and market leadership in the {stock.sector} sector. Consistent dividend history.</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--accent-secondary)' }}>Risks</p>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Exposure to macro headwinds and interest rate sensitivity. Monitor global cues closely.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Options Payoff Analyzer */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} initial="hidden" animate="show" className="glass-card-lg p-6 mb-8 card-hover">
            <h3 className="text-xl font-bold mb-2 text-[var(--text-main)]">Options Payoff Analyzer</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Visualize P&L at expiry for Nifty options.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="glass-card p-6">
                  <div className="flex gap-2 p-1 rounded-xl border mb-6" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                    <button 
                      onClick={() => setOptionType('CE')} 
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${optionType === 'CE' ? 'text-white shadow-glow' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                      style={optionType === 'CE' ? { background: 'var(--accent-gradient)' } : {}}
                    >
                      CALL (CE)
                    </button>
                    <button 
                      onClick={() => setOptionType('PE')} 
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${optionType === 'PE' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                      PUT (PE)
                    </button>
                  </div>

                  {[
                    { label: 'Strike Price', value: strike, min: 22000, max: 27000, step: 100, setter: setStrike, fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
                    { label: 'Premium Paid', value: premium, min: 10, max: 500, step: 5, setter: setPremium, fmt: (v: number) => `₹${v}` },
                    { label: 'Lot Size', value: lotSize, min: 25, max: 200, step: 25, setter: setLotSize, fmt: (v: number) => `${v} units` },
                  ].map(f => (
                    <div key={f.label} className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{f.label}</label>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg border tabular-nums" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}>{f.fmt(f.value)}</span>
                      </div>
                      <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} className="w-full" />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <div className="rounded-xl p-4 text-center border" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent-primary)' }}>Break-even</p>
                      <p className="font-extrabold text-sm text-[var(--text-main)]">₹{breakEven.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="rounded-xl p-4 text-center border bg-rose-500/10 border-rose-500/20">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-rose-400">Max Loss</p>
                      <p className="font-extrabold text-sm text-[var(--text-main)]">₹{maxLoss.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 glass-card p-6">
                <h4 className="font-bold uppercase tracking-wider text-xs mb-6 text-[var(--text-muted)]">Payoff at Expiry</h4>
                <div className="h-[300px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="plGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="spot" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} dy={10} />
                      <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v >= 0 ? '+' : ''}${(v/1000).toFixed(1)}k`} dx={0} />
                      <ReferenceLine y={0} stroke="var(--border-card)" strokeDasharray="4 4" />
                      <ReferenceLine x={breakEven} stroke="var(--accent-primary)" strokeDasharray="4 4" label={{ value: 'B/E', fill: 'var(--accent-primary)', fontSize: 10, position: 'insideTopLeft' }} />
                      <RechartsTooltip 
                        cursor={{ stroke: 'var(--text-dim)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net P&L']}
                        labelFormatter={(l) => `Spot: ₹${Number(l).toLocaleString('en-IN')}`}
                      />
                      <Area type="monotone" dataKey="pl" stroke="var(--accent-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#plGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
