import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, ArrowRight, Sparkles, Shield, Eye, EyeOff,
  CheckCircle, AlertCircle, Check, Zap
} from 'lucide-react';
import { registerAPI } from '../api';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
  { label: 'Contains uppercase', test: (p: string) => /[A-Z]/.test(p) },
];

function StrengthBar({ password }: { password: string }) {
  const score = PASSWORD_RULES.filter(r => r.test(password)).length;
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-[var(--accent-primary)]'];
  const labels = ['Weak', 'Fair', 'Strong'];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-[var(--border-card)]'}`}
          />
        ))}
      </div>
      <p className={`text-[10px] font-bold ${score === 3 ? 'text-[var(--accent-primary)]' : score === 2 ? 'text-yellow-500' : 'text-red-500'}`}>
        {password && labels[score - 1]}
      </p>
    </div>
  );
}

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerAPI(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20 animate-mesh" style={{ background: 'var(--accent-secondary)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20 animate-mesh-reverse" style={{ background: 'var(--accent-primary)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at center, var(--accent-glow-subtle) 0%, transparent 70%)' }} />

      {/* ── LEFT PANEL ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[50%] px-16 xl:px-24 py-14 relative z-10">
        
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

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        >
          <p className="font-semibold uppercase tracking-[0.2em] text-xs mb-6" style={{ color: 'var(--accent-secondary)', opacity: 0.8 }}>
            ✦ Start Your Journey
          </p>
          <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6 text-[var(--text-main)]">
            Build wealth<br />
            <span className="gradient-text">
              smarter than ever.
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-lg mb-12">
            Join thousands of Indians who trust Finclusion AI for their financial future. Get your personalized AI financial advisor in seconds.
          </p>

          {/* Checklist */}
          <div className="space-y-4 mb-12">
            {[
              'Personalized AI financial roadmap',
              'Real-time fraud & scam protection',
              '11 Indian language support',
              'Smart SIP & goal planning tools',
              'Live market data & insights',
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                  <Check className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span className="text-[var(--text-muted)] text-sm">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="p-5 rounded-2xl glass-card"
          >
            <p className="text-[var(--text-muted)] text-sm italic leading-relaxed mb-3">
              "Finclusion AI helped me realize I was on track for retirement 5 years early. The SIP calculator changed everything."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full" style={{ background: 'var(--accent-gradient)' }} />
              <div>
                <p className="text-xs font-bold text-[var(--text-main)]">Priya Sharma</p>
                <p className="text-[10px] text-[var(--text-dim)]">Software Engineer, Bengaluru</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({length: 5}).map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xs">★</span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div />
      </div>

      {/* ── RIGHT PANEL (Auth Card) ─────────────── */}
      <div className="w-full lg:w-[50%] flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel rounded-[2rem] p-8 lg:p-10 shadow-glow-lg">
            
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-[var(--text-main)]">Finclusion AI 2.0</span>
            </div>

            <h2 className="text-3xl font-extrabold mb-1 tracking-tight text-[var(--text-main)]">Create account</h2>
            <p className="text-[var(--text-muted)] mb-8 text-sm">Your AI financial advisor awaits</p>

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
                  <p className="font-bold text-xl" style={{ color: 'var(--accent-primary)' }}>Account Created! 🎉</p>
                  <p className="text-[var(--text-muted)] text-sm text-center">Welcome to Finclusion AI!<br />Redirecting to login…</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSignup} className="space-y-5">

                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-dim)' }}>Full Name</label>
                    <div className="relative group">
                      <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent-primary)]" />
                      <input
                        type="text" required value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ravi Kumar"
                        className="glass-input w-full py-3.5 pl-11 pr-4"
                      />
                    </div>
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
                    <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-dim)' }}>Password</label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent-primary)]" />
                      <input
                        type={showPassword ? 'text' : 'password'} required value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Create a strong password"
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
                    <StrengthBar password={password} />
                    {/* Password hints */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        {PASSWORD_RULES.map(rule => (
                          <div key={rule.label} className={`flex items-center gap-2 text-[10px] transition-colors ${rule.test(password) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-dim)]'}`}>
                            <Check className="w-3 h-3" />
                            {rule.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Error */}
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

                  {/* Terms */}
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                    By creating an account, you agree to our{' '}
                    <span className="cursor-pointer transition-colors" style={{ color: 'var(--accent-secondary)' }}>Terms of Service</span>
                    {' '}and{' '}
                    <span className="cursor-pointer transition-colors" style={{ color: 'var(--accent-secondary)' }}>Privacy Policy</span>.
                  </p>

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
                        <span>Creating Account…</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Create Account</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[var(--border-card)]" />
                    <span className="text-xs text-[var(--text-dim)]">or</span>
                    <div className="flex-1 h-px bg-[var(--border-card)]" />
                  </div>

                  <p className="text-center text-sm text-[var(--text-muted)]">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold transition-colors hover:brightness-110" style={{ color: 'var(--accent-primary)' }}>
                      Sign in →
                    </Link>
                  </p>

                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Trust badges */}
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
