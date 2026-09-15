import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Search, AlertTriangle, CheckCircle2, XCircle, Brain, History, Loader2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import type { FraudAnalysis } from '../types';

const sampleInputs = [
  'Congratulations! You won ₹50 Lakh in KBC lottery. Send ₹5,000 processing fee to claim.',
  'URGENT: Your SBI account will be blocked in 24 hours. Click here to verify KYC: http://sbi-kyc-update.xyz',
  'Invest in XYZ Crypto and get 500% guaranteed returns in 30 days! Limited slots available.',
  'Hi, this is your bank. Your fixed deposit of ₹10L is maturing. Visit your nearest branch.',
];

function analyzeForFraud(input: string): FraudAnalysis {
  const lower = input.toLowerCase();
  const redFlags: FraudAnalysis['redFlags'] = [];
  let riskScore = 10;

  if (lower.includes('congratulations') || lower.includes('won') || lower.includes('lottery')) {
    redFlags.push({ flag: 'Lottery/Prize Scam', description: 'Unsolicited prize claims are a classic fraud pattern', severity: 'high' });
    riskScore += 30;
  }
  if (lower.includes('processing fee') || lower.includes('send money') || lower.includes('pay')) {
    redFlags.push({ flag: 'Advance Fee Fraud', description: 'Legitimate prizes never require upfront payment', severity: 'high' });
    riskScore += 25;
  }
  if (lower.includes('urgent') || lower.includes('blocked') || lower.includes('suspended')) {
    redFlags.push({ flag: 'Urgency Tactic', description: 'Creating artificial urgency to prevent rational thinking', severity: 'high' });
    riskScore += 20;
  }
  if (lower.includes('click here') || lower.includes('http') || lower.includes('.xyz') || lower.includes('.tk')) {
    redFlags.push({ flag: 'Suspicious Link', description: 'Link may lead to phishing website. Check domain carefully.', severity: 'high' });
    riskScore += 25;
  }
  if (lower.includes('kyc') || lower.includes('verify') || lower.includes('update')) {
    redFlags.push({ flag: 'KYC Phishing', description: 'Banks never ask for KYC via SMS/WhatsApp links', severity: 'medium' });
    riskScore += 15;
  }
  if (lower.includes('guaranteed') || lower.includes('500%') || lower.includes('100%')) {
    redFlags.push({ flag: 'Unrealistic Returns', description: 'No legitimate investment guarantees such high returns', severity: 'high' });
    riskScore += 25;
  }
  if (lower.includes('limited') || lower.includes('slots') || lower.includes('last chance')) {
    redFlags.push({ flag: 'Scarcity Tactic', description: 'Artificial scarcity used to pressure quick decisions', severity: 'medium' });
    riskScore += 10;
  }
  if (lower.includes('crypto') && (lower.includes('guaranteed') || lower.includes('500%'))) {
    redFlags.push({ flag: 'Crypto Ponzi Scheme', description: 'High-return crypto schemes are often pyramid/Ponzi schemes', severity: 'high' });
    riskScore += 20;
  }

  riskScore = Math.min(riskScore, 100);
  const riskLevel: FraudAnalysis['riskLevel'] = riskScore >= 60 ? 'high-risk' : riskScore >= 30 ? 'caution' : 'safe';

  return {
    riskLevel,
    riskScore,
    redFlags,
    recommendation: riskLevel === 'high-risk'
      ? '🚨 This is very likely a FRAUD attempt. Do NOT respond, click links, or send money. Report to cybercrime.gov.in'
      : riskLevel === 'caution'
      ? '⚠️ Proceed with caution. Verify the sender independently. Never share OTP or personal details.'
      : '✅ This appears to be a legitimate communication. However, always verify through official channels.',
    analysisDetails: [
      `Scanned for ${8} known fraud patterns`,
      `Found ${redFlags.length} red flag(s)`,
      `Risk score: ${riskScore}/100`,
      riskLevel === 'safe' ? 'No immediate threats detected' : `${redFlags.length} suspicious indicators found`,
    ],
  };
}

