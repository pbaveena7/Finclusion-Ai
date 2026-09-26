import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, ShieldCheck, 
  Target, Wallet, User as UserIcon, TrendingUp, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ThemeSelector from '../components/ThemeSelector';

const GOAL_OPTIONS = [
  { label: 'Emergency Fund', icon: '🛡️' },
  { label: 'Home Purchase', icon: '🏠' },
  { label: 'Child Education', icon: '🎓' },
  { label: 'Retirement Wealth', icon: '🏖️' },
  { label: 'Car Purchase', icon: '🚗' },
  { label: 'Wealth Creation', icon: '💰' },
];

const RISK_QUESTIONS = [
  {
    q: "If your ₹1,00,000 investment drops 20% in a market dip, you would:",
    options: [
      { text: "Sell everything immediately to stop losses", score: 1 },
      { text: "Sell half and move to fixed deposits", score: 2 },
      { text: "Hold calmly and wait for recovery", score: 3 },
      { text: "Invest more at lower discounted prices", score: 4 }
    ]
  },
  {
    q: "What is your primary investment goal?",
    options: [
      { text: "Preserve capital — safety is my top priority", score: 1 },
      { text: "Earn steady income with low volatility", score: 2 },
      { text: "Balanced long-term capital appreciation", score: 3 },
      { text: "Aggressive wealth compounding — I tolerate high swings", score: 4 }
    ]
  },
  {
    q: "How long can you leave this money invested without needing it?",
    options: [
      { text: "Less than 1 year", score: 1 },
      { text: "1 to 3 years", score: 2 },
      { text: "3 to 7 years", score: 3 },
      { text: "7+ years", score: 4 }
    ]
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState(user?.name || 'Naveen Kumar');
  const [age, setAge] = useState(user?.age || 28);
  const [occupation, setOccupation] = useState(user?.occupation || 'Software Engineer');
  const [income, setIncome] = useState(user?.income || 120000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(user?.monthlyExpenses || 45000);
  const [savings, setSavings] = useState(user?.savings || 250000);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(user?.financialGoals || ['Emergency Fund', 'Wealth Creation']);
  const [answers, setAnswers] = useState<Record<number, number>>({ 0: 3, 1: 3, 2: 3 });

  const toggleGoal = (label: string) => {
    setSelectedGoals(prev => 
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const calculateRiskScore = () => {
    const sum = Object.values(answers).reduce((a, b) => a + b, 0);
    const max = RISK_QUESTIONS.length * 4;
    return Math.round((sum / max) * 100);
  };

  const finishOnboarding = () => {
    const riskScore = calculateRiskScore();
    const riskTolerance = riskScore >= 70 ? 'aggressive' : riskScore >= 45 ? 'moderate' : 'conservative';

    if (user) {
      setUser({
        ...user,
        name,
        age,
        occupation,
        income,
        monthlyExpenses,
        savings,
        financialGoals: selectedGoals,
        riskTolerance,
        riskScore,
        isOnboarded: true
      });
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans" style={{ background: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-20" style={{ background: 'var(--accent-primary)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-15" style={{ background: 'var(--accent-secondary)' }} />

      {/* Top Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">Finclusion AI Profiler</span>
        </div>
        <ThemeSelector compact />
      </div>

      {/* Step Container */}
      <div className="max-w-2xl mx-auto w-full my-8 z-10">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? 'w-8' : 'w-2 bg-white/10'
              }`}
              style={step === s ? { background: 'var(--accent-gradient)' } : {}}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card-lg p-8 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold mb-1">Let's personalize your experience</h2>
                <p className="text-xs text-[var(--text-muted)]">Step 1 of 5: Profile Foundation</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-[var(--text-dim)]">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="glass-input w-full p-3.5 rounded-xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-[var(--text-dim)]">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      className="glass-input w-full p-3.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-[var(--text-dim)]">Occupation</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={e => setOccupation(e.target.value)}
                      className="glass-input w-full p-3.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                style={{ background: 'var(--accent-gradient)' }}
              >
                <span>Continue to Financials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Financial Metrics */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card-lg p-8 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold mb-1">Your Financial Baseline</h2>
                <p className="text-xs text-[var(--text-muted)]">Step 2 of 5: Cashflow & Liquid Reserves</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-[var(--text-dim)]">Monthly In-Hand Income (₹)</label>
                  <input
                    type="number"
                    value={income}
                    onChange={e => setIncome(Number(e.target.value))}
                    className="glass-input w-full p-3.5 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-[var(--text-dim)]">Monthly Living Expenses (₹)</label>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={e => setMonthlyExpenses(Number(e.target.value))}
                    className="glass-input w-full p-3.5 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-[var(--text-dim)]">Total Liquid Savings / Cash (₹)</label>
                  <input
                    type="number"
                    value={savings}
                    onChange={e => setSavings(Number(e.target.value))}
                    className="glass-input w-full p-3.5 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 rounded-xl border text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                  style={{ borderColor: 'var(--border-card)' }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  <span>Select Life Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Life Goals */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card-lg p-8 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold mb-1">What are your top financial goals?</h2>
                <p className="text-xs text-[var(--text-muted)]">Step 3 of 5: Select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(g => {
                  const isSelected = selectedGoals.includes(g.label);
                  return (
                    <button
                      key={g.label}
                      onClick={() => toggleGoal(g.label)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected ? 'border-[var(--accent-primary)] shadow-sm' : 'border-white/5 hover:border-white/20'
                      }`}
                      style={{ background: isSelected ? 'var(--accent-glow-subtle)' : 'var(--bg-card)' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{g.icon}</span>
                        <span className="text-xs font-bold text-[var(--text-main)]">{g.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3.5 rounded-xl border text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                  style={{ borderColor: 'var(--border-card)' }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  <span>Risk Tolerance Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Risk Quiz */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card-lg p-8 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold mb-1">Risk Profiler</h2>
                <p className="text-xs text-[var(--text-muted)]">Step 4 of 5: Evaluate your risk appetite</p>
              </div>

              <div className="space-y-6">
                {RISK_QUESTIONS.map((item, qIdx) => (
                  <div key={qIdx} className="space-y-2.5">
                    <p className="text-xs font-bold text-[var(--text-main)]">{qIdx + 1}. {item.q}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {item.options.map(opt => {
                        const isChosen = answers[qIdx] === opt.score;
                        return (
                          <button
                            key={opt.score}
                            onClick={() => setAnswers(prev => ({ ...prev, [qIdx]: opt.score }))}
                            className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all card-hover ${
                              isChosen ? 'border-[var(--accent-primary)]' : 'border-white/5 hover:border-white/20'
                            }`}
                            style={{ background: isChosen ? 'var(--accent-glow-subtle)' : 'var(--input-bg)', color: isChosen ? 'var(--accent-primary)' : 'var(--text-main)' }}
                          >
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-3.5 rounded-xl border text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                  style={{ borderColor: 'var(--border-card)' }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  <span>Generate AI Assessment</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Summary & Finalization */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-lg p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-glow" style={{ background: 'var(--accent-gradient)' }}>
                <Check className="w-8 h-8 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold mb-1">Your Investor Profile is Ready!</h2>
                <p className="text-xs text-[var(--text-muted)]">Finclusion AI has synthesized your investment portfolio strategy</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-dim)]">Risk Category</span>
                  <p className="text-sm font-extrabold text-[var(--accent-primary)] capitalize">
                    {calculateRiskScore() >= 70 ? 'Aggressive' : calculateRiskScore() >= 45 ? 'Moderate' : 'Conservative'}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-dim)]">Health Score</span>
                  <p className="text-sm font-extrabold text-emerald-400">88/100</p>
                </div>
                <div className="p-3.5 rounded-2xl border col-span-2 sm:col-span-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-dim)]">Monthly Surplus</span>
                  <p className="text-sm font-extrabold text-sky-400 font-mono">₹{(income - monthlyExpenses).toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={finishOnboarding}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 shadow-glow transition-all"
                style={{ background: 'var(--accent-gradient)' }}
              >
                <span>Launch Dashboard & Start Investing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-xs text-[var(--text-dim)] z-10">
        Finclusion AI 2.0 • Institutional-Grade Financial Intelligence
      </div>
    </div>
  );
}
