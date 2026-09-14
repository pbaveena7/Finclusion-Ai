import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, ChevronLeft, Check, User, Wallet, Target, Brain } from 'lucide-react';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import type { OnboardingStep, RiskCategory } from '../types';

const steps: OnboardingStep[] = ['welcome', 'personal', 'financial', 'goals', 'risk', 'complete'];

const goalOptions = [
  { label: 'Emergency Fund', icon: '🛡️' },
  { label: 'Home Purchase', icon: '🏠' },
  { label: 'Child Education', icon: '🎓' },
  { label: 'Retirement', icon: '🏖️' },
  { label: 'Vacation', icon: '✈️' },
  { label: 'Car Purchase', icon: '🚗' },
  { label: 'Wedding', icon: '💍' },
  { label: 'Wealth Creation', icon: '💰' },
];

const riskQuestions = [
  {
    question: 'If your ₹1 Lakh investment dropped 20% in a month, what would you do?',
    options: [
      { text: 'Sell everything immediately', score: 1 },
      { text: 'Sell half and wait', score: 2 },
      { text: 'Hold and wait for recovery', score: 3 },
      { text: 'Buy more at lower prices', score: 4 },
    ],
  },
  {
    question: 'What is your primary investment objective?',
    options: [
      { text: 'Capital preservation — keep my money safe', score: 1 },
      { text: 'Regular income with low risk', score: 2 },
      { text: 'Balanced growth with moderate risk', score: 3 },
      { text: 'Maximum growth — I can handle volatility', score: 4 },
    ],
  },
  {
    question: 'How would you describe your investment experience?',
    options: [
      { text: 'Complete beginner — never invested', score: 1 },
      { text: 'Basic — FDs and savings only', score: 2 },
      { text: 'Intermediate — some mutual funds/stocks', score: 3 },
      { text: 'Advanced — active investor', score: 4 },
    ],
  },
  {
    question: 'How soon might you need to access this money?',
    options: [
      { text: 'Within 1 year', score: 1 },
      { text: '1-3 years', score: 2 },
      { text: '3-7 years', score: 3 },
      { text: '7+ years', score: 4 },
    ],
  },
  {
    question: 'What percentage of income can you invest monthly?',
    options: [
      { text: 'Less than 10%', score: 1 },
      { text: '10-20%', score: 2 },
      { text: '20-30%', score: 3 },
      { text: 'More than 30%', score: 4 },
    ],
  },
];

