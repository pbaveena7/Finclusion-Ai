import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Search, X, Star, Brain } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import AreaChartComponent from '../components/charts/AreaChart';
import SearchInput from '../components/ui/SearchInput';
import { mockStocks } from '../data/mockStocks';
import type { StockData } from '../types';

const sectors = ['All', 'IT', 'Banking', 'Energy', 'Auto', 'Pharma', 'FMCG', 'Telecom', 'Consumer', 'Infrastructure', 'NBFC', 'Conglomerate'];

export default function Stocks() {
  const [search, setSearch] = useState('');
  const [activeSector, setActiveSector] = useState('All');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'HDFCBANK', 'INFY']);

  const filteredStocks = useMemo(() => {
    return mockStocks.filter((s) => {
      const matchSearch = s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase());
      const matchSector = activeSector === 'All' || s.sector === activeSector;
      return matchSearch && matchSector;
    });
  }, [search, activeSector]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const trendBadge = (trend: string) => {
    const v = trend === 'bullish' ? 'success' : trend === 'bearish' ? 'danger' : 'warning';
    return <Badge variant={v as any} dot>{trend}</Badge>;
  };

  return (
    <PageWrapper title="Stocks" subtitle="Real-time market data with AI-powered insights">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or symbol..."
          className="sm:max-w-sm"
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSector === sector
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white border border-border-primary hover:border-border-hover'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Grid */}
        <div className={`${selectedStock ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredStocks.map((stock, i) => (
                <motion.div
                  key={stock.symbol}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassCard
                    hover
                    padding="p-4"
                    onClick={() => setSelectedStock(stock)}
                    className={selectedStock?.symbol === stock.symbol ? 'border-emerald-500/30' : ''}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{stock.symbol}</h3>
                          {trendBadge(stock.aiInsights.trend)}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{stock.name}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(stock.symbol);
                        }}
                        className="p-1"
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            watchlist.includes(stock.symbol)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">₹{stock.price.toLocaleString('en-IN')}</p>
                        <p className={`text-xs font-medium flex items-center gap-1 ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                      {/* Mini sparkline */}
                      <div className="w-20 h-10">
                        <AreaChartComponent
                          data={stock.historicalPrices.slice(-15)}
                          dataKey="price"
                          height={40}
                          color={stock.change >= 0 ? '#10b981' : '#f43f5e'}
                          gradientId={`spark-${stock.symbol}`}
                          showGrid={false}
                          showAxis={false}
                          showTooltip={false}
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredStocks.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No stocks found matching your search</p>
            </div>
          )}
        </div>

        {/* Stock Detail Panel */}
        <AnimatePresence>
          {selectedStock && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="lg:col-span-1"
            >
              <GlassCard padding="p-0" className="sticky top-20">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border-primary flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedStock.symbol}</h2>
                    <p className="text-xs text-slate-400">{selectedStock.name}</p>
                  </div>
                  <button onClick={() => setSelectedStock(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Price */}
                  <div>
                    <p className="text-3xl font-bold text-white">₹{selectedStock.price.toLocaleString('en-IN')}</p>
                    <p className={`text-sm font-medium mt-1 ${selectedStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </p>
                  </div>

                  {/* Chart */}
                  <AreaChartComponent
                    data={selectedStock.historicalPrices}
                    dataKey="price"
                    height={180}
                    color={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'}
                    gradientId="detailChart"
                  />

                  {/* Day Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-dark-700/50">
                      <p className="text-xs text-slate-400">Day Low</p>
                      <p className="text-sm font-medium text-white">₹{selectedStock.dayLow.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-dark-700/50">
                      <p className="text-xs text-slate-400">Day High</p>
                      <p className="text-sm font-medium text-white">₹{selectedStock.dayHigh.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Fundamentals */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Fundamentals</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        { label: 'Market Cap', value: selectedStock.marketCap },
                        { label: 'P/E Ratio', value: selectedStock.pe.toString() },
                        { label: 'EPS', value: `₹${selectedStock.eps}` },
                        { label: 'Volume', value: (selectedStock.volume / 1000000).toFixed(1) + 'M' },
                        { label: '52W High', value: `₹${selectedStock.yearHigh.toLocaleString('en-IN')}` },
                        { label: '52W Low', value: `₹${selectedStock.yearLow.toLocaleString('en-IN')}` },
                      ].map((f) => (
                        <div key={f.label} className="flex justify-between py-1.5 border-b border-border-primary">
                          <span className="text-slate-400">{f.label}</span>
                          <span className="text-white font-medium">{f.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white">AI Analysis</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{selectedStock.aiInsights.trendDescription}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400">Trend:</span>
                      {trendBadge(selectedStock.aiInsights.trend)}
                      <span className="text-xs text-slate-400 ml-2">Sentiment:</span>
                      <Badge
                        variant={selectedStock.aiInsights.newsSentiment === 'positive' ? 'success' : selectedStock.aiInsights.newsSentiment === 'negative' ? 'danger' : 'warning'}
                      >
                        {selectedStock.aiInsights.newsSentiment}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-400 mb-1">Risk Factors:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStock.aiInsights.riskFactors.map((r) => (
                          <Badge key={r} variant="neutral" size="sm">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
