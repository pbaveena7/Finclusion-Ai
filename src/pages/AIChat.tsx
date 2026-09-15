import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Brain, TrendingUp, ShieldAlert, Landmark, Target, RotateCcw } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import type { ChatMessage } from '../types';

const quickActions = [
  { label: 'Analyze my portfolio', icon: TrendingUp, color: 'text-emerald-400' },
  { label: 'Suggest best SIPs', icon: Target, color: 'text-blue-400' },
  { label: 'Check fraud message', icon: ShieldAlert, color: 'text-rose-400' },
  { label: 'Govt schemes for me', icon: Landmark, color: 'text-amber-400' },
];

const aiResponses: Record<string, string> = {
  'analyze my portfolio': `📊 **Portfolio Analysis for Naveen**

Your portfolio is well-diversified with ₹10.42L across 15 holdings:

✅ **Strengths:**
• 19.14% overall returns — outperforming Nifty's 15.2%
• Good mix of equity (61%) and debt (13%)
• Gold allocation (8.2%) provides hedge

⚠️ **Areas to Improve:**
• Consider reducing direct stock concentration
• Add international exposure (Nasdaq 100 fund)
• Emergency fund (PPF + FD) could be higher

💡 **AI Recommendation:**
Start a ₹5,000/month SIP in Motilal Oswal Nasdaq 100 FOF for geographic diversification. Also increase debt allocation to 20% for your moderate risk profile.`,

  'suggest best sips': `🎯 **Personalized SIP Recommendations**

Based on your moderate risk profile, ₹1.2L income, and goals:

**Core Portfolio (60% allocation):**
1. 📌 Navi Nifty 50 Index Fund — ₹5,000/mo
   • Ultra-low cost (0.06%), passive growth
2. 📌 Parag Parikh Flexi Cap — ₹5,000/mo
   • Global diversification, consistent alpha

**Growth Portfolio (30%):**
3. 📌 HDFC Mid-Cap Opportunities — ₹3,000/mo
   • 22.1% 3Y CAGR, top-rated fund
4. 📌 Mirae Asset Tax Saver — ₹4,000/mo
   • Dual benefit: growth + 80C tax saving

**Tactical (10%):**
5. 📌 Motilal Oswal Nasdaq 100 FOF — ₹3,000/mo
   • US tech exposure, portfolio hedge

**Total Monthly SIP: ₹20,000** (16.7% of income ✅)`,

  'check fraud message': `🛡️ I can help you check suspicious messages!

To analyze a message for fraud:
1. Go to the **Fraud Detection** page
2. Paste the suspicious SMS/WhatsApp/email
3. Our AI will scan for phishing, scam patterns, and red flags

**Quick Safety Tips:**
🚫 Never share OTP, PIN, or CVV
🚫 Don't click links from unknown senders
🚫 Legitimate banks never ask for KYC via SMS
✅ Verify through official bank app/website
✅ Report to cybercrime.gov.in if suspicious`,

  'govt schemes for me': `🏛️ **Government Schemes You're Eligible For:**

Based on your profile (28, Male, ₹14.4L income):

1. 🏛️ **PPF** (Public Provident Fund)
   • 7.1% guaranteed, 80C benefit
   • ✅ You already have ₹1.2L invested

2. 📊 **NPS** (National Pension System)
   • Extra ₹50,000 tax deduction under 80CCD(1B)
   • ✅ You have ₹42,500 — consider increasing

3. 🛡️ **PMSBY** (Accident Insurance)
   • ₹2L cover for just ₹20/year!
   • ✅ Highly recommended

4. 💚 **PMJJBY** (Life Insurance)
   • ₹2L cover for ₹436/year
   • ✅ Essential if you have dependents

5. 🏘️ **PMAY** (Housing Subsidy)
   • Interest subsidy on home loan
   • ✅ Eligible for MIG-I category

**Tax Saving Potential: ₹2L+ per year** 💰`,

  default: `I'm your Finclusion AI assistant! I can help you with:

📊 Portfolio analysis & optimization
🎯 SIP & investment recommendations
📈 Stock & mutual fund research
🏛️ Government scheme eligibility
🛡️ Fraud detection & safety
💰 Tax saving strategies
📐 Loan & EMI calculations
📚 Financial education

What would you like help with?`,
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(aiResponses)) {
    if (key !== 'default' && lower.includes(key)) return response;
  }

  // Keyword matching
  if (lower.includes('portfolio') || lower.includes('holdings')) return aiResponses['analyze my portfolio'];
  if (lower.includes('sip') || lower.includes('invest') || lower.includes('recommend')) return aiResponses['suggest best sips'];
  if (lower.includes('fraud') || lower.includes('scam') || lower.includes('suspicious')) return aiResponses['check fraud message'];
  if (lower.includes('scheme') || lower.includes('government') || lower.includes('govt')) return aiResponses['govt schemes for me'];
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('help')) return aiResponses['default'];

  return `Great question! Based on my analysis:\n\n${aiResponses['default']}`;
}