export default function Onboarding() {
  const { updateUser } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    occupation: '',
    income: 50000,
    expenses: 25000,
    savings: 100000,
    loans: 0,
    emi: 0,
    goals: [] as string[],
    riskAnswers: {} as Record<number, number>,
  });

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));

  const toggleGoal = (g: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(g) ? prev.goals.filter((x) => x !== g) : [...prev.goals, g],
    }));
  };

  const getRiskProfile = (): RiskCategory => {
    const total = Object.values(formData.riskAnswers).reduce((s, v) => s + v, 0);
    const avg = total / riskQuestions.length;
    if (avg <= 1.8) return 'conservative';
    if (avg <= 3) return 'moderate';
    return 'aggressive';
  };

  const getFinancialHealthScore = () => {
    let score = 50;
    const savingsRate = (formData.income - formData.expenses) / formData.income;
    if (savingsRate > 0.3) score += 15;
    else if (savingsRate > 0.2) score += 10;
    else if (savingsRate > 0.1) score += 5;

    const dtiRatio = formData.emi / formData.income;
    if (dtiRatio < 0.2) score += 15;
    else if (dtiRatio < 0.4) score += 10;
    else score -= 5;

    if (formData.savings > formData.expenses * 6) score += 10;
    else if (formData.savings > formData.expenses * 3) score += 5;

    if (formData.goals.length >= 3) score += 5;
    return Math.min(Math.max(score, 20), 95);
  };

  const handleComplete = () => {
    const riskProfile = getRiskProfile();
    const healthScore = getFinancialHealthScore();

    updateUser({
      name: formData.name || 'User',
      age: formData.age,
      occupation: formData.occupation,
      income: formData.income,
      monthlyExpenses: formData.expenses,
      savings: formData.savings,
      existingLoans: formData.loans,
      existingEMI: formData.emi,
      financialGoals: formData.goals,
      riskTolerance: riskProfile,
      financialHealthScore: healthScore,
      riskScore: Object.values(formData.riskAnswers).reduce((s, v) => s + v, 0) * 5,
      isOnboarded: true,
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* WELCOME */}
              {step === 'welcome' && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-3">
                    Welcome to <span className="gradient-text">Finclusion AI</span>
                  </h1>
                  <p className="text-slate-400 max-w-md mx-auto mb-8">
                    Your AI-powered financial advisor. Let's set up your profile in 2 minutes to get personalized recommendations.
                  </p>
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all"
                  >
                    Let's Get Started <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              )}

              {/* PERSONAL */}
              {step === 'personal' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">Personal Details</h2>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm text-slate-300 mb-1.5 block">Full Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" className="w-full px-4 py-3 bg-dark-700/50 border border-border-primary rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-1.5 block">Age: <span className="text-white font-bold">{formData.age} years</span></label>
                      <input type="range" min={18} max={70} value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-1.5 block">Occupation</label>
                      <input type="text" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} placeholder="e.g., Software Engineer" className="w-full px-4 py-3 bg-dark-700/50 border border-border-primary rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
                    </div>
                  </div>
                </div>
              )}

              {/* FINANCIAL */}
              {step === 'financial' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Wallet className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Financial Details</h2>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm text-slate-300 mb-1.5 block">Monthly Income: <span className="text-white font-bold">₹{formData.income.toLocaleString('en-IN')}</span></label>
                      <input type="range" min={10000} max={500000} step={5000} value={formData.income} onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) })} className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-1.5 block">Monthly Expenses: <span className="text-white font-bold">₹{formData.expenses.toLocaleString('en-IN')}</span></label>
                      <input type="range" min={5000} max={300000} step={5000} value={formData.expenses} onChange={(e) => setFormData({ ...formData, expenses: Number(e.target.value) })} className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-1.5 block">Current Savings: <span className="text-white font-bold">₹{(formData.savings / 100000).toFixed(1)}L</span></label>
                      <input type="range" min={0} max={5000000} step={10000} value={formData.savings} onChange={(e) => setFormData({ ...formData, savings: Number(e.target.value) })} className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 mb-1.5 block">Existing EMIs: <span className="text-white font-bold">₹{formData.emi.toLocaleString('en-IN')}</span></label>
                      <input type="range" min={0} max={100000} step={1000} value={formData.emi} onChange={(e) => setFormData({ ...formData, emi: Number(e.target.value) })} className="w-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* GOALS */}
              {step === 'goals' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-6 h-6 text-amber-400" />
                    <h2 className="text-xl font-bold text-white">Your Financial Goals</h2>
                  </div>
                  <p className="text-sm text-slate-400 mb-5">Select all goals that apply to you</p>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => {
                      const selected = formData.goals.includes(goal.label);
                      return (
                        <motion.button
                          key={goal.label}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleGoal(goal.label)}
                          className={`p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                            selected
                              ? 'bg-emerald-500/15 border border-emerald-500/30'
                              : 'bg-dark-700/30 border border-border-primary hover:border-border-hover'
                          }`}
                        >
                          <span className="text-2xl">{goal.icon}</span>
                          <span className={`text-sm font-medium ${selected ? 'text-emerald-400' : 'text-slate-300'}`}>{goal.label}</span>
                          {selected && <Check className="w-4 h-4 text-emerald-400 ml-auto" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RISK */}
              {step === 'risk' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Risk Assessment</h2>
                  </div>
                  <div className="space-y-6">
                    {riskQuestions.map((q, qi) => (
                      <div key={qi}>
                        <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => setFormData({ ...formData, riskAnswers: { ...formData.riskAnswers, [qi]: opt.score } })}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                                formData.riskAnswers[qi] === opt.score
                                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                                  : 'bg-dark-700/30 border border-border-primary text-slate-300 hover:border-border-hover'
                              }`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPLETE */}
              {step === 'complete' && (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="mb-6"
                  >
                    <ProgressRing progress={getFinancialHealthScore()} size={120} strokeWidth={8} color="#10b981" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Your Financial Health Score</h2>
                  <Badge variant={getFinancialHealthScore() >= 70 ? 'success' : getFinancialHealthScore() >= 50 ? 'warning' : 'danger'} size="md">
                    {getFinancialHealthScore() >= 70 ? 'Good' : getFinancialHealthScore() >= 50 ? 'Fair' : 'Needs Improvement'}
                  </Badge>
                  <p className="text-sm text-slate-400 mt-4 max-w-md mx-auto mb-6">
                    Profile: <span className="text-white font-medium">{getRiskProfile().charAt(0).toUpperCase() + getRiskProfile().slice(1)}</span> investor •
                    {formData.goals.length} goals • Savings rate: {Math.round(((formData.income - formData.expenses) / formData.income) * 100)}%
                  </p>
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all"
                  >
                    Launch Dashboard <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step !== 'welcome' && step !== 'complete' && (
            <div className="px-8 py-4 border-t border-border-primary flex justify-between">
              <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={step === 'risk' ? () => { nextStep(); } : nextStep}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-all"
              >
                {currentStep === steps.length - 2 ? 'See Results' : 'Continue'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
