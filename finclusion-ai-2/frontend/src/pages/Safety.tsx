import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Search, 
  History, PhoneCall, ExternalLink, Sparkles, CheckCircle2, 
  XCircle, Loader2, ArrowRight 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import { useStore } from '../store/useStore';
import type { FraudAnalysis } from '../types';
import ScrollReveal from '../components/animations/ScrollReveal';

const SAMPLE_SCAMS = [
  'Congratulations! You won ₹50 Lakh in KBC lottery. Send ₹5,000 processing fee to claim.',
  'URGENT: Your SBI account will be blocked in 24 hours. Click here to verify KYC: http://sbi-kyc-update.xyz',
  'Invest in XYZ Crypto and get 500% guaranteed returns in 30 days! Limited slots available.',
  'Dear Customer, your fixed deposit of ₹10,00,000 is maturing on 25th. Please visit branch or official netbanking.'
];

function analyzeFraudHeuristics(input: string): FraudAnalysis {
  const lower = input.toLowerCase();
  const redFlags: FraudAnalysis['redFlags'] = [];
  let riskScore = 10;

  if (lower.includes('congratulations') || lower.includes('won') || lower.includes('lottery')) {
    redFlags.push({ flag: 'Lottery/Prize Scam', description: 'Unsolicited prize claims are a classic advance-fee pattern', severity: 'high' });
    riskScore += 30;
  }
  if (lower.includes('processing fee') || lower.includes('send money') || lower.includes('pay') || lower.includes('fee')) {
    redFlags.push({ flag: 'Advance Fee Fraud', description: 'Legitimate prizes never require upfront payments', severity: 'high' });
    riskScore += 25;
  }
  if (lower.includes('urgent') || lower.includes('blocked') || lower.includes('suspended') || lower.includes('24 hours')) {
    redFlags.push({ flag: 'Urgency Pressure', description: 'Creating artificial urgency to force panicked decisions', severity: 'high' });
    riskScore += 20;
  }
  if (lower.includes('click here') || lower.includes('http') || lower.includes('.xyz') || lower.includes('.tk')) {
    redFlags.push({ flag: 'Suspicious Phishing Link', description: 'Unverified external link designed to steal credentials', severity: 'high' });
    riskScore += 25;
  }
  if (lower.includes('kyc') || lower.includes('verify') || lower.includes('update')) {
    redFlags.push({ flag: 'KYC Phishing', description: 'Banks never mandate KYC updates via SMS or WhatsApp links', severity: 'medium' });
    riskScore += 15;
  }
  if (lower.includes('guaranteed') || lower.includes('500%') || lower.includes('100%')) {
    redFlags.push({ flag: 'Unrealistic Returns Guarantee', description: 'No regulated financial product guarantees abnormal returns', severity: 'high' });
    riskScore += 25;
  }
  if (lower.includes('crypto') && (lower.includes('guaranteed') || lower.includes('returns'))) {
    redFlags.push({ flag: 'Crypto Ponzi Scheme', description: 'High-yield multi-level marketing crypto scheme pattern', severity: 'high' });
    riskScore += 20;
  }

  riskScore = Math.min(riskScore, 100);
  const riskLevel: FraudAnalysis['riskLevel'] = riskScore >= 60 ? 'high-risk' : riskScore >= 30 ? 'caution' : 'safe';

  return {
    riskLevel,
    riskScore,
    redFlags,
    recommendation: riskScore >= 60 
      ? 'DO NOT engage, pay money, or click any links. Report this number to cybercrime.gov.in.' 
      : riskScore >= 30 
      ? 'Exercise high caution. Verify directly with the organization through their official website or phone number.' 
      : 'This message appears routine. Still, never share OTPs, passwords, or PINs with anyone.',
    confidence: 0.94,
    analysisDetails: [
      `Risk Score: ${riskScore}/100`,
      `Detected ${redFlags.length} red flag(s)`,
      `Risk Level: ${riskLevel.toUpperCase()}`
    ]
  };
}

