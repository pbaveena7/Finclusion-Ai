import React, { useState, useMemo } from 'react';
import { 
  Search, Bell, Sparkles, Filter, Star, ExternalLink, Landmark, CheckCircle2,
  User, ChevronDown, ChevronUp, ShieldCheck, TrendingUp, Clock, IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useStore } from '../store/useStore';
import { mockSchemes } from '../data/mockSchemes';

const CATEGORIES = ['All', 'savings', 'women', 'pension', 'housing', 'agriculture', 'insurance'];
const ALL_TAGS = ['Tax Free', 'Govt Backed', 'High Interest', 'Retirement', 'Low Premium', 'First-Home Buyer', 'Collateral Free', 'Zero Balance'];

export default function Schemes() {
  const { user } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(mockSchemes.length > 0 ? mockSchemes[0].id : null);
  const [profileMatch, setProfileMatch] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filtered = useMemo(() => mockSchemes.filter(s => {
    const matchSearch = !search || 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.shortName.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || s.category.toLowerCase() === category.toLowerCase();
    
    return matchSearch && matchCat;
  }), [search, category, selectedTags, profileMatch]);

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full">
      <Sidebar activeId="schemes" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        {/* ── Header ── */}
        <header className="px-8 py-5 flex flex-wrap justify-between items-center gap-4 border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search schemes, tags, categories..." 
              className="glass-input w-full rounded-full py-2 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setProfileMatch(!profileMatch)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all border ${profileMatch ? 'text-white shadow-glow' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              style={profileMatch ? { background: 'var(--accent-gradient)', borderColor: 'var(--accent-primary)' } : { background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <User className="w-4 h-4" /> {profileMatch ? 'Matched to Profile' : 'Match My Profile'}
            </button>
            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <Bell className="w-4 h-4 text-[var(--text-main)]" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {/* ── Title ── */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Government Schemes</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {mockSchemes.length} curated schemes · Savings, Pension, Insurance, Housing & more
            </p>
          </div>

          {/* ── Stats bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '🏛️', label: 'Total Schemes', val: mockSchemes.length },
              { icon: '✅', label: 'Eligible for You', val: filtered.length },
              { icon: '💰', label: 'With Tax Benefit', val: mockSchemes.filter(s => s.taxBenefit !== 'None').length },
              { icon: '⭐', label: 'Featured', val: 3 },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-xl font-extrabold" style={{ color: 'var(--accent-primary)' }}>{stat.val}</p>
                  <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Category tabs ── */}
          <div className="flex gap-2 flex-wrap mb-4">
            {CATEGORIES.map(c => (
              <button 
                key={c} 
                onClick={() => setCategory(c)} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border capitalize ${
                  category === c 
                    ? 'text-white border-transparent shadow-glow-sm' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-card)] hover:border-[var(--border-hover)]'
                }`}
                style={category === c ? { background: 'var(--accent-gradient)' } : { background: 'transparent' }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* ── Schemes list ── */}
          <div className="space-y-4 mt-8">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Landmark className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
                <p className="text-lg font-bold mb-1 text-[var(--text-main)]">No schemes found</p>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Try clearing your filters or search.</p>
              </div>
            ) : (
              filtered.map((scheme, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  key={scheme.id} 
                  className={`glass-card overflow-hidden transition-all duration-300 ${expandedId === scheme.id ? 'border-[var(--accent-primary)] shadow-glow-sm' : 'hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]'}`}
                >
                  {/* ── Card header (click to expand) ── */}
                  <button
                    className="w-full p-6 text-left"
                    onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-4xl shrink-0 mt-0.5">{scheme.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize" style={{ background: 'var(--input-bg)', color: 'var(--text-dim)', borderColor: 'var(--border-card)' }}>
                              {scheme.category}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-lg text-[var(--text-main)] leading-tight">{scheme.name}</h3>
                          <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--text-muted)' }}>{scheme.shortName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-xl font-extrabold leading-tight" style={{ color: 'var(--accent-primary)' }}>{scheme.interestRate}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>Return / Cover</p>
                        </div>
                        <div className="shrink-0">
                          {expandedId === scheme.id 
                            ? <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /> 
                            : <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                          }
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* ── Expanded details ── */}
                  <AnimatePresence>
                    {expandedId === scheme.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t"
                        style={{ borderColor: 'var(--border-card)', background: 'var(--bg-surface)' }}
                      >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Left: Highlight + details */}
                          <div className="lg:col-span-2 space-y-5">
                            {/* Highlight */}
                            <div className="rounded-2xl p-5 border" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                                <Sparkles className="w-3 h-3" /> DESCRIPTION
                              </p>
                              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>{scheme.description}</p>
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { icon: IndianRupee, label: 'Min Amount', value: scheme.minInvestment },
                                { icon: IndianRupee, label: 'Max Amount', value: scheme.maxInvestment },
                                { icon: Clock, label: 'Tenure', value: scheme.lockInPeriod },
                                { icon: ShieldCheck, label: 'Tax Benefit', value: scheme.taxBenefit },
                                { icon: User, label: 'Eligibility', value: `Min Age: ${scheme.eligibility.minAge || 'Any'} | Gender: ${scheme.eligibility.gender || 'Any'}` },
                              ].map(item => (
                                <div key={item.label} className="rounded-xl p-4 border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                                  <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>{item.label}</p>
                                  <p className="font-bold text-sm text-[var(--text-main)] leading-snug">{item.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Features + Apply */}
                          <div className="space-y-4">
                            <div className="glass-card p-5">
                              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-main)' }}>
                                Key Features
                              </p>
                              <div className="space-y-3">
                                {scheme.features.map((f, i) => (
                                  <div key={i} className="flex items-start gap-3 text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
                                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} /> {f}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer" className="btn-primary w-full flex items-center justify-center gap-2 shadow-glow no-underline">
                              Official Portal <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
