import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, TrendingUp, Building2, Sparkles } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import ScrollReveal from '../components/animations/ScrollReveal';

const BANKS = [
  { name: 'SBI', rate1Y: 6.8, rate3Y: 6.75, rate5Y: 6.5, type: 'PSU' },
  { name: 'HDFC Bank', rate1Y: 7.1, rate3Y: 7.0, rate5Y: 7.0, type: 'Private' },
  { name: 'ICICI Bank', rate1Y: 7.0, rate3Y: 7.0, rate5Y: 7.0, type: 'Private' },
  { name: 'Axis Bank', rate1Y: 7.1, rate3Y: 7.1, rate5Y: 7.0, type: 'Private' },
  { name: 'Kotak Bank', rate1Y: 7.1, rate3Y: 7.0, rate5Y: 6.2, type: 'Private' },
  { name: 'PNB', rate1Y: 6.75, rate3Y: 6.5, rate5Y: 6.5, type: 'PSU' },
  { name: 'Bajaj Finance', rate1Y: 7.48, rate3Y: 7.48, rate5Y: 7.35, type: 'NBFC' },
  { name: 'Shriram Finance', rate1Y: 8.22, rate3Y: 8.22, rate5Y: 8.02, type: 'NBFC' },
];

const FREQ_MAP: Record<string, number> = {
  'Monthly': 12,
  'Quarterly': 4,
  'Half-Yearly': 2,
  'Annually': 1,
  'Cumulative': 0,
};

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(3);
  const [freq, setFreq] = useState('Cumulative');
  const [isSenior, setIsSenior] = useState(false);

  const effectiveRate = isSenior ? rate + 0.5 : rate;

  const { maturity, interest, chartData } = useMemo(() => {
    const n = FREQ_MAP[freq];
    let mat = 0;
    if (n === 0) {
      // Cumulative - compound annually
      mat = principal * Math.pow(1 + effectiveRate / 100, years);
    } else {
      mat = principal * Math.pow(1 + effectiveRate / (100 * n), n * years);
    }
    const interest = mat - principal;

    const chartData = Array.from({ length: years + 1 }, (_, i) => {
      let val = 0;
      if (n === 0) {
        val = principal * Math.pow(1 + effectiveRate / 100, i);
      } else {
        val = principal * Math.pow(1 + effectiveRate / (100 * n), n * i);
      }
      return { year: `Year ${i}`, value: Math.round(val), principal, interest: Math.round(val - principal) };
    });

    return { maturity: mat, interest, chartData };
  }, [principal, effectiveRate, years, freq]);

  const bankComparison = BANKS.map(b => {
    const r = (years <= 1 ? b.rate1Y : years <= 3 ? b.rate3Y : b.rate5Y) + (isSenior ? 0.5 : 0);
    const mat = principal * Math.pow(1 + r / 100, years);
    return { ...b, maturity: mat, interest: mat - principal, rate: r };
  }).sort((a, b) => b.maturity - a.maturity);

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="fd-calculator" />
      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto">
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">FD Calculator</h1>
              <p className="text-xs text-[var(--text-muted)]">Fixed Deposit Maturity & Bank Comparison</p>
            </div>
          </div>
          <ThemeSelector />
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <ScrollReveal delay={0.1} className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 space-y-5 card-hover">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">FD Parameters</h2>

              <div>
                <label className="text-xs font-bold flex justify-between mb-2">
                  Principal Amount <span style={{ color: 'var(--accent-primary)' }}>₹{principal.toLocaleString('en-IN')}</span>
                </label>
                <input type="range" min="10000" max="10000000" step="10000" value={principal} onChange={e => setPrincipal(+e.target.value)} className="w-full" />
              </div>

              <div>
                <label className="text-xs font-bold flex justify-between mb-2">
                  Interest Rate <span style={{ color: 'var(--accent-primary)' }}>{effectiveRate.toFixed(2)}% p.a.</span>
                </label>
                <input type="range" min="4" max="10" step="0.05" value={rate} onChange={e => setRate(+e.target.value)} className="w-full" />
              </div>

              <div>
                <label className="text-xs font-bold flex justify-between mb-2">
                  Tenure <span style={{ color: 'var(--accent-primary)' }}>{years} Years</span>
                </label>
                <input type="range" min="1" max="10" step="1" value={years} onChange={e => setYears(+e.target.value)} className="w-full" />
              </div>

              <div>
                <label className="text-xs font-bold mb-2 block">Compounding Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(FREQ_MAP).map(f => (
                    <button key={f} onClick={() => setFreq(f)}
                      className="text-xs py-2 px-3 rounded-xl border font-bold transition-all"
                      style={freq === f ? { background: 'var(--accent-gradient)', color: 'white', borderColor: 'transparent' } : { background: 'var(--input-bg)', color: 'var(--text-muted)', borderColor: 'var(--border-card)' }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all" style={{ borderColor: isSenior ? 'var(--accent-primary)' : 'var(--border-card)', background: isSenior ? 'var(--accent-glow-subtle)' : 'transparent' }}>
                <input type="checkbox" checked={isSenior} onChange={e => setIsSenior(e.target.checked)} className="w-4 h-4 accent-[var(--accent-primary)]" />
                <div>
                  <p className="text-xs font-bold">Senior Citizen Rate</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Extra +0.50% p.a. benefit</p>
                </div>
              </label>
            </div>

            {/* Result Cards */}
            <div className="space-y-4">
              {[
                { label: 'Maturity Amount', value: `₹${Math.round(maturity).toLocaleString('en-IN')}`, color: 'var(--accent-primary)' },
                { label: 'Total Interest Earned', value: `₹${Math.round(interest).toLocaleString('en-IN')}`, color: 'var(--accent-secondary)' },
                { label: 'Effective Return', value: `${((interest / principal) * 100).toFixed(2)}%`, color: 'var(--text-main)' },
              ].map(card => (
                <div key={card.label} className="glass-card p-4 flex justify-between items-center card-hover">
                  <span className="text-xs font-bold text-[var(--text-muted)]">{card.label}</span>
                  <span className="text-xl font-extrabold" style={{ color: card.color }}>{card.value}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Charts & Comparison */}
          <ScrollReveal delay={0.2} className="lg:col-span-8 space-y-6">
            {/* Growth Chart */}
            <div className="glass-card-lg p-6 card-hover">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> FD Growth Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="fdGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} dx={-5} />
                    <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, '']} contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', borderRadius: '10px' }} />
                    <Area type="monotone" dataKey="interest" name="Interest" stackId="1" stroke="none" fill="var(--accent-secondary)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="principal" name="Principal" stackId="1" stroke="var(--accent-primary)" strokeWidth={2} fill="url(#fdGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bank Comparison */}
            <div className="glass-card-lg p-6 card-hover">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Building2 className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} /> Bank-wise Maturity Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-card)' }}>
                      {['Bank', 'Type', 'Rate', 'Interest Earned', 'Maturity'].map(h => (
                        <th key={h} className="pb-3 pr-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--text-dim)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bankComparison.map((b, i) => (
                      <motion.tr key={b.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        className="hover:bg-[var(--bg-card-hover)] transition-colors">
                        <td className="py-3 pr-4 font-bold">{i === 0 && <Sparkles className="inline w-3 h-3 mr-1 text-amber-400" />}{b.name}</td>
                        <td className="py-3 pr-4">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: 'var(--input-bg)', color: b.type === 'NBFC' ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}>{b.type}</span>
                        </td>
                        <td className="py-3 pr-4 font-bold" style={{ color: 'var(--accent-primary)' }}>{b.rate.toFixed(2)}%</td>
                        <td className="py-3 pr-4 font-mono text-sm" style={{ color: 'var(--accent-secondary)' }}>+₹{Math.round(b.interest).toLocaleString('en-IN')}</td>
                        <td className="py-3 font-extrabold">₹{Math.round(b.maturity).toLocaleString('en-IN')}</td>
                      </motion.tr>
                    ))}
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
