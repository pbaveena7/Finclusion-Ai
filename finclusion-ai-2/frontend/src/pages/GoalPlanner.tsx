import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Plus, Search, Bell,
  BrainCircuit, Loader2, Sparkles, TrendingUp
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ReferenceLine
} from 'recharts';
import { useStore } from '../store/useStore';
import { sendMessage } from '../api';
import Sidebar from '../components/Sidebar';
import { mockGoals } from '../data/mockGoals';
import ScrollReveal from '../components/animations/ScrollReveal';

const OVERVIEW_DATA = [
  { subject: 'Real Estate', A: 85, fullMark: 100 },
  { subject: 'Education', A: 65, fullMark: 100 },
  { subject: 'Retirement', A: 45, fullMark: 100 },
  { subject: 'Lifestyle', A: 90, fullMark: 100 },
  { subject: 'Emergency', A: 100, fullMark: 100 },
];

export default function GoalPlanner() {
  const user = useStore(state => state.user);
  
  // Transform mockGoals to match UI needs
  const [goals, setGoals] = useState(
    mockGoals.map((g, idx) => ({
      ...g,
      color: idx % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'
    }))
  );
  
  const [activeGoalId, setActiveGoalId] = useState(goals[0]?.id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const activeGoal = goals.find(g => g.id === activeGoalId)!;
  
  const handleGetInsight = async () => {
    if (!activeGoal) return;
    setIsLoadingInsight(true);
    try {
      const prompt = `Act as an expert financial advisor. I have a goal "${activeGoal.name}" with a target of ₹${activeGoal.targetAmount}. I have saved ₹${activeGoal.currentSavings} so far, and I contribute ₹${activeGoal.monthlyContribution}/month. I have ${activeGoal.timelineYears} years left. Analyze if I'm on track and give 2 specific, actionable bullet points to improve my strategy. Keep it under 60 words, professional tone.`;
      
      const response = await sendMessage([
        { role: 'system', content: 'You are an elite AI wealth manager.' },
        { role: 'user', content: prompt }
      ], 'expert');
      
      setAiInsight(response.content);
    } catch (err) {
      console.error("AI Insight failed", err);
      setAiInsight("Consider increasing your SIP by 15% annually to comfortably reach this goal ahead of schedule. Your current debt allocation is optimal for this horizon.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // Generate projection data
  const projectionData = Array.from({ length: Math.max(1, activeGoal.timelineYears + 1) }).map((_, i) => {
    const year = new Date().getFullYear() + i;
    const baseAmount = activeGoal.currentSavings + (activeGoal.monthlyContribution * 12 * i);
    // Rough compound interest projection
    const projected = baseAmount * Math.pow(1 + (activeGoal.expectedReturn / 100), i);
    return {
      year: year.toString(),
      projected: Math.round(projected),
      target: activeGoal.targetAmount
    };
  });

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="goals" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        {/* ── Header ── */}
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">Goal Planner</h1>
              <p className="text-xs text-[var(--text-muted)]">Track & optimize your financial milestones</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <Search className="w-4 h-4 text-[var(--text-main)]" />
            </button>
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <Bell className="w-4 h-4 text-[var(--text-main)]" />
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center gap-2 py-2 px-4 text-xs font-bold shadow-glow">
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* ── Left Column: Goal List & Radar ── */}
          <ScrollReveal delay={0.1} className="space-y-6">
            <div className="glass-card p-6 flex flex-col items-center justify-center h-[280px] card-hover">
              <h3 className="text-sm font-bold w-full text-left mb-2">Life Goals Balance</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={OVERVIEW_DATA}>
                  <PolarGrid stroke="var(--border-card)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <Radar name="Goals" dataKey="A" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-[var(--text-muted)]">Your active goals</h3>
              <div className="space-y-3">
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => setActiveGoalId(goal.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                      activeGoalId === goal.id ? 'shadow-glow-sm bg-[var(--bg-card)]' : 'hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]'
                    }`}
                    style={{ borderColor: activeGoalId === goal.id ? goal.color : 'var(--border-card)' }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                      {goal.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-sm text-[var(--text-main)] truncate">{goal.name}</h4>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">{goal.timelineYears}Y left</span>
                      </div>
                      <div className="w-full bg-[var(--input-bg)] rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${goal.progress}%`, background: goal.color }} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right Column: Goal Detail & Projection ── */}
          <div className="xl:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGoal.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              >
                {/* Active Goal Header */}
                <div className="glass-card p-8 mb-6 relative overflow-hidden card-hover">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: activeGoal.color }} />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{activeGoal.icon}</span>
                        <h2 className="text-3xl font-extrabold">{activeGoal.name}</h2>
                      </div>
                      <p className="text-sm font-medium uppercase tracking-wider text-[var(--text-muted)]">Target Year: {new Date().getFullYear() + activeGoal.timelineYears}</p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Target Amount</p>
                      <p className="text-3xl font-extrabold" style={{ color: activeGoal.color }}>
                        ₹{activeGoal.targetAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="p-4 rounded-xl bg-[var(--input-bg)] border" style={{ borderColor: 'var(--border-card)' }}>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Saved So Far</p>
                      <p className="font-bold">₹{activeGoal.currentSavings.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--input-bg)] border" style={{ borderColor: 'var(--border-card)' }}>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Shortfall</p>
                      <p className="font-bold">₹{(activeGoal.targetAmount - activeGoal.currentSavings).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--input-bg)] border" style={{ borderColor: 'var(--border-card)' }}>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Monthly SIP Needed</p>
                      <p className="font-bold" style={{ color: 'var(--accent-secondary)' }}>₹{activeGoal.monthlySIPNeeded.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--input-bg)] border" style={{ borderColor: 'var(--border-card)' }}>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Status</p>
                      <p className="font-bold uppercase tracking-widest text-[10px] py-1 px-2 rounded bg-[var(--accent-glow-subtle)] text-[var(--accent-primary)] inline-block mt-1">
                        {activeGoal.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Insight */}
                <div className="glass-card border-[var(--border-card)] p-1 flex flex-col md:flex-row gap-4 mb-6 relative overflow-hidden card-hover">
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ background: 'var(--accent-gradient)' }} />
                  
                  <div className="w-16 flex items-center justify-center border-r shrink-0" style={{ borderColor: 'var(--border-card)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--accent-glow-subtle)] border border-[var(--accent-primary)] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <BrainCircuit className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                  </div>
                  
                  <div className="flex-1 py-4 pr-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-extrabold flex items-center gap-2">AI Goal Strategy <Sparkles className="w-3 h-3 text-amber-400" /></h4>
                      <button 
                        onClick={handleGetInsight}
                        disabled={isLoadingInsight}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-colors flex items-center gap-2"
                      >
                        {isLoadingInsight ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate Fresh Insight'}
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {aiInsight || "Click 'Generate Fresh Insight' to get a personalized strategy to reach this goal faster using the latest market conditions."}
                    </p>
                  </div>
                </div>

                {/* Projection Chart */}
                <div className="glass-card p-6 h-[320px] card-hover">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[var(--accent-secondary)]" /> Growth Projection</h3>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={activeGoal.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={activeGoal.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                      <YAxis tickFormatter={(val) => `₹${val/100000}L`} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--text-main)' }}
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Projected Value']}
                      />
                      <ReferenceLine y={activeGoal.targetAmount} stroke="var(--text-muted)" strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="projected" stroke={activeGoal.color} strokeWidth={2} fillOpacity={1} fill="url(#colorProj)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Basic Add Modal Placeholder */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card-lg p-8 relative z-10 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">Form fields would go here. For demo, just close.</p>
              <button onClick={() => setIsAddModalOpen(false)} className="btn-primary w-full py-2">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
