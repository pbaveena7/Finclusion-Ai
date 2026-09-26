import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, AlertTriangle, CheckCircle2, TrendingUp, Shield, Zap, HelpCircle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import ScrollReveal from '../components/animations/ScrollReveal';

interface Factor {
  label: string;
  key: string;
  weight: string;
  value: number;
  description: string;
  options: { label: string; value: number }[];
}

const FACTORS: Factor[] = [
  {
    label: 'Payment History',
    key: 'payment',
    weight: '35%',
    description: 'On-time loan & credit card EMI payments',
    value: 90,
    options: [
      { label: 'Always on time (0 missed)', value: 100 },
      { label: '1-2 missed payments', value: 75 },
      { label: '3-5 missed payments', value: 50 },
      { label: '6+ or settled/written off', value: 20 },
    ],
  },
  {
    label: 'Credit Utilization',
    key: 'utilization',
    weight: '30%',
    description: 'How much of your credit limit you use',
    value: 70,
    options: [
      { label: 'Under 10% utilized', value: 100 },
      { label: '10-30% utilized', value: 85 },
      { label: '30-50% utilized', value: 60 },
      { label: 'Above 50% utilized', value: 30 },
    ],
  },
  {
    label: 'Credit History Length',
    key: 'history',
    weight: '15%',
    description: 'Age of your oldest credit account',
    value: 70,
    options: [
      { label: 'More than 7 years', value: 100 },
      { label: '4-7 years', value: 80 },
      { label: '1-3 years', value: 55 },
      { label: 'Less than 1 year / New', value: 30 },
    ],
  },
  {
    label: 'Credit Mix',
    key: 'mix',
    weight: '10%',
    description: 'Variety of credit (home loan, auto, credit card)',
    value: 70,
    options: [
      { label: 'Home loan + Car + Card + Personal', value: 100 },
      { label: 'Home loan + Credit Card', value: 80 },
      { label: 'Only credit cards', value: 55 },
      { label: 'No credit history', value: 20 },
    ],
  },
  {
    label: 'New Credit Inquiries',
    key: 'inquiries',
    weight: '10%',
    description: 'Hard inquiries from new loan/card applications',
    value: 80,
    options: [
      { label: 'None in past 12 months', value: 100 },
      { label: '1-2 inquiries', value: 80 },
      { label: '3-5 inquiries', value: 55 },
      { label: '6+ inquiries', value: 25 },
    ],
  },
];

const WEIGHTS = [0.35, 0.30, 0.15, 0.10, 0.10];

function getScoreBand(score: number): { label: string; color: string; bgColor: string; description: string } {
  if (score >= 800) return { label: 'Excellent', color: '#10b981', bgColor: 'rgba(16,185,129,0.15)', description: 'Best interest rates, instant loan approvals.' };
  if (score >= 750) return { label: 'Very Good', color: '#06b6d4', bgColor: 'rgba(6,182,212,0.15)', description: 'Great loan eligibility and low EMIs.' };
  if (score >= 700) return { label: 'Good', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)', description: 'Most loans approved, slightly higher rates.' };
  if (score >= 650) return { label: 'Fair', color: '#f97316', bgColor: 'rgba(249,115,22,0.15)', description: 'Limited credit options, higher rates.' };
  return { label: 'Poor', color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)', description: 'Credit rebuilding needed. Focus on payments.' };
}

