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
              className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold transition-all ${
                impactFilter === level
                  ? 'bg-[#E8DEF8] text-[#1D192B] border border-transparent'
                  : 'text-[#49454F] border border-[#E7E0EC] hover:text-[#1C1B1F] hover:bg-[#F3EDF7]'
              }`}
            >
              {level === 'all' ? 'All Impact' : `${level.charAt(0).toUpperCase() + level.slice(1)} Impact`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* News Feed */}
        <div className={`${selectedNews ? 'lg:col-span-2 xl:col-span-3' : 'lg:col-span-3 xl:col-span-4'} space-y-4`}>
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
                className={selectedNews?.id === news.id ? 'border-[#6750A4] bg-[#F3EDF7]' : ''}
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
                      <span className="text-xs font-medium text-[#49454F] ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(news.publishedAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1C1B1F] mb-1.5 line-clamp-2">{news.title}</h3>
                    <p className="text-xs font-medium text-[#49454F] mb-3 line-clamp-2">{news.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#49454F]">{news.source}</span>
                        {news.sector && <Badge variant="neutral" size="sm">{news.sector}</Badge>}
                      </div>
                      {news.companies.length > 0 && (
                        <div className="flex gap-1">
                          {news.companies.slice(0, 3).map((c) => (
                            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-[8px] bg-[#E8DEF8] font-semibold text-[#6750A4]">{c}</span>
                          ))}
                          {news.companies.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-[8px] bg-[#F3EDF7] font-semibold text-[#49454F]">+{news.companies.length - 3}</span>
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
              <Filter className="w-8 h-8 text-[#49454F] mx-auto mb-3 opacity-50" />
              <p className="font-medium text-[#49454F]">No news matching your filters</p>
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
              <div className="px-5 py-4 border-b border-[#E7E0EC]">
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
                <h2 className="text-base font-bold text-[#1C1B1F]">{selectedNews.title}</h2>
                <p className="text-xs font-medium text-[#49454F] mt-1">
                  {selectedNews.source} • {timeAgo(selectedNews.publishedAt)}
                </p>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm font-medium text-[#1C1B1F] leading-relaxed">{selectedNews.description}</p>

                {/* AI Summary */}
                <div className="p-5 rounded-[24px] bg-[#E8DEF8] border-none">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-[#6750A4]" />
                    <h3 className="text-sm font-bold text-[#1D192B]">AI Analysis</h3>
                  </div>
                  <p className="text-xs font-medium text-[#49454F] leading-relaxed">{selectedNews.aiSummary}</p>
                </div>

                {/* Related Stocks */}
                {selectedNews.companies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1B1F] mb-2">Affected Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNews.companies.map((c) => (
                        <span key={c} className="px-3 py-1.5 rounded-[12px] bg-[#F3EDF7] border border-transparent text-xs font-semibold text-[#1D192B]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm font-semibold text-[#49454F]">
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