export default function FraudDetection() {
  const { fraudHistory, addFraudCheck } = useStore();
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FraudAnalysis | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const analysis = analyzeForFraud(input);
    setResult(analysis);
    addFraudCheck(input, analysis);
    setAnalyzing(false);
  };

  const riskColors = {
    safe: { bg: 'bg-[#C4EED0]', text: 'text-emerald-700', ring: '#10b981' },
    caution: { bg: 'bg-[#FFE6C8]', text: 'text-amber-700', ring: '#f59e0b' },
    'high-risk': { bg: 'bg-[#FFD8E4]', text: 'text-rose-700', ring: '#f43f5e' },
  };

  return (
    <PageWrapper title="Fraud Detection" subtitle="AI-powered analysis to protect you from financial scams">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <GlassCard padding="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-[12px] bg-[#FFD8E4] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-[#31111D]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1C1B1F]">Analyze Suspicious Message</h2>
                <p className="text-xs font-semibold text-[#49454F] mt-0.5">Paste any suspicious SMS, WhatsApp, email or URL below</p>
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste suspicious message, offer, or URL here..."
              rows={4}
              className="w-full px-4 py-3 bg-[#F3EDF7] border border-transparent rounded-[16px] text-sm font-semibold text-[#1C1B1F] placeholder:text-[#49454F] focus:outline-none focus:border-[#6750A4] resize-none"
            />

            {/* Sample inputs */}
            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              <span className="text-xs font-semibold text-[#49454F]">Try:</span>
              {sampleInputs.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="text-xs font-medium px-2 py-1 rounded-[8px] bg-[#E8DEF8] text-[#1D192B] hover:bg-[#D0BCFF] transition-all truncate max-w-[200px]"
                >
                  {s.substring(0, 40)}...
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || analyzing}
              className="w-full h-11 rounded-[16px] bg-[#6750A4] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 flex items-center justify-center gap-2 shadow-sm"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" /> Analyze for Fraud
                </>
              )}
            </button>
          </GlassCard>

          {/* Analysis Progress */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard padding="p-6">
                  <div className="space-y-3">
                    {['Scanning for phishing patterns...', 'Checking known fraud databases...', 'Analyzing language patterns...', 'Generating risk assessment...'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#E8DEF8] flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-2 h-2 rounded-full bg-[#6750A4]"
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#1C1B1F]">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && !analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard padding="p-6" glow={result.riskLevel === 'high-risk' ? 'rose' : result.riskLevel === 'caution' ? 'amber' : 'emerald'}>
                  {/* Risk Score */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-bold text-[#49454F] mb-1">Risk Assessment</p>
                      <p className={`text-2xl font-bold ${riskColors[result.riskLevel].text}`}>
                        {result.riskLevel === 'high-risk' ? '🚨 HIGH RISK' : result.riskLevel === 'caution' ? '⚠️ CAUTION' : '✅ SAFE'}
                      </p>
                    </div>
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 -rotate-90">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="#E7E0EC" strokeWidth="6" />
                        <circle
                          cx="40" cy="40" r="34" fill="none"
                          stroke={riskColors[result.riskLevel].ring}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${(result.riskScore / 100) * 213.6} 213.6`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${riskColors[result.riskLevel].text}`}>
                        {result.riskScore}
                      </span>
                    </div>
                  </div>

                  {/* Red Flags */}
                  {result.redFlags.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-bold text-[#1C1B1F] mb-3">Red Flags Found ({result.redFlags.length})</p>
                      <div className="space-y-2">
                        {result.redFlags.map((rf) => (
                          <div key={rf.flag} className="flex items-start gap-3 p-3 rounded-[12px] bg-[#FFFBFE] border border-[#E7E0EC]">
                            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${rf.severity === 'high' ? 'text-rose-600' : 'text-amber-600'}`} />
                            <div>
                              <p className="text-sm font-bold text-[#1C1B1F]">{rf.flag}</p>
                              <p className="text-xs font-semibold text-[#49454F] mt-0.5">{rf.description}</p>
                            </div>
                            <Badge variant={rf.severity === 'high' ? 'danger' : 'warning'} size="sm" className="ml-auto shrink-0">
                              {rf.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className="p-5 rounded-[24px] bg-[#E8DEF8] border-none">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-[#6750A4]" />
                      <p className="text-sm font-bold text-[#1D192B]">AI Recommendation</p>
                    </div>
                    <p className="text-sm font-medium text-[#49454F]">{result.recommendation}</p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Sidebar */}
        <div className="space-y-4">
          <GlassCard padding="p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-[#49454F]" />
              <h3 className="text-sm font-bold text-[#1C1B1F]">Recent Checks</h3>
            </div>

            {fraudHistory.length === 0 ? (
              <p className="text-sm font-semibold text-[#49454F] text-center py-8">No checks yet. Analyze a message to start.</p>
            ) : (
              <div className="space-y-3">
                {fraudHistory.slice(0, 8).map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-[12px] bg-[#F3EDF7] cursor-pointer hover:bg-[#E8DEF8] transition-colors"
                    onClick={() => {
                      setInput(h.input);
                      setResult(h.result);
                    }}
                  >
                    <p className="text-xs font-semibold text-[#1C1B1F] truncate mb-1">{h.input.substring(0, 60)}...</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={h.result.riskLevel === 'high-risk' ? 'danger' : h.result.riskLevel === 'caution' ? 'warning' : 'success'}
                        size="sm"
                        dot
                      >
                        {h.result.riskLevel}
                      </Badge>
                      <span className="text-[10px] font-semibold text-[#49454F]">
                        {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Safety Tips */}
          <GlassCard padding="p-6">
            <h3 className="text-sm font-bold text-[#1C1B1F] mb-3">🛡️ Safety Tips</h3>
            <div className="space-y-2 text-xs font-semibold text-[#49454F]">
              <p>• Never share OTP, CVV, or PIN with anyone</p>
              <p>• Banks never ask for KYC via SMS links</p>
              <p>• If it sounds too good, it's probably a scam</p>
              <p>• Verify sender via official channels</p>
              <p>• Report fraud to cybercrime.gov.in</p>
              <p>• Use strong, unique passwords</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}
