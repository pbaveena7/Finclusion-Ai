import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palmtree, MapPin, Search, Bell, Sparkles, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine 
} from 'recharts';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import { useStore } from '../store/useStore';
import ScrollReveal from '../components/animations/ScrollReveal';

export default function Retirement() {
  const { user } = useStore();
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(55);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  
  const [currentSavings, setCurrentSavings] = useState<number>(500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(25000);
  
  const [expectedReturn, setExpectedReturn] = useState<number>(12); // pre-retirement CAGR
  const [inflationRate, setInflationRate] = useState<number>(6); // inflation
  
  const [monthlyExpenseToday, setMonthlyExpenseToday] = useState<number>(50000);

  // FIRE Calculations
  const yearsToRetire = retirementAge - currentAge;
  const retirementYears = lifeExpectancy - retirementAge;
  
  // Future Value of monthly expenses at retirement (due to inflation)
  const futureMonthlyExpense = monthlyExpenseToday * Math.pow(1 + inflationRate / 100, yearsToRetire);
  
  // Target Corpus based on 4% rule (adjusted for Indian context, maybe 3% or 4%)
  const safeWithdrawalRate = 0.04; 
  const targetCorpus = (futureMonthlyExpense * 12) / safeWithdrawalRate;

  // Calculate actual projected corpus at retirement
  const r = expectedReturn / 12 / 100;
  const n = yearsToRetire * 12;
  const futureValueOfSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetire);
  const futureValueOfSIP = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const projectedCorpus = futureValueOfSavings + futureValueOfSIP;

  const isAchievable = projectedCorpus >= targetCorpus;
  const shortfall = targetCorpus - projectedCorpus;

  // Chart Data
  const chartData = [];
  let currentVal = currentSavings;
  for (let age = currentAge; age <= retirementAge; age++) {
    chartData.push({
      age,
      value: Math.round(currentVal),
      target: targetCorpus
    });
    // Add 1 year of SIP and growth
    currentVal = currentVal * (1 + expectedReturn / 100) + (monthlyContribution * 12);
  }

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="retirement" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto">
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <Palmtree className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">FIRE & Retirement</h1>
              <p className="text-xs text-[var(--text-muted)]">Financial Independence, Retire Early</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeSelector />
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <ScrollReveal delay={0.1} className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 card-hover">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--text-muted)]">Time Horizon</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Current Age</label>
                  <input type="number" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))} className="glass-input w-full p-2.5 rounded-xl text-sm font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Retire Age</label>
                  <input type="number" value={retirementAge} onChange={e => setRetirementAge(Number(e.target.value))} className="glass-input w-full p-2.5 rounded-xl text-sm font-bold" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 card-hover">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--text-muted)]">Financials</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold mb-1.5 flex justify-between">Current Savings <span>₹{currentSavings.toLocaleString()}</span></label>
                  <input type="range" min="0" max="10000000" step="50000" value={currentSavings} onChange={e => setCurrentSavings(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1.5 flex justify-between">Monthly SIP <span>₹{monthlyContribution.toLocaleString()}</span></label>
                  <input type="range" min="0" max="500000" step="1000" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1.5 flex justify-between">Monthly Expense Today <span>₹{monthlyExpenseToday.toLocaleString()}</span></label>
                  <input type="range" min="10000" max="500000" step="5000" value={monthlyExpenseToday} onChange={e => setMonthlyExpenseToday(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 card-hover">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--text-muted)]">Assumptions</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold mb-1.5 block">Expected Return (%)</label>
                  <input type="number" value={expectedReturn} onChange={e => setExpectedReturn(Number(e.target.value))} className="glass-input w-full p-2 rounded-lg text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold mb-1.5 block">Inflation (%)</label>
                  <input type="number" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="glass-input w-full p-2 rounded-lg text-sm font-bold" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Visualization Section */}
          <ScrollReveal delay={0.2} className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 border-2 card-hover" style={{ borderColor: isAchievable ? 'var(--accent-primary)' : 'rgba(244,63,94,0.5)' }}>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">Projected Corpus at Age {retirementAge}</p>
                <p className="text-4xl font-extrabold text-[var(--text-main)]">₹{(projectedCorpus / 10000000).toFixed(2)} Cr</p>
                <p className="text-xs mt-2 font-bold" style={{ color: isAchievable ? 'var(--accent-primary)' : 'rgb(244,63,94)' }}>
                  {isAchievable ? '✅ You are on track to retire early!' : `⚠️ Shortfall of ₹${(shortfall / 10000000).toFixed(2)} Cr`}
                </p>
              </div>

              <div className="glass-card p-6 card-hover">
                <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">Target Corpus Needed</p>
                <p className="text-4xl font-extrabold" style={{ color: 'var(--accent-secondary)' }}>₹{(targetCorpus / 10000000).toFixed(2)} Cr</p>
                <p className="text-xs mt-2 text-[var(--text-muted)] font-medium">
                  To sustain ₹{Math.round(futureMonthlyExpense).toLocaleString()} /mo at retirement
                </p>
              </div>
            </div>

            <div className="glass-card-lg p-6 card-hover">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-6"><TrendingUp className="w-4 h-4 text-[var(--accent-primary)]"/> Wealth Growth vs Target</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="age" stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `Age ${v}`} />
                    <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/10000000).toFixed(0)}Cr`} dx={-10} />
                    <ReferenceLine y={targetCorpus} stroke="var(--accent-secondary)" strokeDasharray="4 4" label={{ value: 'FIRE Target', fill: 'var(--accent-secondary)', fontSize: 10, position: 'insideTopLeft' }} />
                    <Tooltip 
                      formatter={(v: any) => [`₹${(Number(v)/10000000).toFixed(2)} Cr`, 'Projected']}
                      labelFormatter={v => `Age ${v}`}
                      contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#fireGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Actionable Advice */}
            {!isAchievable && (
              <div className="p-4 rounded-2xl border bg-rose-500/10 border-rose-500/20 text-sm font-medium">
                <strong className="text-rose-400 block mb-1">To reach your goal, you need to:</strong>
                <ul className="list-disc pl-5 space-y-1 text-rose-300/80">
                  <li>Increase your SIP by ₹{Math.round(shortfall / (((Math.pow(1 + r, n) - 1) / r) * (1 + r))).toLocaleString('en-IN')} per month</li>
                  <li>Or delay retirement by roughly {Math.ceil(Math.log(targetCorpus/projectedCorpus) / Math.log(1 + expectedReturn/100))} years</li>
                </ul>
              </div>
            )}
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
