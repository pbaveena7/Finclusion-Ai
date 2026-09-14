import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ArrowLeft, Target, ShieldCheck, 
  Calculator, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

export default function MutualFunds() {
  const [targetAmount, setTargetAmount] = useState<number>(10000000); // 1 Crore
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // Math logic (mimicking backend mf_engine.py for real-time slider updates)
  const monthlyRate = (expectedReturn / 100) / 12;
  const months = years * 12;
  const numerator = targetAmount * monthlyRate;
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  const requiredSip = numerator / denominator / (1 + monthlyRate);
  
  const totalInvestment = requiredSip * months;
  const wealthGained = targetAmount - totalInvestment;

  // Generate chart data
  const chartData = [];
  let currentBalance = 0;
  let currentInvested = 0;
  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      currentBalance = (currentBalance + requiredSip) * (1 + monthlyRate);
      currentInvested += requiredSip;
    }
    chartData.push({
      year: `Year ${y}`,
      investment: Math.round(currentInvested),
      wealth: Math.round(currentBalance)
    });
  }

  return (
    <div className="min-h-screen bg-[#090b14] text-white font-sans overflow-y-auto relative pb-20">
      {/* Abstract Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Navigation */}
      <nav className="relative z-40 px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 bg-[#090b14]/80">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-xl tracking-tight text-emerald-400">Mutual Funds</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-white/60">
          <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
          <Link to="/stocks" className="hover:text-white transition-colors">Stocks & F&O</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Crorepati Calculator</h1>
          <p className="text-white/50 max-w-2xl">Plan your journey to ₹1 Crore. Adjust the sliders to see exactly how much you need to invest monthly to reach your ultimate financial milestone.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#131828]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl">
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Target Amount</label>
                  <span className="font-bold text-emerald-400">₹{(targetAmount / 100000).toFixed(0)} Lakhs</span>
                </div>
                <input 
                  type="range" min="1000000" max="50000000" step="1000000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Time Period</label>
                  <span className="font-bold text-blue-400">{years} Years</span>
                </div>
                <input 
                  type="range" min="1" max="30" step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Expected Return (CAGR)</label>
                  <span className="font-bold text-purple-400">{expectedReturn}%</span>
                </div>
                <input 
                  type="range" min="5" max="25" step="1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

            </div>

            <div className="bg-gradient-to-br from-emerald-900/40 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <h3 className="text-emerald-400/80 text-sm font-medium mb-1">Required Monthly SIP</h3>
              <p className="text-4xl font-bold text-white mb-6">₹{Math.round(requiredSip).toLocaleString()}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50 text-sm">Total Investment</span>
                  <span className="font-medium">₹{Math.round(totalInvestment).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Wealth Gained</span>
                  <span className="font-medium text-emerald-400">₹{Math.round(wealthGained).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Side */}
          <div className="lg:col-span-2">
            <div className="bg-[#131828]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Wealth Projection
              </h3>
              
              <div className="flex-1 w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                    <YAxis 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={12} 
                      tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`}
                      width={60}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                    />
                    <Area type="monotone" dataKey="investment" name="Invested" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvestment)" />
                    <Area type="monotone" dataKey="wealth" name="Total Wealth" stroke="#10b981" fillOpacity={1} fill="url(#colorWealth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
