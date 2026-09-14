import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  ArrowLeft, Activity, Layers, Zap, DollarSign, Filter
} from 'lucide-react';

export default function Stocks() {
  const [optionType, setOptionType] = useState<'CE'|'PE'>('CE');
  const [strike, setStrike] = useState<number>(2000);
  const [premium, setPremium] = useState<number>(50);
  const [lotSize, setLotSize] = useState<number>(250);

  // Generate payoff chart data
  const chartData = [];
  const minSpot = strike * 0.8;
  const maxSpot = strike * 1.2;
  const step = (maxSpot - minSpot) / 20;

  for (let spot = minSpot; spot <= maxSpot; spot += step) {
    let grossPayoff = 0;
    if (optionType === 'CE' && spot > strike) {
      grossPayoff = (spot - strike) * lotSize;
    } else if (optionType === 'PE' && spot < strike) {
      grossPayoff = (strike - spot) * lotSize;
    }
    const netPL = grossPayoff - (premium * lotSize);
    
    chartData.push({
      spot: Math.round(spot),
      pl: Math.round(netPL)
    });
  }

  const breakEven = optionType === 'CE' ? strike + premium : strike - premium;
  const maxLoss = premium * lotSize;

  return (
    <div className="min-h-screen bg-[#090b14] text-white font-sans overflow-y-auto relative pb-20">
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />

      <nav className="relative z-40 px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 bg-[#090b14]/80">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-xl tracking-tight text-purple-400">Stocks & F&O</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-white/60">
          <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
          <Link to="/mutual-funds" className="hover:text-white transition-colors">Mutual Funds</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Options Payoff Analyzer</h1>
          <p className="text-white/50 max-w-2xl">Visualize the exact profit or loss for your Call/Put options at expiry. Understand your risks before you enter a trade.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#131828]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl">
              
              <div className="flex gap-2 p-1 bg-white/5 rounded-lg mb-6">
                <button 
                  onClick={() => setOptionType('CE')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${optionType === 'CE' ? 'bg-emerald-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  CALL (CE)
                </button>
                <button 
                  onClick={() => setOptionType('PE')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${optionType === 'PE' ? 'bg-red-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  PUT (PE)
                </button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Strike Price</label>
                  <span className="font-bold text-white">{strike}</span>
                </div>
                <input 
                  type="range" min="100" max="5000" step="50"
                  value={strike}
                  onChange={(e) => setStrike(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Premium Paid</label>
                  <span className="font-bold text-white">₹{premium}</span>
                </div>
                <input 
                  type="range" min="1" max="500" step="1"
                  value={premium}
                  onChange={(e) => setPremium(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className="mb-2">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/70">Lot Size</label>
                  <span className="font-bold text-white">{lotSize}</span>
                </div>
                <input 
                  type="range" min="10" max="1000" step="10"
                  value={lotSize}
                  onChange={(e) => setLotSize(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div className="bg-[#131828]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-white/50 text-sm">Break-even Point</span>
                <span className="font-bold text-purple-400">{breakEven}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-white/50 text-sm">Max Loss (Risk)</span>
                <span className="font-bold text-red-400">₹{maxLoss.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-sm">Max Profit</span>
                <span className="font-bold text-emerald-400">Unlimited</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#131828]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl h-[500px] flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Expiry Payoff Curve
              </h3>
              
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="spot" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={12} 
                      tickFormatter={(val) => `₹${val}`}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={12} 
                      tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}
                      width={60}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "P&L"]}
                      labelFormatter={(label) => `Spot Price: ₹${label}`}
                    />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                    <ReferenceLine x={breakEven} stroke="#a855f7" strokeDasharray="3 3" label={{ position: 'top', value: 'Break-even', fill: '#a855f7', fontSize: 10 }} />
                    <Line 
                      type="monotone" 
                      dataKey="pl" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* Screener Mockup */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            Live Market Screener
          </h2>
          <div className="bg-[#131828]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                  <th className="p-4 font-medium">Symbol</th>
                  <th className="p-4 font-medium">Sector</th>
                  <th className="p-4 font-medium">RSI (14)</th>
                  <th className="p-4 font-medium">P/E Ratio</th>
                  <th className="p-4 font-medium">Signal</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">RELIANCE</td>
                  <td className="p-4 text-white/70">Energy</td>
                  <td className="p-4 text-yellow-400">65.2</td>
                  <td className="p-4 text-white/70">28.5</td>
                  <td className="p-4"><span className="px-2 py-1 bg-white/10 rounded text-xs">Neutral</span></td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">HDFCBANK</td>
                  <td className="p-4 text-white/70">Banking</td>
                  <td className="p-4 text-emerald-400 font-bold">28.4</td>
                  <td className="p-4 text-emerald-400">16.4</td>
                  <td className="p-4"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold border border-emerald-500/30">Oversold</span></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">INFY</td>
                  <td className="p-4 text-white/70">IT</td>
                  <td className="p-4 text-red-400 font-bold">75.1</td>
                  <td className="p-4 text-white/70">24.2</td>
                  <td className="p-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold border border-red-500/30">Overbought</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