export default function CreditScore() {
  const [values, setValues] = useState<number[]>(FACTORS.map(f => f.value));

  const score = useMemo(() => {
    const weighted = values.reduce((sum, v, i) => sum + (v / 100) * WEIGHTS[i], 0);
    return Math.round(300 + weighted * 600); // CIBIL scale: 300-900
  }, [values]);

  const band = getScoreBand(score);

  const radarData = FACTORS.map((f, i) => ({ subject: f.label.split(' ')[0], value: values[i], fullMark: 100 }));
  
  const barData = FACTORS.map((f, i) => ({
    name: f.label.split(' ').slice(0, 2).join(' '),
    score: Math.round(values[i]),
    weight: f.weight,
  }));

  const tips = useMemo(() => {
    const t: string[] = [];
    if (values[0] < 80) t.push('💳 Set up auto-pay to avoid missed EMIs — biggest score booster (35% weight).');
    if (values[1] < 70) t.push('📉 Keep credit card usage below 30% of your limit for a quick score jump.');
    if (values[4] < 70) t.push('🔍 Avoid applying for multiple loans/cards — each hard inquiry drops score.');
    if (values[2] < 70) t.push('📅 Keep old credit cards active — longer history builds a stronger score.');
    if (t.length === 0) t.push('🎯 Excellent profile! Maintain current habits for 900+ score trajectory.');
    return t;
  }, [values]);

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="credit-score" />
      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto">
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Credit Score Simulator</h1>
              <p className="text-xs text-[var(--text-muted)]">Understand & improve your CIBIL score</p>
            </div>
          </div>
          <ThemeSelector />
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Score Display */}
          <ScrollReveal delay={0.1} className="lg:col-span-4 space-y-6">
            {/* Score Card */}
            <motion.div className="glass-card-lg p-8 flex flex-col items-center text-center relative overflow-hidden card-hover"
              animate={{ borderColor: band.color }}>
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${band.color}, transparent 70%)` }} />
              
              <Shield className="w-8 h-8 mb-4" style={{ color: band.color }} />
              <p className="text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-muted)]">Your CIBIL Score</p>
              <motion.p className="text-8xl font-black mb-2" style={{ color: band.color }}
                key={score} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                {score}
              </motion.p>
              <span className="text-xs font-bold px-4 py-1.5 rounded-full" style={{ background: band.bgColor, color: band.color }}>
                {band.label}
              </span>
              <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">{band.description}</p>

              {/* Score Bar */}
              <div className="w-full mt-6 h-3 rounded-full overflow-hidden flex gap-0.5">
                {[{ c: '#ef4444', max: 649 }, { c: '#f97316', max: 699 }, { c: '#f59e0b', max: 749 }, { c: '#06b6d4', max: 799 }, { c: '#10b981', max: 900 }].map(b => (
                  <div key={b.max} className="flex-1 rounded-full" style={{ background: b.c, opacity: score <= b.max || b.max === 900 ? 1 : 0.25 }} />
                ))}
              </div>
              <div className="flex justify-between w-full text-[9px] text-[var(--text-dim)] mt-1 font-mono">
                <span>300</span><span>Poor</span><span>Good</span><span>Very Good</span><span>900</span>
              </div>
            </motion.div>

            {/* AI Tips */}
            <div className="glass-card p-5 space-y-3 card-hover">
              <h3 className="text-sm font-bold flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> AI Improvement Tips</h3>
              {tips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="text-xs leading-relaxed p-3 rounded-xl border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                  {tip}
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Factors & Radar */}
          <ScrollReveal delay={0.2} className="lg:col-span-8 space-y-6">
            {/* Factor Sliders */}
            <div className="glass-card-lg p-6 space-y-5 card-hover">
              <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Adjust Credit Factors</h3>
              {FACTORS.map((factor, i) => (
                <div key={factor.key}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-sm font-bold">{factor.label}</span>
                      <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded font-bold" style={{ background: 'var(--accent-glow-subtle)', color: 'var(--accent-primary)' }}>Weight: {factor.weight}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: values[i] >= 75 ? 'var(--accent-primary)' : values[i] >= 50 ? '#f59e0b' : '#ef4444' }}>{values[i]}/100</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mb-2">{factor.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {factor.options.map(opt => (
                      <button key={opt.value} onClick={() => { const v = [...values]; v[i] = opt.value; setValues(v); }}
                        className="text-left text-xs py-2 px-3 rounded-xl border transition-all font-medium"
                        style={values[i] === opt.value
                          ? { background: 'var(--accent-gradient)', color: 'white', borderColor: 'transparent' }
                          : { background: 'var(--input-bg)', color: 'var(--text-muted)', borderColor: 'var(--border-card)' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Radar Chart */}
            <div className="glass-card-lg p-6 card-hover">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Credit Profile Radar</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border-card)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <Radar dataKey="value" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
