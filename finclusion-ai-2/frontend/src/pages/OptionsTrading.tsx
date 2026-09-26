import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, TrendingUp, TrendingDown, Activity, Search, Bell,
  ArrowUpRight, ArrowDownRight, Info, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from 'recharts';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';

const OPTIONS_CHAIN = [
  { strike: 22700, ce_ltp: 88.5,  ce_oi: 1842500, ce_iv: 12.4, pe_ltp: 3.45,  pe_oi: 540000,  pe_iv: 11.2, atm: false },
  { strike: 22750, ce_ltp: 55.30, ce_oi: 2540000, ce_iv: 12.0, pe_ltp: 5.90,  pe_oi: 1290000, pe_iv: 11.8, atm: false },
  { strike: 22800, ce_ltp: 31.00, ce_oi: 4180000, ce_iv: 11.8, pe_ltp: 11.50, pe_oi: 2850000, pe_iv: 12.1, atm: false },
  { strike: 22850, ce_ltp: 14.20, ce_oi: 5920000, ce_iv: 11.5, pe_ltp: 24.60, pe_oi: 4210000, pe_iv: 12.5, atm: true  },
  { strike: 22900, ce_ltp: 5.50,  ce_oi: 7810000, ce_iv: 11.2, pe_ltp: 46.00, pe_oi: 3480000, pe_iv: 13.0, atm: false },
  { strike: 22950, ce_ltp: 1.80,  ce_oi: 6540000, ce_iv: 11.0, pe_ltp: 78.00, pe_oi: 2170000, pe_iv: 13.4, atm: false },
  { strike: 23000, ce_ltp: 0.55,  ce_oi: 4930000, ce_iv: 10.8, pe_ltp: 118.5, pe_oi: 1290000, pe_iv: 14.0, atm: false },
];

const maxOI = Math.max(...OPTIONS_CHAIN.flatMap(r => [r.ce_oi, r.pe_oi]));

// Synthetic Nifty tick data for the mini chart
const niftyTicks = Array.from({ length: 48 }, (_, i) => ({
  t: `${9 + Math.floor((i * 13) / 60)}:${String((i * 13) % 60).padStart(2, '0')}`,
  v: 22850 + Math.round(Math.sin(i * 0.3) * 80 + Math.random() * 30 - 15),
}));

// P&L payoff data for long call at 22850 strike
const payoffData = Array.from({ length: 50 }, (_, i) => {
  const spot = 22500 + i * 20;
  const premium = 14.2;
  const strike = 22850;
  const lotSize = 50;
  const pnl = (Math.max(0, spot - strike) - premium) * lotSize;
  return { spot, pnl };
});

