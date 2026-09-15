import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, Sparkles, TrendingUp, Shield, 
  Eye, EyeOff, CheckCircle, AlertCircle, Mic, Target, Zap, ShieldCheck
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockUser } from '../data/mockUser';

const STATS = [
  { value: '10K+', label: 'Active Users' },
  { value: '₹500Cr+', label: 'Managed' },
  { value: '99.9%', label: 'Uptime' },
];

const FEATURES = [
  { icon: TrendingUp, color: 'text-[var(--accent-primary)]', bg: 'bg-[var(--accent-glow-subtle)]', title: 'Smart Investing', sub: 'AI-powered portfolio analysis' },
  { icon: Shield, color: 'text-[var(--accent-secondary)]', bg: 'bg-[var(--accent-glow-subtle)]', title: 'Fraud Detection', sub: 'Real-time scam protection' },
  { icon: Target, color: 'text-[var(--accent-primary)]', bg: 'bg-[var(--accent-glow-subtle)]', title: 'Goal Planning', sub: 'Personalized SIP calculator' },
  { icon: Mic, color: 'text-[var(--accent-secondary)]', bg: 'bg-[var(--accent-glow-subtle)]', title: 'Voice AI', sub: 'Ask in any Indian language' },
];

// Animated background particles
function Particles() {
  const particles = Array.from({ length: 25 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: 'var(--accent-primary)' }}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0 
          }}
          animate={{ 
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 8 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
}

// Typing animation component
function TypingText({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (charIdx > 0) {
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setIdx(i => (i + 1) % texts.length);
        }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts]);

  return (
    <span className="gradient-text">
      {texts[idx].substring(0, charIdx)}
      <span className="animate-pulse" style={{ color: 'var(--text-main)' }}>|</span>
    </span>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useStore();

  const doLogin = (userEmail?: string) => {
    setError('');
    setLoading(true);
    const chosenEmail = userEmail || email || 'demo@finclusion.ai';
    const namePart = chosenEmail.split('@')[0];
    const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    setUser({
      ...mockUser,
      id: 'user_123',
      name: capitalizedName || 'Naveen Kumar',
    });
    setToken('dev-access-token');
    setSuccess(true);
    setTimeout(() => navigate('/'), 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(email);
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <Particles />

      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20 animate-mesh" style={{ background: 'var(--accent-primary)' }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20 animate-mesh-reverse" style={{ background: 'var(--accent-secondary)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none opacity-10 animate-glow-pulse" style={{ background: 'var(--accent-primary)' }} />

      {/* ── LEFT PANEL ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] px-16 xl:px-24 py-14 relative z-10">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow" style={{ background: 'var(--accent-gradient)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[var(--text-main)]">Finclusion AI</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-[var(--accent-glow-subtle)]" style={{ color: 'var(--accent-primary)', background: 'var(--accent-glow-subtle)' }}>2.0</span>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        >
          <p className="font-semibold uppercase tracking-[0.2em] text-xs mb-6" style={{ color: 'var(--accent-primary)', opacity: 0.8 }}>
            ✦ AI-Powered Financial Intelligence
          </p>
          <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6 text-[var(--text-main)]">
            Your wealth journey,<br/>
            <TypingText texts={['decoded.', 'simplified.', 'amplified.', 'secured.']} />
          </h1>
          <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-lg mb-12">
            Stop second-guessing your finances. Get AI-powered insights, real-time fraud detection, and personalized investment guidance — in any Indian language.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 p-4 glass-card hover:bg-[var(--bg-card-hover)] transition-all group cursor-default"
              >
                <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center shrink-0`}>
                  <f.icon className={`w-4.5 h-4.5 ${f.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">{f.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.15 }}
              >
                <p className="text-2xl font-extrabold text-[var(--text-main)]">{s.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom floating widgets */}
        <div className="relative h-0">
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -right-8 w-56 glass-panel p-4 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent-glow-subtle)] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-main)]">NIFTY 50</p>
                <p className="text-[10px] text-[var(--text-muted)]">Live Market</p>
              </div>
              <span className="ml-auto text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>+1.2%</span>
            </div>
            <div className="flex gap-0.5 h-8 items-end">
              {[30, 50, 40, 70, 55, 80, 60, 90, 75, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm opacity-60" style={{ height: `${h}%`, background: 'var(--accent-primary)' }} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Auth Card) ─────────────── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="glass-panel rounded-[2rem] p-8 lg:p-10 shadow-glow-lg">
            
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-[var(--text-main)]">Finclusion AI 2.0</span>
            </div>

            <h2 className="text-3xl font-extrabold mb-1 tracking-tight text-[var(--text-main)]">Welcome back</h2>
            <p className="text-[var(--text-muted)] mb-8 text-sm">Sign in to your financial command center</p>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--accent-glow-subtle)]"
                  >
                    <CheckCircle className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
                  </motion.div>
                  <p className="font-bold text-xl" style={{ color: 'var(--accent-primary)' }}>Login Successful!</p>
                  <p className="text-[var(--text-muted)] text-sm">Redirecting to dashboard…</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleLogin} className="space-y-5">
                  
                  {/* Open Access Banner */}
                  <div className="p-3 rounded-xl border flex items-center gap-2.5 text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-hover)', color: 'var(--text-main)' }}>
                    <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <span><strong>Open Access Active:</strong> Sign in with any credentials or click Instant Access.</span>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-dim)' }}>Email</label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent-primary)]" />
                      <input
                        type="email" required value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="glass-input w-full py-3.5 pl-11 pr-4"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Password</label>
                      <span className="text-xs cursor-pointer transition-colors" style={{ color: 'var(--accent-primary)', opacity: 0.8 }}>Forgot password?</span>
                    </div>
                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent-primary)]" />
                      <input
                        type={showPassword ? 'text' : 'password'} required value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input w-full py-3.5 pl-11 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Entering Dashboard…</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Sign In (No Auth Needed)</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                      </>
                    )}
                  </button>

                  {/* 1-Click Instant Demo Button */}
                  <button
                    type="button"
                    onClick={() => doLogin('naveen@finclusion.ai')}
                    className="w-full py-3.5 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] hover:brightness-110 shadow-lg relative overflow-hidden"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--accent-primary)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    <span>Instant 1-Click Access</span>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[var(--border-card)]" />
                    <span className="text-xs text-[var(--text-dim)]">or</span>
                    <div className="flex-1 h-px bg-[var(--border-card)]" />
                  </div>

                  {/* Sign up link */}
                  <p className="text-center text-sm text-[var(--text-muted)]">
                    New to Finclusion AI?{' '}
                    <Link to="/signup" className="font-bold transition-colors hover:brightness-110" style={{ color: 'var(--accent-primary)' }}>
                      Create an account →
                    </Link>
                  </p>

                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 mt-6"
          >
            {['256-bit SSL', 'RBI Compliant', 'SOC 2 Certified'].map(badge => (
              <div key={badge} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-dim)' }}>
                <Shield className="w-3 h-3" />
                {badge}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
