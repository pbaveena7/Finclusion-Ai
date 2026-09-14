import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import AreaChartComponent from '../components/charts/AreaChart';
import { useStore } from '../store/useStore';
import type { FinancialGoal } from '../types';

export default function Goals() {
  const { goals, addGoal } = useStore();
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: 500000, monthly: 5000, years: 5, risk: 'moderate' as const });

  const statusColors: Record<string, string> = {
    'on-track': '#3b82f6',
    behind: '#f43f5e',
    ahead: '#10b981',
  };

  const generateProjection = (goal: FinancialGoal) => {
    const data: { date: string; value: number }[] = [];
    const monthlyRate = goal.expectedReturn / 100 / 12;
    let value = goal.currentSavings;
    const today = new Date();

    for (let m = 0; m <= goal.timelineYears * 12; m++) {
      const d = new Date(today);
      d.setMonth(d.getMonth() + m);
      value = value * (1 + monthlyRate) + goal.monthlyContribution;
      data.push({ date: d.toISOString().split('T')[0], value: Math.round(value) });
    }
    return data;
  };

  const handleAddGoal = () => {
    const monthlyRate = 0.12 / 12;
    const months = newGoal.years * 12;
    const fv = newGoal.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

    const goal: FinancialGoal = {
      id: `goal_${Date.now()}`,
      name: newGoal.name,
      icon: '🎯',
      targetAmount: newGoal.target,
      currentSavings: 0,
      monthlyContribution: newGoal.monthly,
      timelineYears: newGoal.years,
      expectedReturn: 12,
      riskLevel: newGoal.risk,
      progress: 0,
      projectedAmount: Math.round(fv),
      monthlySIPNeeded: newGoal.monthly,
      status: fv >= newGoal.target ? 'on-track' : 'behind',
    };
    addGoal(goal);
    setShowAdd(false);
    setNewGoal({ name: '', target: 500000, monthly: 5000, years: 5, risk: 'moderate' });
  };

  return (
    <PageWrapper title="Financial Goals" subtitle="Track progress towards your financial milestones">
      {/* Add Goal Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 text-sm font-medium text-emerald-400 hover:text-white transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Goal
        </button>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {goals.map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard hover padding="p-5" onClick={() => setSelectedGoal(goal)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-2xl mb-1">{goal.icon}</p>
                  <h3 className="text-base font-semibold text-white">{goal.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{goal.timelineYears} year{goal.timelineYears > 1 ? 's' : ''} horizon</p>
                </div>
                <ProgressRing
                  progress={goal.progress}
                  size={60}
                  strokeWidth={5}
                  color={statusColors[goal.status]}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Target</span>
                  <span className="text-white font-medium">₹{(goal.targetAmount / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Saved</span>
                  <span className="text-white font-medium">₹{(goal.currentSavings / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Monthly SIP</span>
                  <span className="text-emerald-400 font-medium">₹{goal.monthlyContribution.toLocaleString('en-IN')}</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-dark-600 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: statusColors[goal.status] }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={goal.status === 'ahead' ? 'success' : goal.status === 'behind' ? 'danger' : 'info'}
                    dot
                  >
                    {goal.status === 'on-track' ? 'On Track' : goal.status === 'ahead' ? 'Ahead' : 'Behind'}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Projected: ₹{(goal.projectedAmount / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Goal Detail Modal */}
      <Modal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)} title={`${selectedGoal?.icon} ${selectedGoal?.name}`} size="lg">
        {selectedGoal && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Target', value: `₹${(selectedGoal.targetAmount / 100000).toFixed(1)}L` },
                { label: 'Current', value: `₹${(selectedGoal.currentSavings / 100000).toFixed(1)}L` },
                { label: 'Monthly SIP', value: `₹${selectedGoal.monthlyContribution.toLocaleString('en-IN')}` },
                { label: 'Expected Return', value: `${selectedGoal.expectedReturn}% p.a.` },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-dark-700/50">
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-sm font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Growth Projection
              </h3>
              <AreaChartComponent
                data={generateProjection(selectedGoal)}
                height={250}
                color="#10b981"
                gradientId="goalProjection"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10">
              <div>
                <p className="text-xs text-slate-400">SIP Needed to Stay on Track</p>
                <p className="text-xl font-bold text-emerald-400">₹{selectedGoal.monthlySIPNeeded.toLocaleString('en-IN')}/mo</p>
              </div>
              <Badge
                variant={selectedGoal.status === 'ahead' ? 'success' : selectedGoal.status === 'behind' ? 'danger' : 'info'}
                size="md"
                dot
              >
                {selectedGoal.status === 'on-track' ? 'On Track' : selectedGoal.status}
              </Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Goal Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create New Goal" size="md">
        <div className="space-y-5">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Goal Name</label>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              placeholder="e.g., New Car, Wedding, MBA..."
              className="w-full px-4 py-2.5 bg-dark-700/50 border border-border-primary rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-primary/50"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">
              Target Amount: <span className="text-white font-bold">₹{(newGoal.target / 100000).toFixed(1)}L</span>
            </label>
            <input type="range" min={100000} max={50000000} step={100000} value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })} className="w-full" />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">
              Monthly SIP: <span className="text-white font-bold">₹{newGoal.monthly.toLocaleString('en-IN')}</span>
            </label>
            <input type="range" min={500} max={100000} step={500} value={newGoal.monthly} onChange={(e) => setNewGoal({ ...newGoal, monthly: Number(e.target.value) })} className="w-full" />
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">
              Timeline: <span className="text-white font-bold">{newGoal.years} years</span>
            </label>
            <input type="range" min={1} max={30} value={newGoal.years} onChange={(e) => setNewGoal({ ...newGoal, years: Number(e.target.value) })} className="w-full" />
          </div>

          <button
            onClick={handleAddGoal}
            disabled={!newGoal.name}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            <Target className="w-4 h-4 inline mr-2" />
            Create Goal
          </button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