export default function OptionsTrading() {
  const [selectedStrike, setSelectedStrike] = useState(22850);
  const [optionType, setOptionType] = useState<'CE' | 'PE'>('CE');
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
  const [lots, setLots] = useState(1);
  const [showPayoff, setShowPayoff] = useState(false);

  const selectedRow = OPTIONS_CHAIN.find(r => r.strike === selectedStrike);
  const premium = selectedRow ? (optionType === 'CE' ? selectedRow.ce_ltp : selectedRow.pe_ltp) : 0;
  const lotSize = 50;
  const totalPremium = premium * lotSize * lots;
  const iv = selectedRow ? (optionType === 'CE' ? selectedRow.ce_iv : selectedRow.pe_iv) : 0;

  const putCallRatio = useMemo(() => {
    const totalCE = OPTIONS_CHAIN.reduce((s, r) => s + r.ce_oi, 0);
    const totalPE = OPTIONS_CHAIN.reduce((s, r) => s + r.pe_oi, 0);
    return (totalPE / totalCE).toFixed(2);
  }, []);

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="options" />
      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto">
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Options Trading</h1>
              <p className="text-xs text-[var(--text-muted)]">NIFTY50 Options Chain & Strategy Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xl font-extrabold">22,850</p>
              <p className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1"><ArrowUpRight className="w-3 h-3" /> +125.30 (+0.55%)</p>
            </div>
            <ThemeSelector />
          </div>
        </header>

        <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Put-Call Ratio', value: putCallRatio, hint: Number(putCallRatio) > 1 ? 'Bearish Bias' : 'Bullish Bias', color: Number(putCallRatio) > 1 ? '#f97316' : '#10b981' },
              { label: 'NIFTY VIX', value: '11.42', hint: 'Low Volatility', color: '#10b981' },
              { label: 'ATM Strike', value: '22,850', hint: 'Current ATM', color: 'var(--accent-primary)' },
              { label: 'Expiry', value: '26 Sep', hint: '1 day to expire', color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="glass-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">{s.label}</p>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-[10px] font-bold mt-1" style={{ color: s.color }}>{s.hint}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Options Chain Table */}
            <div className="xl:col-span-2 glass-card-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">NIFTY Options Chain</h3>
                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="px-2 py-1 rounded" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>■ CE (Calls)</span>
                  <span className="px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>■ PE (Puts)</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider border-b" style={{ color: 'var(--text-dim)', borderColor: 'var(--border-card)' }}>
                      <th className="pb-2 text-right text-emerald-400">CE OI</th>
                      <th className="pb-2 text-right text-emerald-400">IV%</th>
                      <th className="pb-2 text-right text-emerald-400">CE LTP</th>
                      <th className="pb-2 text-center font-extrabold text-[var(--text-main)] px-4">STRIKE</th>
                      <th className="pb-2 text-left text-rose-400">PE LTP</th>
                      <th className="pb-2 text-left text-rose-400">IV%</th>
                      <th className="pb-2 text-left text-rose-400">PE OI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {OPTIONS_CHAIN.map(row => (
                      <motion.tr key={row.strike}
                        onClick={() => setSelectedStrike(row.strike)}
                        className="cursor-pointer transition-colors"
                        style={{ background: selectedStrike === row.strike ? 'var(--accent-glow-subtle)' : row.atm ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                        whileHover={{ backgroundColor: 'var(--bg-card-hover)' }}>
                        {/* CE OI bar */}
                        <td className="py-2.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-1.5 rounded-full bg-emerald-500/30" style={{ width: `${(row.ce_oi / maxOI) * 60}px` }}><div className="h-full rounded-full bg-emerald-500" style={{ width: '100%' }} /></div>
                            <span className="text-[10px] font-mono text-emerald-400">{(row.ce_oi / 1000000).toFixed(1)}M</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-right font-mono text-emerald-400/70">{row.ce_iv}</td>
                        <td className="py-2.5 pr-4 text-right font-bold text-emerald-400">{row.ce_ltp}</td>
                        <td className={`py-2.5 px-4 text-center font-extrabold text-sm ${row.atm ? 'text-amber-400' : 'text-[var(--text-main)]'}`}>
                          {row.strike.toLocaleString()} {row.atm && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded ml-1">ATM</span>}
                        </td>
                        <td className="py-2.5 pl-4 font-bold text-rose-400">{row.pe_ltp}</td>
                        <td className="py-2.5 pl-3 font-mono text-rose-400/70">{row.pe_iv}</td>
                        <td className="py-2.5 pl-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-rose-400">{(row.pe_oi / 1000000).toFixed(1)}M</span>
                            <div className="h-1.5 rounded-full bg-rose-500/30" style={{ width: `${(row.pe_oi / maxOI) * 60}px` }}><div className="h-full rounded-full bg-rose-500" /></div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Builder */}
            <div className="space-y-4">
              <div className="glass-card-lg p-5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Order Builder</h3>

                {/* CE / PE toggle */}
                <div className="flex gap-2 p-1 rounded-xl border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                  {(['CE', 'PE'] as const).map(t => (
                    <button key={t} onClick={() => setOptionType(t)}
                      className="flex-1 py-2 rounded-lg text-xs font-extrabold transition-all"
                      style={optionType === t ? { background: t === 'CE' ? '#10b981' : '#ef4444', color: 'white' } : { color: 'var(--text-muted)' }}>
                      {t === 'CE' ? '📈 CALL' : '📉 PUT'}
                    </button>
                  ))}
                </div>

                {/* BUY / SELL */}
                <div className="flex gap-2 p-1 rounded-xl border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                  {(['BUY', 'SELL'] as const).map(a => (
                    <button key={a} onClick={() => setAction(a)}
                      className="flex-1 py-2 rounded-lg text-xs font-extrabold transition-all"
                      style={action === a ? { background: 'var(--accent-gradient)', color: 'white' } : { color: 'var(--text-muted)' }}>
                      {a}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-[var(--text-muted)] mb-1 font-bold uppercase text-[10px]">Strike</p><p className="font-extrabold text-lg">{selectedStrike.toLocaleString()}</p></div>
                  <div><p className="text-[var(--text-muted)] mb-1 font-bold uppercase text-[10px]">Premium</p><p className="font-extrabold text-lg" style={{ color: 'var(--accent-primary)' }}>₹{premium}</p></div>
                  <div><p className="text-[var(--text-muted)] mb-1 font-bold uppercase text-[10px]">IV</p><p className="font-extrabold text-lg">{iv}%</p></div>
                  <div><p className="text-[var(--text-muted)] mb-1 font-bold uppercase text-[10px]">Lot Size</p><p className="font-extrabold text-lg">50</p></div>
                </div>

                <div>
                  <label className="text-xs font-bold flex justify-between mb-2">Lots <span style={{ color: 'var(--accent-primary)' }}>{lots}</span></label>
                  <input type="range" min="1" max="20" value={lots} onChange={e => setLots(+e.target.value)} className="w-full" />
                </div>

                <div className="p-4 rounded-xl space-y-2 border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                  <div className="flex justify-between text-xs"><span className="text-[var(--text-muted)]">Total Premium</span><span className="font-bold">₹{totalPremium.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[var(--text-muted)]">Max Profit</span><span className="font-bold text-emerald-400">{action === 'BUY' ? 'Unlimited' : `₹${totalPremium.toLocaleString()}`}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[var(--text-muted)]">Max Loss</span><span className="font-bold text-rose-400">{action === 'SELL' ? 'Unlimited' : `₹${totalPremium.toLocaleString()}`}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[var(--text-muted)]">Breakeven</span><span className="font-bold">
                    {optionType === 'CE' ? (selectedStrike + premium).toFixed(2) : (selectedStrike - premium).toFixed(2)}
                  </span></div>
                </div>

                <button onClick={() => setShowPayoff(!showPayoff)}
                  className="w-full py-2 text-xs font-bold rounded-xl border transition-all"
                  style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', background: 'var(--accent-glow-subtle)' }}>
                  {showPayoff ? 'Hide' : 'Show'} P&L Payoff Chart
                </button>

                <button className="btn-primary w-full py-3 text-sm">
                  {action} {optionType} — ₹{premium}/lot
                </button>
              </div>

              {/* Payoff Chart */}
              <AnimatePresence>
                {showPayoff && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card-lg p-5">
                    <h3 className="text-xs font-bold mb-3 uppercase tracking-wider text-[var(--text-muted)]">P&L at Expiry (Long Call)</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={payoffData}>
                          <defs>
                            <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="spot" stroke="var(--text-dim)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={v => v.toLocaleString()} />
                          <YAxis stroke="var(--text-dim)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} dx={-5} />
                          <ReferenceLine y={0} stroke="var(--text-dim)" strokeDasharray="3 3" />
                          <Tooltip formatter={(v: any) => [`₹${v}`, 'P&L']} contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', borderRadius: '8px', fontSize: '10px' }} />
                          <Area type="monotone" dataKey="pnl" stroke="#10b981" strokeWidth={2} fill="url(#pnlGrad)"
                            dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
