import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Brain, ArrowUpRight, Calculator } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import SearchInput from '../components/ui/SearchInput';
import BarChartComponent from '../components/charts/BarChart';
import Modal from '../components/ui/Modal';
import { mockMutualFunds } from '../data/mockMutualFunds';
import type { MutualFund } from '../types';

const categoryTabs = ['All', 'Equity', 'Debt', 'Hybrid', 'ELSS', 'Index'];

const riskColors: Record<string, string> = {
  low: 'success',
  moderate: 'warning',
  high: 'danger',
  'very-high': 'danger',
};

export default function MutualFunds() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null);
  const [showSIPCalc, setShowSIPCalc] = useState(false);
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipRate, setSipRate] = useState(12);
  const [compareFunds, setCompareFunds] = useState<string[]>([]);

  const filteredFunds = useMemo(() => {
    return mockMutualFunds.filter((f) => {
      const matchTab = activeTab === 'All' || f.category === activeTab.toLowerCase();
      const matchSearch = f.schemeName.toLowerCase().includes(search.toLowerCase()) ||
        f.fundHouse.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  const toggleCompare = (code: string) => {
    setCompareFunds((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < 3
        ? [...prev, code]
        : prev
    );
  };

  // SIP Calculator
  const calcSIP = () => {
    const monthlyRate = sipRate / 100 / 12;
    const months = sipYears * 12;
    const fv = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const invested = sipAmount * months;
    return { futureValue: Math.round(fv), invested, returns: Math.round(fv - invested) };
  };

  const sipResult = calcSIP();

  const compareData = compareFunds.map((code) => mockMutualFunds.find((f) => f.schemeCode === code)!).filter(Boolean);

  return (
    <PageWrapper title="Mutual Funds" subtitle="Explore and compare 15+ top-rated funds across categories">
      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Tabs tabs={categoryTabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex gap-3 ml-auto">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search funds..."
            className="w-64"
          />
          <button
            onClick={() => setShowSIPCalc(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 text-sm font-medium text-emerald-400 hover:text-white transition-all"
          >
            <Calculator className="w-4 h-4" />
            SIP Calc
          </button>
        </div>
      </div>

      {/* Compare Bar */}
      {compareFunds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl px-4 py-3 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">Comparing {compareFunds.length}/3:</span>
            {compareData.map((f) => (
              <Badge key={f.schemeCode} variant="info" size="sm">{f.schemeName.split(' ').slice(0, 3).join(' ')}</Badge>
            ))}
          </div>
          <button onClick={() => setCompareFunds([])} className="text-xs text-slate-400 hover:text-white">Clear</button>
        </motion.div>
      )}

      {/* Compare Table */}
      {compareData.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard padding="p-0">
            <div className="px-5 py-4 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-white">Fund Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-primary">
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-400">Metric</th>
                    {compareData.map((f) => (
                      <th key={f.schemeCode} className="px-5 py-3 text-center text-xs font-medium text-slate-300">
                        {f.schemeName.split(' ').slice(0, 3).join(' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { label: 'NAV', fn: (f: MutualFund) => `₹${f.nav}` },
                    { label: '1Y Return', fn: (f: MutualFund) => `${f.returns.oneYear}%` },
                    { label: '3Y Return', fn: (f: MutualFund) => `${f.returns.threeYear}%` },
                    { label: '5Y Return', fn: (f: MutualFund) => `${f.returns.fiveYear}%` },
                    { label: 'Expense Ratio', fn: (f: MutualFund) => `${f.expenseRatio}%` },
                    { label: 'AUM', fn: (f: MutualFund) => f.aum },
                    { label: 'Min SIP', fn: (f: MutualFund) => `₹${f.minSIP}` },
                    { label: 'Risk', fn: (f: MutualFund) => f.riskLevel },
                    { label: 'Rating', fn: (f: MutualFund) => '⭐'.repeat(f.rating) },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-border-primary">
                      <td className="px-5 py-2.5 text-slate-400">{row.label}</td>
                      {compareData.map((f) => (
                        <td key={f.schemeCode} className="px-5 py-2.5 text-center text-white">{row.fn(f)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Fund Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredFunds.map((fund, i) => (
            <motion.div
              key={fund.schemeCode}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03 }}
            >
              <GlassCard hover padding="p-5" onClick={() => setSelectedFund(fund)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate pr-2">{fund.schemeName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{fund.fundHouse} • {fund.subCategory}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(fund.schemeCode);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      compareFunds.includes(fund.schemeCode)
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                    title="Compare"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Returns bar */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: '1Y', value: fund.returns.oneYear },
                    { label: '3Y', value: fund.returns.threeYear },
                    { label: '5Y', value: fund.returns.fiveYear },
                  ].map((r) => (
                    <div key={r.label} className="text-center">
                      <p className={`text-sm font-bold ${r.value >= 15 ? 'text-emerald-400' : r.value >= 10 ? 'text-blue-400' : 'text-slate-300'}`}>
                        {r.value}%
                      </p>
                      <p className="text-[10px] text-slate-500">{r.label}</p>
                      <div className="mt-1 h-1 rounded-full bg-dark-600 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(r.value * 2.5, 100)}%` }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{
                            background: r.value >= 15 ? '#10b981' : r.value >= 10 ? '#3b82f6' : '#64748b'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={riskColors[fund.riskLevel] as any} size="sm">{fund.riskLevel}</Badge>
                    <span className="text-xs text-slate-400">NAV: ₹{fund.nav}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < fund.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* AI Tag */}
                <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <Brain className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{fund.aiSuitability}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SIP Calculator Modal */}
      <Modal isOpen={showSIPCalc} onClose={() => setShowSIPCalc(false)} title="SIP Calculator" size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Monthly Investment: <span className="text-white font-bold">₹{sipAmount.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="range"
                min={500}
                max={100000}
                step={500}
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>₹500</span><span>₹1,00,000</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Time Period: <span className="text-white font-bold">{sipYears} years</span>
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 yr</span><span>30 yrs</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Expected Return: <span className="text-white font-bold">{sipRate}% p.a.</span>
              </label>
              <input
                type="range"
                min={4}
                max={25}
                step={0.5}
                value={sipRate}
                onChange={(e) => setSipRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>4%</span><span>25%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/15">
              <p className="text-sm text-slate-400 mb-1">Estimated Returns</p>
              <p className="text-3xl font-bold gradient-text">
                ₹{sipResult.futureValue >= 10000000
                  ? (sipResult.futureValue / 10000000).toFixed(2) + ' Cr'
                  : sipResult.futureValue >= 100000
                  ? (sipResult.futureValue / 100000).toFixed(2) + ' L'
                  : sipResult.futureValue.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-dark-700/50">
                <p className="text-xs text-slate-400">Invested</p>
                <p className="text-sm font-bold text-white">
                  ₹{sipResult.invested >= 100000
                    ? (sipResult.invested / 100000).toFixed(1) + 'L'
                    : sipResult.invested.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-dark-700/50">
                <p className="text-xs text-slate-400">Wealth Gain</p>
                <p className="text-sm font-bold text-emerald-400">
                  ₹{sipResult.returns >= 10000000
                    ? (sipResult.returns / 10000000).toFixed(2) + 'Cr'
                    : sipResult.returns >= 100000
                    ? (sipResult.returns / 100000).toFixed(1) + 'L'
                    : sipResult.returns.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <BarChartComponent
              data={[
                { name: 'Invested', value: sipResult.invested, color: '#3b82f6' },
                { name: 'Returns', value: sipResult.returns, color: '#10b981' },
              ]}
              height={150}
            />
          </div>
        </div>
      </Modal>

      {/* Fund Detail Modal */}
      <Modal isOpen={!!selectedFund} onClose={() => setSelectedFund(null)} title={selectedFund?.schemeName || ''} size="lg">
        {selectedFund && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'NAV', value: `₹${selectedFund.nav}` },
                { label: 'AUM', value: selectedFund.aum },
                { label: 'Expense Ratio', value: `${selectedFund.expenseRatio}%` },
                { label: 'Min SIP', value: `₹${selectedFund.minSIP}` },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-dark-700/50">
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-sm font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Returns Performance</h3>
              <BarChartComponent
                data={[
                  { name: '1 Year', value: selectedFund.returns.oneYear, color: '#10b981' },
                  { name: '3 Year', value: selectedFund.returns.threeYear, color: '#3b82f6' },
                  { name: '5 Year', value: selectedFund.returns.fiveYear, color: '#8b5cf6' },
                ]}
                height={200}
              />
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">AI Recommendation</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedFund.aiSuitability}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-dark-700/50 flex items-center justify-between">
                <span className="text-sm text-slate-400">Risk Level</span>
                <Badge variant={riskColors[selectedFund.riskLevel] as any}>{selectedFund.riskLevel}</Badge>
              </div>
              <div className="p-3 rounded-lg bg-dark-700/50 flex items-center justify-between">
                <span className="text-sm text-slate-400">Rating</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < selectedFund.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
