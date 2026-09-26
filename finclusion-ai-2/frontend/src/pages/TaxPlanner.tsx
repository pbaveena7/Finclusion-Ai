import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Receipt, TrendingDown, ArrowRight, ShieldCheck, 
  Search, Bell, Sparkles, CheckCircle2 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import { useStore } from '../store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ScrollReveal from '../components/animations/ScrollReveal';

export default function TaxPlanner() {
  const { user } = useStore();
  const [income, setIncome] = useState<number>(1200000);
  const [sec80c, setSec80c] = useState<number>(150000);
  const [sec80d, setSec80d] = useState<number>(25000);
  const [hra, setHra] = useState<number>(100000);

  // Simplified Indian Tax Calculation Logic (FY 2024-25)
  // New Regime (Default)
  const calculateNewRegime = (salary: number) => {
    let tax = 0;
    // Standard deduction
    const taxable = Math.max(0, salary - 50000); 
    if (taxable <= 700000) return 0; // Rebate under 87A

    if (taxable > 300000) tax += Math.min(300000, taxable - 300000) * 0.05;
    if (taxable > 600000) tax += Math.min(300000, taxable - 600000) * 0.10;
    if (taxable > 900000) tax += Math.min(300000, taxable - 900000) * 0.15;
    if (taxable > 1200000) tax += Math.min(300000, taxable - 1200000) * 0.20;
    if (taxable > 1500000) tax += (taxable - 1500000) * 0.30;
    
    return tax * 1.04; // 4% cess
  };

  // Old Regime
  const calculateOldRegime = (salary: number, d80c: number, d80d: number, dHra: number) => {
    let tax = 0;
    // Deductions
    const totalDeductions = 50000 + Math.min(150000, d80c) + d80d + dHra;
    const taxable = Math.max(0, salary - totalDeductions);
    
    if (taxable <= 500000) return 0; // Rebate under 87A

    if (taxable > 250000) tax += Math.min(250000, taxable - 250000) * 0.05;
    if (taxable > 500000) tax += Math.min(500000, taxable - 500000) * 0.20;
    if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;

    return tax * 1.04;
  };

  const newTax = calculateNewRegime(income);
  const oldTax = calculateOldRegime(income, sec80c, sec80d, hra);
  const diff = Math.abs(newTax - oldTax);
  const betterRegime = newTax <= oldTax ? 'New Regime' : 'Old Regime';
  
  const oldRegimeData = [
    { name: 'Tax Paid', value: oldTax, color: 'var(--accent-secondary)' },
    { name: 'Take Home', value: income - oldTax, color: 'var(--text-dim)' },
  ];
  const newRegimeData = [
    { name: 'Tax Paid', value: newTax, color: 'var(--accent-primary)' },
    { name: 'Take Home', value: income - newTax, color: 'var(--text-dim)' },
  ];

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="tax" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto">
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">Tax Planner</h1>
              <p className="text-xs text-[var(--text-muted)]">Optimize your FY 2024-25 taxes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeSelector />
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <ScrollReveal delay={0.1} className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 card-hover">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--text-muted)]">Income & Deductions</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Total Annual Income (₹)</label>
                  <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="glass-input w-full p-3 rounded-xl text-lg font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Section 80C (ELSS, PPF, LIC)</label>
                  <input type="number" value={sec80c} onChange={e => setSec80c(Number(e.target.value))} className="glass-input w-full p-3 rounded-xl" />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">Max deduction allowed: ₹1,50,000</p>
                </div>
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Section 80D (Health Insurance)</label>
                  <input type="number" value={sec80d} onChange={e => setSec80d(Number(e.target.value))} className="glass-input w-full p-3 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1.5 block">HRA / Other Exemptions</label>
                  <input type="number" value={hra} onChange={e => setHra(Number(e.target.value))} className="glass-input w-full p-3 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-[var(--accent-primary)] border relative overflow-hidden card-hover">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--accent-gradient)' }} />
              <h3 className="text-sm font-extrabold flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-[var(--accent-primary)]"/> AI Suggestion</h3>
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                Based on your deductions of ₹{(sec80c + sec80d + hra).toLocaleString('en-IN')}, the <strong className="text-[var(--text-main)]">{betterRegime}</strong> is significantly better for you, saving you ₹{diff.toLocaleString('en-IN')} in taxes.
              </p>
            </div>
          </ScrollReveal>

          {/* Results Section */}
          <ScrollReveal delay={0.2} className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Old Regime Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card p-6 border-2 transition-all card-hover ${betterRegime === 'Old Regime' ? 'border-[var(--accent-primary)] shadow-glow-sm' : 'border-[var(--border-card)]'}`}>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-lg">Old Regime</h3>
                  {betterRegime === 'Old Regime' && <span className="bg-[var(--accent-primary)] text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md">Recommended</span>}
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">Total Tax Liability</p>
                  <p className="text-4xl font-black text-rose-500">₹{Math.round(oldTax).toLocaleString('en-IN')}</p>
                </div>

                <div className="h-32 w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={oldRegimeData} innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                        {oldRegimeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <ul className="text-xs space-y-2 text-[var(--text-muted)]">
                  <li className="flex justify-between"><span>Gross Income:</span> <span>₹{income.toLocaleString()}</span></li>
                  <li className="flex justify-between text-[var(--accent-secondary)]"><span>Total Deductions:</span> <span>-₹{(50000 + Math.min(150000, sec80c) + sec80d + hra).toLocaleString()}</span></li>
                  <li className="flex justify-between font-bold border-t pt-2 border-white/10 text-[var(--text-main)]"><span>Take Home:</span> <span>₹{Math.round(income - oldTax).toLocaleString()}</span></li>
                </ul>
              </motion.div>

              {/* New Regime Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`glass-card p-6 border-2 transition-all card-hover ${betterRegime === 'New Regime' ? 'border-[var(--accent-primary)] shadow-glow-sm' : 'border-[var(--border-card)]'}`}>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-lg">New Regime</h3>
                  {betterRegime === 'New Regime' && <span className="bg-[var(--accent-primary)] text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md">Recommended</span>}
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">Total Tax Liability</p>
                  <p className="text-4xl font-black text-rose-500">₹{Math.round(newTax).toLocaleString('en-IN')}</p>
                </div>

                <div className="h-32 w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={newRegimeData} innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                        {newRegimeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <ul className="text-xs space-y-2 text-[var(--text-muted)]">
                  <li className="flex justify-between"><span>Gross Income:</span> <span>₹{income.toLocaleString()}</span></li>
                  <li className="flex justify-between text-[var(--accent-primary)]"><span>Standard Deduction:</span> <span>-₹50,000</span></li>
                  <li className="flex justify-between font-bold border-t pt-2 border-white/10 text-[var(--text-main)]"><span>Take Home:</span> <span>₹{Math.round(income - newTax).toLocaleString()}</span></li>
                </ul>
              </motion.div>

            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
