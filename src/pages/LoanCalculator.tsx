import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import AreaChartComponent from '../components/charts/AreaChart';
import DonutChart from '../components/charts/DonutChart';
import Badge from '../components/ui/Badge';
import { useStore } from '../store/useStore';

export default function LoanCalculator() {
  const { user } = useStore();
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [showAmortization, setShowAmortization] = useState(false);

  const emi = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = tenureYears * 12;
    return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, interestRate, tenureYears]);

  const totalPayment = emi * tenureYears * 12;
  const totalInterest = totalPayment - loanAmount;
  const dtiRatio = user ? ((emi + (user.existingEMI || 0)) / user.income) * 100 : 0;

  // Amortization schedule
  const amortization = useMemo(() => {
    const schedule: { month: number; emi: number; principal: number; interest: number; balance: number }[] = [];
    let balance = loanAmount;
    const r = interestRate / 100 / 12;

    for (let m = 1; m <= tenureYears * 12; m++) {
      const monthInterest = balance * r;
      const monthPrincipal = emi - monthInterest;
      balance = Math.max(balance - monthPrincipal, 0);
      schedule.push({
        month: m,
        emi: Math.round(emi),
        principal: Math.round(monthPrincipal),
        interest: Math.round(monthInterest),
        balance: Math.round(balance),
      });
    }
    return schedule;
  }, [loanAmount, interestRate, tenureYears, emi]);

  // Balance over time chart data
  const balanceData = amortization
    .filter((_, i) => i % 12 === 0 || i === amortization.length - 1)
    .map((row) => ({
      date: `Year ${Math.ceil(row.month / 12)}`,
      value: row.balance,
    }));

  const stressLevel = dtiRatio < 30 ? 'safe' : dtiRatio < 50 ? 'caution' : 'critical';

  return (
    <PageWrapper title="Loan & EMI Calculator" subtitle="Calculate EMI, view amortization schedule, and check debt stress">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard padding="p-6">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" /> Loan Parameters
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Loan Amount: <span className="text-white font-bold">₹{(loanAmount / 100000).toFixed(1)} L</span>
                </label>
                <input
                  type="range"
                  min={100000}
                  max={10000000}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹1L</span><span>₹1 Cr</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Interest Rate: <span className="text-white font-bold">{interestRate}% p.a.</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>5%</span><span>20%</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Tenure: <span className="text-white font-bold">{tenureYears} years</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 yr</span><span>30 yrs</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Debt Stress Indicator */}
          <GlassCard padding="p-5" glow={stressLevel === 'critical' ? 'rose' : stressLevel === 'caution' ? 'amber' : 'emerald'}>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              {stressLevel === 'critical' ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              Debt Stress Indicator
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">This EMI</span>
                <span className="text-white font-medium">₹{Math.round(emi).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Existing EMIs</span>
                <span className="text-white font-medium">₹{(user?.existingEMI || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total EMI Load</span>
                <span className="text-white font-bold">₹{Math.round(emi + (user?.existingEMI || 0)).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Monthly Income</span>
                <span className="text-white font-medium">₹{(user?.income || 0).toLocaleString('en-IN')}</span>
              </div>

              <div className="h-3 rounded-full bg-dark-600 overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(dtiRatio, 100)}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${stressLevel === 'critical' ? 'bg-rose-500' : stressLevel === 'caution' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={stressLevel === 'critical' ? 'danger' : stressLevel === 'caution' ? 'warning' : 'success'} dot>
                  DTI Ratio: {dtiRatio.toFixed(1)}%
                </Badge>
                <span className="text-xs text-slate-400">
                  {stressLevel === 'safe' ? 'Comfortable' : stressLevel === 'caution' ? 'Manageable' : 'High Stress'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* EMI Result */}
          <GlassCard padding="p-6" glow="emerald">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-1">Monthly EMI</p>
                <p className="text-3xl font-bold gradient-text">₹{Math.round(emi).toLocaleString('en-IN')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-rose-400">₹{(totalInterest / 100000).toFixed(1)}L</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-1">Total Payment</p>
                <p className="text-2xl font-bold text-white">₹{(totalPayment / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </GlassCard>

          {/* Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassCard padding="p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Principal vs Interest</h3>
              <DonutChart
                data={[
                  { category: 'Principal', value: loanAmount, percentage: Math.round((loanAmount / totalPayment) * 100), color: '#10b981' },
                  { category: 'Interest', value: Math.round(totalInterest), percentage: Math.round((totalInterest / totalPayment) * 100), color: '#f43f5e' },
                ]}
                centerValue={`${Math.round((totalInterest / totalPayment) * 100)}%`}
                centerLabel="Interest"
                height={200}
              />
              <div className="flex justify-center gap-6 mt-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Principal</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Interest</span>
              </div>
            </GlassCard>

            <GlassCard padding="p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Balance Over Time</h3>
              <AreaChartComponent
                data={balanceData}
                height={200}
                color="#3b82f6"
                gradientId="loanBalance"
                formatValue={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
            </GlassCard>
          </div>

          {/* Amortization Table */}
          <GlassCard padding="p-0">
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <h3 className="text-base font-semibold text-white">Amortization Schedule</h3>
              <span className="text-sm text-slate-400">{showAmortization ? 'Hide' : 'Show'} ({tenureYears * 12} months)</span>
            </button>

            {showAmortization && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                className="overflow-hidden"
              >
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-surface-secondary z-10">
                      <tr className="border-b border-border-primary">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400">Month</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400">EMI</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400">Principal</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400">Interest</th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortization.slice(0, 120).map((row) => (
                        <tr key={row.month} className="border-b border-border-primary text-sm">
                          <td className="px-4 py-2 text-slate-300">{row.month}</td>
                          <td className="px-4 py-2 text-right text-white">₹{row.emi.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-2 text-right text-emerald-400">₹{row.principal.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-2 text-right text-rose-400">₹{row.interest.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-2 text-right text-slate-300">₹{row.balance.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}
