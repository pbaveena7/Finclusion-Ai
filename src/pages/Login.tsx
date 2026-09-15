import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, TrendingUp, Target, Mic } from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockUser } from '../data/mockUser';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    setUser(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10 items-center">
        
        {/* Left Column - Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden lg:flex flex-col space-y-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-xl">✦</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Finclusion AI <span className="text-emerald-400 text-sm ml-2 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">2.0</span></h1>
            </div>
            
            <p className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4">✦ AI-Powered Financial Intelligence</p>
            <h2 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8">
              Your wealth journey,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">decoded.</span>
              <span className="inline-block w-1 h-[0.9em] ml-2 bg-cyan-400 animate-pulse align-middle"></span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
              Stop second-guessing your finances. Get AI-powered insights, real-time fraud detection, and personalized investment guidance — in any Indian language.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border-l-2 border-l-emerald-500">
              <TrendingUp className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Smart Investing</h3>
              <p className="text-sm text-slate-400">AI-powered portfolio analysis</p>
            </div>
            <div className="glass rounded-2xl p-6 border-l-2 border-l-cyan-500">
              <ShieldCheck className="w-6 h-6 text-cyan-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Fraud Detection</h3>
              <p className="text-sm text-slate-400">Real-time scam protection</p>
            </div>
            <div className="glass rounded-2xl p-6 border-l-2 border-l-purple-500">
              <Target className="w-6 h-6 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Goal Planning</h3>
              <p className="text-sm text-slate-400">Personalized SIP calculator</p>
            </div>
            <div className="glass rounded-2xl p-6 border-l-2 border-l-amber-500">
              <Mic className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Voice AI</h3>
              <p className="text-sm text-slate-400">Ask in any Indian language</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="glass-strong rounded-[2rem] p-8 lg:p-12 shadow-2xl relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
              <p className="text-slate-400">Sign in to your financial command center</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-dark-800/50 border border-border-primary rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all hover:bg-dark-800/80"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-dark-800/50 border border-border-primary rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all hover:bg-dark-800/80"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8"
              >
                <span className="text-xl">✦</span>
                Sign In
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px bg-border-primary flex-1" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">or</span>
              <div className="h-px bg-border-primary flex-1" />
            </div>

            <p className="mt-8 text-center text-sm text-slate-400">
              New to Finclusion AI?{' '}
              <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Create an account →
              </Link>
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> RBI Compliant</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> SOC 2 Certified</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