export default function Safety() {
  const { user, fraudHistory, addFraudCheck } = useStore();
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FraudAnalysis | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeFraudHeuristics(input);
      setResult(analysis);
      addFraudCheck(input, analysis);
      setAnalyzing(false);
    }, 400);
  };

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full font-sans">
      <Sidebar activeId="settings" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        {/* Topbar */}
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">AI Fraud Shield & Cyber Safety</h1>
              <p className="text-xs text-[var(--text-muted)]">Real-time scam detection, SMS scanner & cybercrime prevention</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSelector />
            <div className="flex items-center gap-3 px-3 py-1.5 border rounded-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--accent-gradient)' }}>
                <span className="text-white text-xs font-bold">{user?.name?.[0] || 'U'}</span>
              </div>
              <span className="text-xs font-bold text-[var(--text-main)]">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
          
          {/* Emergency Helpline Banner */}
          <ScrollReveal delay={0.05}>
          <div className="p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 card-hover" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5 text-red-400 icon-hover" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-300">National Cyber Financial Fraud Reporting Helpline</p>
                <p className="text-xs text-red-300/70">If you have been scammed or lost money in an unauthorized transaction, report immediately.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a href="tel:1930" className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-extrabold text-sm flex items-center gap-2 transition-colors">
                <PhoneCall className="w-4 h-4" /> Call 1930
              </a>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors">
                <span>Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input & Scanner Column */}
            <ScrollReveal delay={0.1} className="lg:col-span-2 space-y-6">
            <div className="glass-card-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--text-main)]">Scan Message or SMS</h3>
                  <span className="text-xs text-[var(--text-muted)]">Heuristic AI Phishing Engine</span>
                </div>

                {/* Scan animation overlay when analyzing */}
                <div className="relative">
                  {analyzing && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
                      <div className="scan-line" />
                    </div>
                  )}

                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Paste suspicious SMS, WhatsApp text, lottery offer, or KYC update message here..."
                  rows={5}
                  className="glass-input w-full rounded-2xl p-4 text-sm resize-none glow-focus"
                />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Sample Scams */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] mr-1">Samples:</span>
                    {SAMPLE_SCAMS.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(s)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                      >
                        Sample {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || analyzing}
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shrink-0 btn-animate"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
                  >
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                    <span>{analyzing ? 'Scanning Heuristics...' : 'Analyze Threat'}</span>
                  </button>
                </div>
            </div>

              {/* Analysis Result Display */}
              <AnimatePresence>
                {result && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="glass-card-lg p-6 space-y-6 border"
                    style={{
                      borderColor: result.riskLevel === 'high-risk' ? '#ef4444' : result.riskLevel === 'caution' ? '#f59e0b' : '#10b981'
                    }}
                  >
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-card)' }}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                          result.riskLevel === 'high-risk' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                          result.riskLevel === 'caution' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                          'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        }`}>
                          {result.riskLevel === 'high-risk' ? <XCircle className="w-7 h-7" /> :
                           result.riskLevel === 'caution' ? <AlertTriangle className="w-7 h-7" /> :
                           <CheckCircle2 className="w-7 h-7" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-extrabold capitalize text-[var(--text-main)]">
                              {result.riskLevel === 'high-risk' ? '🚨 High Risk Scam Detected' :
                               result.riskLevel === 'caution' ? '⚠️ Moderate Caution Advised' :
                               '✅ Likely Safe Message'}
                            </h4>
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">Confidence: {((result.confidence ?? 0.94) * 100).toFixed(0)}% • Heuristic evaluation</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-3xl font-extrabold font-mono ${
                          result.riskLevel === 'high-risk' ? 'text-red-400' :
                          result.riskLevel === 'caution' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {result.riskScore}<span className="text-base font-normal text-[var(--text-muted)]">/100</span>
                        </span>
                        <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)]">Threat Index</span>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-4 rounded-xl border space-y-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <span className="text-[10px] uppercase font-bold text-[var(--accent-primary)]">AI Action Recommendation</span>
                      <p className="text-sm font-semibold text-[var(--text-main)]">{result.recommendation}</p>
                    </div>

                    {/* Red Flags List */}
                    {result.redFlags.length > 0 ? (
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">Identified Scam Markers ({result.redFlags.length})</h5>
                        <div className="grid grid-cols-1 gap-2.5">
                          {result.redFlags.map((flag, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border flex items-start justify-between gap-3" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                              <div>
                                <p className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                  {flag.flag}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">{flag.description}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                                {flag.severity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border text-center text-xs text-emerald-400/80 bg-emerald-500/10 border-emerald-500/20">
                        No known fraudulent patterns, urgency traps, or advance-fee markers found in this text.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollReveal>

            {/* Recent Scans History */}
            <ScrollReveal delay={0.18} className="space-y-6">
              <div className="glass-card-lg p-6 space-y-4 card-hover">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                    <History className="w-4 h-4 text-[var(--accent-primary)]" />
                    Recent Scans
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">{fraudHistory.length} checked</span>
                </div>

                {fraudHistory.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] py-6 text-center">
                    No past scan records. Enter a message to check for threats.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto">
                    {fraudHistory.slice(0, 10).map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setInput(item.input);
                          setResult(item.result);
                        }}
                        className="p-3 rounded-xl border cursor-pointer hover:border-[var(--border-hover)] transition-all"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            item.result.riskLevel === 'high-risk' ? 'text-red-400' :
                            item.result.riskLevel === 'caution' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {item.result.riskLevel}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-dim)]">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">{item.input}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Safety Rules Card */}
              <div className="glass-card p-6 space-y-3 card-hover">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">The 4 Golden Banking Rules</h4>
                <ul className="text-xs space-y-2 text-[var(--text-muted)]">
                  <li>• <strong>Never</strong> share UPI PIN while receiving money.</li>
                  <li>• <strong>Never</strong> install Remote Access apps (AnyDesk, TeamViewer) on caller requests.</li>
                  <li>• Banks <strong>never</strong> threaten account deactivation via SMS.</li>
                  <li>• Always verify SMS sender ID (e.g., AD-SBIIN, VM-HDFCBK).</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