export default function AIChat() {
  const { chatMessages, addChatMessage, clearChat, user } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
      type: 'text',
    };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // Simulate AI typing delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

    const aiMsg: ChatMessage = {
      id: `msg_${Date.now()}_ai`,
      role: 'ai',
      content: getAIResponse(text),
      timestamp: new Date(),
      type: text.toLowerCase().includes('fraud') || text.toLowerCase().includes('scam') ? 'warning' : 'text',
    };
    addChatMessage(aiMsg);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto h-[calc(100vh-9rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[16px] bg-[#6750A4] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1C1B1F] leading-tight">Finclusion AI Assistant</h1>
              <p className="text-xs font-semibold text-[#49454F] flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                Online • Powered by AI
              </p>
            </div>
          </div>
          <button onClick={clearChat} className="w-9 h-9 flex items-center justify-center rounded-[12px] text-[#49454F] hover:text-[#1C1B1F] hover:bg-[#F3EDF7] transition-all" title="Clear chat">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-[24px] bg-[#FFFBFE] border border-[#E7E0EC] p-4 space-y-4 mb-4 shadow-sm">
          {chatMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-[24px] bg-[#E8DEF8] flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-[#6750A4]" />
              </div>
              <h2 className="text-lg font-bold text-[#1C1B1F] mb-2">
                Hi {user?.name?.split(' ')[0] || 'there'}! I'm your AI Financial Advisor
              </h2>
              <p className="text-sm font-medium text-[#49454F] max-w-md mx-auto">
                Ask me anything about investments, portfolio analysis, tax saving, government schemes, or fraud detection.
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mt-6 max-w-md mx-auto">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(action.label)}
                    className="flex items-center gap-2 p-3 rounded-[16px] bg-[#F3EDF7] border border-transparent hover:border-[#6750A4]/30 text-left transition-all"
                  >
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                    <span className="text-xs font-semibold text-[#1C1B1F]">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-[12px] bg-[#E8DEF8] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#6750A4]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-[24px] px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#E8DEF8] border-none text-[#1D192B]'
                      : msg.type === 'warning'
                      ? 'bg-[#FFD8E4] border-none text-[#31111D]'
                      : 'bg-[#F3EDF7] border-none text-[#1C1B1F]'
                  }`}
                >
                  <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold my-1">{line.slice(2, -2)}</p>;
                      if (line.includes('**')) {
                        return (
                          <p key={i} className="my-0.5">
                            {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                              part.startsWith('**') && part.endsWith('**')
                                ? <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
                                : part
                            )}
                          </p>
                        );
                      }
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i} className="my-0.5">{line}</p>;
                    })}
                  </div>
                  <p className="text-[10px] text-[#49454F] mt-2 font-semibold">
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-[12px] bg-[#E7E0EC] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#49454F]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-[12px] bg-[#E8DEF8] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#6750A4]" />
              </div>
              <div className="bg-[#F3EDF7] border-none rounded-[24px] px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#6750A4] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[#6750A4] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[#6750A4] typing-dot" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (when chat has messages) */}
        {chatMessages.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-semibold text-[#49454F] hover:text-[#1D192B] bg-[#F3EDF7] hover:bg-[#E8DEF8] transition-all"
              >
                <action.icon className={`w-3 h-3 ${action.color}`} />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your finances..."
            className="flex-1 h-12 px-5 bg-[#F3EDF7] border border-transparent rounded-[16px] text-sm font-semibold text-[#1C1B1F] placeholder:text-[#49454F] focus:outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4] transition-all"
            disabled={isTyping}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isTyping}
            className="h-12 px-5 rounded-[16px] bg-[#6750A4] text-white font-semibold disabled:opacity-50 transition-opacity flex items-center justify-center shrink-0 shadow-sm hover:bg-[#523F84]"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </PageWrapper>
  );
}
