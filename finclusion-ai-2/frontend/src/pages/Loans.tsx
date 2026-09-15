import React, { useState } from 'react';
import { 
  Search, Bell, Calculator, Landmark, RefreshCw
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Sidebar';

const BANK_RATES = [
  { bank: 'SBI', home: '8.40%', personal: '11.15%', auto: '8.65%', fd: '7.10%', color: 'var(--accent-primary)' },
  { bank: 'HDFC', home: '8.50%', personal: '10.50%', auto: '8.75%', fd: '7.25%', color: 'var(--accent-secondary)' },
  { bank: 'ICICI', home: '8.75%', personal: '10.75%', auto: '8.90%', fd: '7.10%', color: '#f59e0b' },
  { bank: 'Axis', home: '8.75%', personal: '10.49%', auto: '8.75%', fd: '7.10%', color: '#a855f7' },
];

export default function Loans() {
  const { theme } = useStore();
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const p = amount;
  const r = rate / 12 / 100;
  const n = years * 12;
  const emi = Math.round(p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  const data = [
    { name: 'Principal Amount', value: p, color: 'var(--accent-primary)' },
    { name: 'Total Interest', value: totalInterest, color: 'var(--accent-secondary)' }
  ];

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full font-sans">
      <Sidebar activeId="reports" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              placeholder="Search reports & loans..." 
              className="glass-input w-full rounded-full py-2 pl-11 pr-4 text-sm"
            />
          </div>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <Bell className="w-4 h-4 text-[var(--text-main)]" />
          </button>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-1 tracking-tight">Reports</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loans, EMIs & Interest Rates</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            {/* EMI Calculator */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
              <div className="glass-card-lg p-8 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" style={{ background: 'var(--accent-primary)' }} />
                
                <div className="flex-1 w-full space-y-6 relative z-10">
                  <h2 className="text-xl font-extrabold flex items-center gap-2 mb-6">
                    <Calculator className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} /> Digital EMI Calculator
                  </h2>

                  {[
                    { label: 'Loan Amount', val: amount, min: 100000, max: 20000000, step: 100000, set: setAmount, fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
                    { label: 'Interest Rate', val: rate, min: 5, max: 20, step: 0.1, set: setRate, fmt: (v: number) => `${v}% p.a.` },
                    { label: 'Tenure', val: years, min: 1, max: 30, step: 1, set: setYears, fmt: (v: number) => `${v} Years` },
                  ].map(f => (
                    <div key={f.label} className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{f.label}</label>
                        <span className="text-sm font-extrabold px-3 py-1.5 rounded-lg border tabular-nums" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}>
                          {f.fmt(f.val)}
                        </span>
                      </div>
                      <input 
                        type="range" min={f.min} max={f.max} step={f.step} 
                        value={f.val} onChange={e => f.set(Number(e.target.value))} 
                        className="w-full" 
                      />
                    </div>
                  ))}
                </div>

                <div className="w-full md:w-80 shrink-0 rounded-3xl p-6 border-[8px] relative overflow-hidden z-10" style={{ background: '#0a0a0a', borderColor: 'var(--input-bg)', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.8)' }}>
                  {/* Digital Calculator Top Bar */}
                  <div className="absolute top-2 w-full left-0 flex justify-center gap-2 opacity-20">
                    <div className="w-8 h-1.5 rounded-full" style={{ background: 'var(--text-dim)' }} />
                    <div className="w-8 h-1.5 rounded-full" style={{ background: 'var(--text-dim)' }} />
                  </div>
                  
                  {/* Digital Screen Inner */}
                  <div className="rounded-xl p-5 mt-4 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] border mb-6 relative" style={{ background: '#021810', borderColor: '#064e3b' }}>
                    {/* LCD Scanline effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.02)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none rounded-xl" />
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1 text-left relative z-10" style={{ color: 'rgba(52,211,153,0.6)' }}>Monthly EMI</p>
                    <p className="text-4xl font-mono font-black tracking-tighter text-right relative z-10" style={{ color: '#34d399', textShadow: '0 0 15px rgba(52,211,153,0.5)' }}>
                      {emi.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-widest mt-1 text-right relative z-10" style={{ color: 'rgba(52,211,153,0.6)' }}>INR</p>
                  </div>
                  
                  {/* Classic Chart inside Calculator */}
                  <div className="h-32 w-full relative mb-4 rounded-xl p-2 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={data} innerRadius={25} outerRadius={40} paddingAngle={4} dataKey="value" stroke="none">
                          <Cell fill="#34d399" />
                          <Cell fill="#fbbf24" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-main)', borderRadius: '8px' }} 
                          formatter={(val: any) => [Number(val).toLocaleString('en-IN'), '']} 
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Digital Stats Bottom */}
                  <div className="space-y-3 text-left font-mono text-xs">
                    <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <span className="uppercase" style={{ color: 'rgba(52,211,153,0.7)' }}>Principal</span>
                      <span className="font-bold tracking-tight" style={{ color: '#34d399', textShadow: '0 0 8px rgba(52,211,153,0.3)' }}>{p.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="uppercase" style={{ color: 'rgba(251,191,36,0.7)' }}>Interest</span>
                      <span className="font-bold tracking-tight" style={{ color: '#fbbf24', textShadow: '0 0 8px rgba(251,191,36,0.3)' }}>{totalInterest.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Tips Widget */}
              <div className="rounded-3xl p-6 flex items-start gap-5 border relative overflow-hidden" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-gradient)' }}>
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>Prepayment Strategy</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>Paying just 1 extra EMI every year can reduce your 20-year loan tenure to just 16 years, saving you <strong className="tabular-nums" style={{ color: 'var(--accent-primary)' }}>₹{(totalInterest * 0.2).toLocaleString('en-IN')}</strong> in interest.</p>
                </div>
              </div>
            </div>

            {/* Bank Rates Table */}
            <div className="col-span-12 xl:col-span-4 glass-card-lg p-6 flex flex-col">
              <h2 className="text-xl font-extrabold flex items-center gap-2 mb-6 text-[var(--text-main)]">
                <Landmark className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} /> Live Interest Rates
              </h2>
              
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-card)' }}>
                      <th className="pb-4 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-dim)' }}>Bank</th>
                      <th className="pb-4 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-dim)' }}>Home</th>
                      <th className="pb-4 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-dim)' }}>Personal</th>
                      <th className="pb-4 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-dim)' }}>FD (1Y)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BANK_RATES.map((b) => (
                      <tr key={b.bank} className="border-b transition-colors hover:bg-[var(--bg-card-hover)]" style={{ borderColor: 'var(--border-card)' }}>
                        <td className="py-4 font-bold flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color, boxShadow: `0 0 8px ${b.color}` }} /> 
                          {b.bank}
                        </td>
                        <td className="py-4 font-extrabold tabular-nums" style={{ color: 'var(--accent-primary)' }}>{b.home}</td>
                        <td className="py-4 font-bold tabular-nums" style={{ color: 'var(--text-muted)' }}>{b.personal}</td>
                        <td className="py-4 font-bold tabular-nums" style={{ color: 'var(--text-muted)' }}>{b.fd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button className="w-full mt-6 py-3.5 border rounded-xl font-bold transition-all text-sm hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]" style={{ borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                Compare All Banks
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
