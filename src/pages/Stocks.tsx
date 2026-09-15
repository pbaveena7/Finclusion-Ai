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
              className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold whitespace-nowrap transition-all ${
                activeSector === sector
                  ? 'bg-[#E8DEF8] text-[#1D192B] border border-transparent'
                  : 'text-[#49454F] hover:text-[#1C1B1F] border border-[#E7E0EC] hover:bg-[#F3EDF7]'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[700px]">
        {/* Market Watchlist (Left Pane) */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col border border-[#E7E0EC] bg-[#FFFBFE] rounded-[24px] overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-[#E7E0EC] bg-[#F3EDF7] flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#49454F] uppercase tracking-wider">Symbol</span>
            <span className="text-[10px] font-bold text-[#49454F] uppercase tracking-wider">Price / Chg</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredStocks.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-8 h-8 text-[#49454F] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium text-[#49454F]">No stocks found</p>
              </div>
            ) : (
              filteredStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`w-full text-left px-4 py-3 border-b border-[#E7E0EC] flex items-center justify-between hover:bg-[#F3EDF7] transition-colors ${
                    selectedStock?.symbol === stock.symbol
                      ? 'bg-[#E8DEF8] border-l-4 border-l-[#6750A4]'
                      : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-bold text-[#1C1B1F] truncate">{stock.symbol}</p>
                    <p className="text-[10px] font-medium text-[#49454F] truncate">{stock.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono tabular-nums font-semibold text-[#1C1B1F]">₹{stock.price.toLocaleString('en-IN')}</p>
                    <p className={`text-[10px] font-mono tabular-nums font-bold ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detailed Chart & Fundamentals (Right Pane) */}
        <div className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {selectedStock ? (
              <motion.div
                key={selectedStock.symbol}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col border border-[#E7E0EC] rounded-[24px] bg-[#FFFBFE] overflow-hidden shadow-sm"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E7E0EC] flex flex-wrap gap-4 items-center justify-between bg-[#F3EDF7]">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#1C1B1F] flex items-center gap-2">
                        {selectedStock.symbol}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(selectedStock.symbol);
                          }}
                          className="p-1 hover:bg-[#E8DEF8] rounded-[8px]"
                        >
                          <Star
                            className={`w-4 h-4 transition-colors ${
                              watchlist.includes(selectedStock.symbol)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-[#49454F] hover:text-[#1C1B1F]'
                            }`}
                          />
                        </button>
                      </h2>
                      <p className="text-xs font-semibold text-[#49454F]">{selectedStock.name}</p>
                    </div>
                    <div className="h-10 w-px bg-[#E7E0EC] hidden sm:block"></div>
                    <div className="hidden sm:block">
                      <p className="text-2xl font-mono tabular-nums font-bold text-[#1C1B1F]">₹{selectedStock.price.toLocaleString('en-IN')}</p>
                      <p className={`text-xs font-mono tabular-nums font-bold ${selectedStock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {trendBadge(selectedStock.aiInsights.trend)}
                    <Badge variant={selectedStock.aiInsights.newsSentiment === 'positive' ? 'success' : selectedStock.aiInsights.newsSentiment === 'negative' ? 'danger' : 'warning'}>
                      {selectedStock.aiInsights.newsSentiment} Sentiment
                    </Badge>
                  </div>
                </div>

                {/* Main Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                  {/* Chart */}
                  <div className="mb-6 h-[400px] border border-[#E7E0EC] rounded-[16px] bg-[#FFFBFE] p-2 shadow-sm">
                    <AreaChartComponent
                      data={selectedStock.historicalPrices}
                      dataKey="price"
                      height={380}
                      color={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'}
                      gradientId="mainDetailChart"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fundamentals */}
                    <div>
                      <h3 className="text-sm font-bold text-[#1C1B1F] mb-3 border-b border-[#E7E0EC] pb-2">Technical & Fundamentals</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {[
                          { label: 'Day Range', value: `₹${selectedStock.dayLow} - ₹${selectedStock.dayHigh}` },
                          { label: '52W Range', value: `₹${selectedStock.yearLow} - ₹${selectedStock.yearHigh}` },
                          { label: 'Market Cap', value: selectedStock.marketCap },
                          { label: 'Volume', value: (selectedStock.volume / 1000000).toFixed(1) + 'M' },
                          { label: 'P/E Ratio', value: selectedStock.pe.toString() },
                          { label: 'EPS (TTM)', value: `₹${selectedStock.eps}` },
                        ].map((f) => (
                          <div key={f.label} className="flex justify-between py-1.5 border-b border-[#E7E0EC]/50">
                            <span className="text-xs font-semibold text-[#49454F]">{f.label}</span>
                            <span className="text-xs font-mono tabular-nums text-[#1D192B] font-bold">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div>
                      <h3 className="text-sm font-bold text-[#1C1B1F] mb-3 border-b border-[#E7E0EC] pb-2 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-[#6750A4]" /> AI Analysis
                      </h3>
                      <p className="text-xs font-medium text-[#49454F] leading-relaxed mb-4 bg-[#F3EDF7] p-4 rounded-[16px]">
                        {selectedStock.aiInsights.trendDescription}
                      </p>
                      
                      <p className="text-xs font-bold text-[#1D192B] mb-2">Key Risk Factors</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedStock.aiInsights.riskFactors.map((r) => (
                          <Badge key={r} variant="neutral" size="sm">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center border border-[#E7E0EC] rounded-[24px] bg-[#FFFBFE] shadow-sm"
              >
                <div className="w-16 h-16 rounded-[16px] bg-[#F3EDF7] flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-[#6750A4]" />
                </div>
                <h3 className="text-[#1C1B1F] font-bold mb-1">Select an Asset</h3>
                <p className="text-sm font-medium text-[#49454F]">Choose a stock from the watchlist to view its technical analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
