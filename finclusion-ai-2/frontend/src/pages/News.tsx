import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, TrendingUp, TrendingDown, Minus, Clock, 
  Sparkles, ExternalLink, Filter, Building2, ChevronRight, X, ShieldAlert 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import { useStore } from '../store/useStore';
import { mockNews } from '../data/mockNews';
import type { NewsItem } from '../types';
import ScrollReveal from '../components/animations/ScrollReveal';

export default function News() {
  const { user } = useStore();
  const [activeSentiment, setActiveSentiment] = useState('all');
  const [activeImpact, setActiveImpact] = useState('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const filteredNews = useMemo(() => {
    return mockNews.filter(n => {
      const matchSentiment = activeSentiment === 'all' || n.sentiment === activeSentiment;
      const matchImpact = activeImpact === 'all' || n.impactLevel === activeImpact;
      return matchSentiment && matchImpact;
    });
  }, [activeSentiment, activeImpact]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full font-sans">
      <Sidebar activeId="investments" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        {/* Topbar */}
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">Market News & AI Insights</h1>
              <p className="text-xs text-[var(--text-muted)]">Real-time financial intelligence and AI sentiment analysis</p>
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
          
          {/* Market Sentiment Barometer Banner */}
          <ScrollReveal delay={0.1}>
          <div className="glass-card-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden card-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--border-card)' }}>
                <Sparkles className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)]">AI Market Sentiment Barometer</h3>
                <p className="text-xs text-[var(--text-muted)]">Aggregated from 1,200+ news feeds, earnings transcripts & regulatory filings</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-emerald-400">72% Bullish</span>
                <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)]">NIFTY 50 / SENSEX</span>
              </div>
              <div className="w-32 h-2.5 rounded-full overflow-hidden bg-white/10 flex">
                <div className="h-full bg-emerald-400" style={{ width: '72%' }} />
                <div className="h-full bg-amber-400" style={{ width: '18%' }} />
                <div className="h-full bg-rose-400" style={{ width: '10%' }} />
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Sentiment Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              {['all', 'positive', 'neutral', 'negative'].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSentiment(s)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                    activeSentiment === s ? 'text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  style={activeSentiment === s ? { background: 'var(--accent-gradient)' } : {}}
                >
                  {s === 'all' ? 'All Sentiments' : s === 'positive' ? '🟢 Bullish' : s === 'negative' ? '🔴 Bearish' : '🟡 Neutral'}
                </button>
              ))}
            </div>

            {/* Impact Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-dim)] font-bold uppercase tracking-wider">Impact:</span>
              <div className="flex gap-1">
                {['all', 'high', 'medium', 'low'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setActiveImpact(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      activeImpact === lvl
                        ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                    style={{ background: activeImpact === lvl ? 'var(--input-bg)' : 'transparent' }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* News Cards Grid */}
          <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, idx) => {
              const isPositive = item.sentiment === 'positive';
              const isNegative = item.sentiment === 'negative';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedNews(item)}
                  className="glass-card-lg p-6 flex flex-col justify-between cursor-pointer group hover:border-[var(--border-hover)] hover:scale-[1.01] transition-all card-hover"
                >
                  <div>
                    {/* Meta bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          isNegative ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {item.sentiment}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
                          {item.sector}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-dim)] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {timeAgo(item.publishedAt)}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-base font-bold mb-2 text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* AI Summary Box */}
                  <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-card)' }}>
                    <div className="p-3 rounded-xl border space-y-1.5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                        <Sparkles className="w-3 h-3" /> AI Market Takeaway
                      </div>
                      <p className="text-xs text-[var(--text-main)] line-clamp-2 leading-relaxed">
                        {item.aiSummary}
                      </p>
                    </div>

                    {/* Company Tickers */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.companies?.map(comp => (
                          <span key={comp} className="px-2 py-0.5 rounded font-mono text-[10px] font-bold border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)', color: 'var(--text-muted)' }}>
                            ${comp}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--accent-primary)' }}>
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          </ScrollReveal>
        </div>
      </main>

      {/* Deep-Dive News Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border flex flex-col overflow-hidden shadow-2xl"
              style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-hover)' }}
            >
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-card)' }}>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    selectedNews.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    selectedNews.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {selectedNews.sentiment} Sentiment
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">• {selectedNews.source}</span>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="p-2 rounded-full hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-main)] mb-2">{selectedNews.title}</h2>
                  <p className="text-xs text-[var(--text-dim)] font-mono">{new Date(selectedNews.publishedAt).toLocaleString()}</p>
                </div>

                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {selectedNews.description}
                </p>

                {/* AI Analysis Box */}
                <div className="p-5 rounded-2xl border space-y-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-hover)' }}>
                  <div className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>
                    <Sparkles className="w-4 h-4" /> Comprehensive AI Impact Analysis
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-main)]">
                    {selectedNews.aiSummary}
                  </p>

                  <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-card)' }}>
                    <span className="text-xs text-[var(--text-muted)]">Impact Rating: <strong className="uppercase text-[var(--text-main)]">{selectedNews.impactLevel}</strong></span>
                    <div className="flex gap-1.5">
                      {selectedNews.companies?.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white/5 text-[var(--accent-primary)]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t flex justify-end" style={{ borderColor: 'var(--border-card)' }}>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white hover:brightness-110 transition-all"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
