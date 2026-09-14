import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, TrendingUp, Target, Landmark, ShieldCheck, 
  Sparkles, Bell, Search, LayoutDashboard, Wallet, User, Activity, AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from FastAPI Backend
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const portfolioData = data?.portfolio_history || [];
  const allocationData = data?.asset_allocation || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-white font-sans flex overflow-hidden">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar - Fixed on Desktop */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-64 border-r border-white/5 bg-[#131828]/50 backdrop-blur-xl flex flex-col z-20 h-screen fixed"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
            <span className="font-bold text-white text-sm">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight">FINCLUSION</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-4 text-xs font-bold text-white/30 uppercase tracking-wider mb-2">Main Menu</p>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/stocks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <TrendingUp className="w-5 h-5" /> Investments
          </Link>
          <Link to="/mutual-funds" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Target className="w-5 h-5" /> Goal Planner
          </Link>
          <Link to="/schemes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Landmark className="w-5 h-5" /> Govt Schemes
          </Link>
          <Link to="/loans" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Wallet className="w-5 h-5" /> Loans & EMIs
          </Link>
          
          <p className="px-4 text-xs font-bold text-white/30 uppercase tracking-wider mt-8 mb-2">Security</p>
          <Link to="/safety" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <ShieldCheck className="w-5 h-5" /> Trust & Safety
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <div>
              <p className="text-sm font-medium">Naveen</p>
              <p className="text-xs text-white/40">Premium Member</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 h-screen overflow-y-auto">
        
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 w-3/4 h-[500px] bg-purple-500/10 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" />
        
        {/* Top Header */}
        <header className="px-8 py-5 flex justify-between items-center border-b border-white/5 bg-[#090b14]/80 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-2xl font-bold">Overview</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>
            <button className="relative text-white/60 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto relative z-10 w-full pb-32">

          {/* Widgets Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-12 gap-6"
          >
            
          {/* Welcome & Net Worth (Col 8) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 lg:col-span-8 bg-[#131828]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/50 font-medium mb-1 flex items-center gap-2">Total Net Worth <LayoutDashboard className="w-4 h-4"/></p>
                {loading ? (
                  <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse mb-2 mt-2" />
                ) : (
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">₹{data?.net_worth?.total.toLocaleString()}</h2>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {loading ? (
                    <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
                  ) : (
                    <>
                      <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded text-sm">+{data?.net_worth?.growth_percentage}%</span>
                      <span className="text-white/40 text-sm">{data?.net_worth?.comparison_text}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              {loading ? (
                <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Allocation (Col 4) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 lg:col-span-4 bg-[#131828]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col hover:border-white/20 transition-colors"
          >
            <h3 className="font-bold mb-6">Asset Allocation</h3>
            <div className="flex-1 flex justify-center items-center relative">
              {loading ? (
                <div className="w-48 h-48 rounded-full border-8 border-white/5 border-t-white/20 animate-spin" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                  <Pie data={allocationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              )}
              {!loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold">100%</span>
                  <span className="text-xs text-white/50">Allocated</span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {allocationData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/70">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Financial Coach Widget (Col 8) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 lg:col-span-8 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/20 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden group hover:border-purple-500/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold mb-4 border border-purple-500/30">
                  <Sparkles className="w-3 h-3" /> AI FINANCIAL COACH
                </div>
                <h3 className="text-2xl font-bold mb-2">How can I help you grow today?</h3>
                <p className="text-white/60 text-sm max-w-sm mb-6">Ask me to analyze your portfolio, verify a government scheme, or simulate an options payoff.</p>
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1 w-full max-w-md">
                  <input type="text" placeholder="e.g. Optimize my tax savings..." className="bg-transparent flex-1 px-4 text-sm focus:outline-none" />
                  <button className="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-2 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="w-32 h-32 rounded-full border-[8px] border-white/5 flex items-center justify-center relative shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <div className="absolute inset-0 rounded-full border-[8px] border-purple-500 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>
            </div>
          </motion.div>

          {/* Goal Planner Progress (Col 4) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#131828]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-colors"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2"><Target className="w-4 h-4 text-blue-400" /> Child Education</h3>
                <span className="text-xs font-bold text-white/40">2032</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">₹12L Saved</span>
                  <span className="font-bold">₹50L Goal</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 mb-4">
                <h3 className="font-bold flex items-center gap-2"><Home className="w-4 h-4 text-pink-400" /> Dream Home</h3>
                <span className="text-xs font-bold text-white/40">2028</span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">₹45L Saved</span>
                  <span className="font-bold">₹80L Goal</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full" style={{ width: '56%' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust & Fraud Status (Col 6) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 md:col-span-6 bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 shadow-2xl flex items-center gap-6 hover:border-emerald-500/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Account Secured</h3>
              <p className="text-sm text-emerald-400/80 mb-3">Fraud Detection AI is actively monitoring your transactions.</p>
              <div className="flex gap-4 text-xs font-bold">
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">0 Alerts</span>
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">Last Scan: Just now</span>
              </div>
            </div>
          </motion.div>

          {/* Loans & EMIs Status (Col 6) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 md:col-span-6 bg-[#131828]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl flex items-center justify-between hover:border-white/20 transition-colors"
          >
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-1"><Activity className="w-4 h-4 text-orange-400" /> Active EMI</h3>
              {loading ? (
                <>
                  <div className="h-8 w-32 bg-white/10 rounded animate-pulse mb-1 mt-2" />
                  <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold mb-1">₹{data?.active_emi?.amount.toLocaleString()}<span className="text-sm text-white/40 font-normal">/mo</span></p>
                  <p className="text-xs text-white/50">{data?.active_emi?.description}</p>
                </>
              )}
            </div>
            <div className="w-16 h-16 rounded-full border-[4px] border-white/5 border-t-orange-400 flex items-center justify-center transform -rotate-45">
              <span className="transform rotate-45 text-sm font-bold text-orange-400">
                {loading ? '...' : `${data?.active_emi?.dti_percentage}%`}
              </span>
            </div>
          </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
