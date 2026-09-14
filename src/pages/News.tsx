import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, ExternalLink, Clock, TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import { mockNews } from '../data/mockNews';
import type { NewsItem } from '../types';

const sentimentTabs = ['All', 'Positive', 'Neutral', 'Negative'];

export default function News() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [impactFilter, setImpactFilter] = useState<string>('all');

  const filteredNews = useMemo(() => {
    return mockNews.filter((n) => {
      const matchSentiment = activeTab === 'All' || n.sentiment === activeTab.toLowerCase();
      const matchImpact = impactFilter === 'all' || n.impactLevel === impactFilter;
      return matchSentiment && matchImpact;
    });
  }, [activeTab, impactFilter]);

  const sentimentIcon = (s: string) => {
    if (s === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (s === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
    return <Minus className="w-3.5 h-3.5 text-amber-400" />;
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <PageWrapper title="News & AI Insights" subtitle="Market news with AI-powered sentiment analysis and impact assessment">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Tabs tabs={sentimentTabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex gap-2 sm:ml-auto">
          {['all', 'high', 'medium', 'low'].map((level) => (
            <button
              key={level}
              onClick={() => setImpactFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                impactFilter === level
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 border border-border-primary hover:text-white'
              }`}
            >
              {level === 'all' ? 'All Impact' : `${level.charAt(0).toUpperCase() + level.slice(1)} Impact`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed */}
        <div className={`${selectedNews ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          {filteredNews.map((news, i) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard
                hover
                padding="p-5"
                onClick={() => setSelectedNews(news)}
                className={selectedNews?.id === news.id ? 'border-blue-500/30' : ''}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {sentimentIcon(news.sentiment)}
                      <Badge
                        variant={news.sentiment === 'positive' ? 'success' : news.sentiment === 'negative' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {news.sentiment}
                      </Badge>
                      <Badge
                        variant={news.impactLevel === 'high' ? 'danger' : news.impactLevel === 'medium' ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {news.impactLevel} impact
                      </Badge>
                      <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(news.publishedAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-1.5 line-clamp-2">{news.title}</h3>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{news.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{news.source}</span>
                        {news.sector && <Badge variant="neutral" size="sm">{news.sector}</Badge>}
                      </div>
                      {news.companies.length > 0 && (
                        <div className="flex gap-1">
                          {news.companies.slice(0, 3).map((c) => (
                            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-600/50 text-blue-400">{c}</span>
                          ))}
                          {news.companies.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-600/50 text-slate-500">+{news.companies.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No news matching your filters</p>
            </div>
          )}
        </div>

        {/* News Detail */}
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard padding="p-0" className="sticky top-20">
              <div className="px-5 py-4 border-b border-border-primary">
                <div className="flex items-center gap-2 mb-2">
                  {sentimentIcon(selectedNews.sentiment)}
                  <Badge
                    variant={selectedNews.sentiment === 'positive' ? 'success' : selectedNews.sentiment === 'negative' ? 'danger' : 'warning'}
                  >
                    {selectedNews.sentiment}
                  </Badge>
                  <Badge
                    variant={selectedNews.impactLevel === 'high' ? 'danger' : 'warning'}
                  >
                    {selectedNews.impactLevel} impact
                  </Badge>
                </div>
                <h2 className="text-base font-semibold text-white">{selectedNews.title}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedNews.source} • {timeAgo(selectedNews.publishedAt)}
                </p>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">{selectedNews.description}</p>

                {/* AI Summary */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">AI Analysis</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedNews.aiSummary}</p>
                </div>

                {/* Related Stocks */}
                {selectedNews.companies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Affected Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNews.companies.map((c) => (
                        <span key={c} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15 text-xs font-medium text-blue-400">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Badge variant="neutral">{selectedNews.sector}</Badge>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
