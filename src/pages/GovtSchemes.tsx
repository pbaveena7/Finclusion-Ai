import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ExternalLink, User, Search } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import SearchInput from '../components/ui/SearchInput';
import { mockSchemes } from '../data/mockSchemes';
import { useStore } from '../store/useStore';
import type { GovtScheme } from '../types';

const categories = ['All', 'Savings', 'Pension', 'Insurance', 'Women', 'Agriculture', 'Housing'];

const catIcons: Record<string, string> = {
  savings: '🏛️', pension: '👴', insurance: '🛡️', women: '👩', agriculture: '🌾', housing: '🏘️',
};

export default function GovtSchemes() {
  const { user } = useStore();
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<GovtScheme | null>(null);

  const filteredSchemes = useMemo(() => {
    return mockSchemes.filter((s) => {
      const matchCat = activeCat === 'All' || s.category === activeCat.toLowerCase();
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.shortName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  const checkEligibility = (scheme: GovtScheme): { eligible: boolean; reasons: string[] } => {
    if (!user) return { eligible: false, reasons: ['Please complete your profile'] };
    const reasons: string[] = [];
    const e = scheme.eligibility;

    if (e.minAge && user.age < e.minAge) reasons.push(`Minimum age: ${e.minAge} (You: ${user.age})`);
    if (e.maxAge && user.age > e.maxAge) reasons.push(`Maximum age: ${e.maxAge} (You: ${user.age})`);
    if (e.gender && e.gender !== 'any' && e.gender !== user.gender) reasons.push(`Only for ${e.gender}`);
    if (e.incomeLimit && user.income * 12 > e.incomeLimit) reasons.push(`Income limit: ₹${(e.incomeLimit / 100000).toFixed(0)}L/year`);
    if (e.occupation && !e.occupation.some((o) => user.occupation.toLowerCase().includes(o.toLowerCase()))) {
      reasons.push(`Occupation: ${e.occupation.join(', ')}`);
    }

    return { eligible: reasons.length === 0, reasons };
  };

  return (
    <PageWrapper title="Government Schemes" subtitle="Discover schemes you're eligible for — savings, pension, insurance, and more">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCat === cat
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white border border-border-primary hover:border-border-hover'
              }`}
            >
              {cat !== 'All' && <span className="mr-1.5">{catIcons[cat.toLowerCase()]}</span>}
              {cat}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search schemes..." className="sm:max-w-xs sm:ml-auto" />
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme, i) => {
          const { eligible } = checkEligibility(scheme);

          return (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard hover padding="p-5" onClick={() => setSelectedScheme(scheme)}>
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{scheme.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white">{scheme.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{scheme.shortName}</p>
                  </div>
                  {eligible ? (
                    <Badge variant="success" dot>Eligible</Badge>
                  ) : (
                    <Badge variant="neutral">Check</Badge>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">{scheme.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-dark-700/50">
                    <p className="text-[10px] text-slate-500">Interest Rate</p>
                    <p className="text-xs font-bold text-emerald-400">{scheme.interestRate}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-700/50">
                    <p className="text-[10px] text-slate-500">Lock-in</p>
                    <p className="text-xs font-bold text-white">{scheme.lockInPeriod}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {scheme.features.slice(0, 2).map((f) => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded bg-dark-600/50 text-slate-400">{f}</span>
                  ))}
                  {scheme.features.length > 2 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-dark-600/50 text-slate-500">+{scheme.features.length - 2} more</span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Scheme Detail Modal */}
      <Modal isOpen={!!selectedScheme} onClose={() => setSelectedScheme(null)} title={selectedScheme?.name || ''} size="lg">
        {selectedScheme && (() => {
          const { eligible, reasons } = checkEligibility(selectedScheme);
          return (
            <div className="space-y-6">
              {/* Eligibility Banner */}
              <div className={`p-4 rounded-xl flex items-start gap-3 ${eligible ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                {eligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-semibold ${eligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {eligible ? '✓ You are eligible for this scheme!' : '✗ You may not be eligible'}
                  </p>
                  {!eligible && reasons.map((r) => (
                    <p key={r} className="text-xs text-slate-400 mt-1">• {r}</p>
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{selectedScheme.description}</p>

              {/* Key Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Interest Rate', value: selectedScheme.interestRate },
                  { label: 'Min Investment', value: selectedScheme.minInvestment },
                  { label: 'Max Investment', value: selectedScheme.maxInvestment },
                  { label: 'Lock-in Period', value: selectedScheme.lockInPeriod },
                  { label: 'Tax Benefit', value: selectedScheme.taxBenefit },
                  { label: 'Category', value: selectedScheme.category },
                ].map((d) => (
                  <div key={d.label} className="p-3 rounded-lg bg-dark-700/50">
                    <p className="text-xs text-slate-400">{d.label}</p>
                    <p className="text-sm font-medium text-white mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Key Features</h3>
                <div className="space-y-2">
                  {selectedScheme.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-300">{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={selectedScheme.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/20 text-amber-400 font-medium text-sm hover:text-white transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Visit Official Website
              </a>
            </div>
          );
        })()}
      </Modal>
    </PageWrapper>
  );
}
