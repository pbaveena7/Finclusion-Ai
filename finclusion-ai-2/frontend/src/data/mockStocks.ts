import type { StockData } from '../types';

const generateSparkline = (startPrice: number, volatility: number = 0.02) => {
  const data = [];
  let price = startPrice;
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    price = price * (1 + (Math.random() - 0.48) * volatility);
    data.push({ date: d.toISOString().split('T')[0], price: Math.round(price * 100) / 100 });
  }
  return data;
};

export const mockStocks: StockData[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 2980.45,
    change: 32.50,
    changePercent: 1.10,
    dayHigh: 2995.00,
    dayLow: 2940.10,
    yearHigh: 3024.90,
    yearLow: 2220.30,
    volume: 5420000,
    marketCap: '₹20.1T',
    pe: 28.4,
    eps: 104.9,
    sector: 'Conglomerate',
    historicalPrices: generateSparkline(2800),
    aiInsights: {
      trend: 'bullish',
      trendDescription: 'Reliance shows strong bullish momentum driven by retail expansion and telecom ARPU growth. Technical indicators suggest immediate resistance at 3020.',
      newsSentiment: 'positive',
      riskFactors: ['Global oil price volatility', 'High capital expenditure in new energy'],
    }
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1680.10,
    change: -12.40,
    changePercent: -0.73,
    dayHigh: 1705.00,
    dayLow: 1675.50,
    yearHigh: 1757.50,
    yearLow: 1363.55,
    volume: 14500000,
    marketCap: '₹12.8T',
    pe: 18.2,
    eps: 92.3,
    sector: 'Banking',
    historicalPrices: generateSparkline(1750, 0.015),
    aiInsights: {
      trend: 'neutral',
      trendDescription: 'Consolidating after recent merger adjustments. NIM pressure seems priced in, but credit growth remains robust. Good for long-term accumulation.',
      newsSentiment: 'neutral',
      riskFactors: ['Deposit growth lagging credit growth', 'Post-merger integration costs'],
    }
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 4100.00,
    change: 85.20,
    changePercent: 2.12,
    dayHigh: 4120.00,
    dayLow: 3990.00,
    yearHigh: 4184.75,
    yearLow: 3110.00,
    volume: 2100000,
    marketCap: '₹14.5T',
    pe: 31.5,
    eps: 130.1,
    sector: 'IT',
    historicalPrices: generateSparkline(3800),
    aiInsights: {
      trend: 'bullish',
      trendDescription: 'Strong breakout on the back of large deal wins and AI-driven transformation projects in the US market.',
      newsSentiment: 'positive',
      riskFactors: ['US macro slowdown', 'Attrition in niche digital skills'],
    }
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: 1420.75,
    change: -25.30,
    changePercent: -1.75,
    dayHigh: 1455.00,
    dayLow: 1415.00,
    yearHigh: 1733.00,
    yearLow: 1215.45,
    volume: 6800000,
    marketCap: '₹5.9T',
    pe: 24.1,
    eps: 58.9,
    sector: 'IT',
    historicalPrices: generateSparkline(1500, 0.025),
    aiInsights: {
      trend: 'bearish',
      trendDescription: 'Recent guidance cut has dampened sentiment. Trading below 50-day moving average indicating short-term weakness.',
      newsSentiment: 'negative',
      riskFactors: ['Client budget cuts in discretionary tech', 'Senior management exits'],
    }
  },
  {
    symbol: 'ZOMATO',
    name: 'Zomato Ltd.',
    price: 185.40,
    change: 8.90,
    changePercent: 5.04,
    dayHigh: 188.00,
    dayLow: 175.20,
    yearHigh: 190.00,
    yearLow: 50.35,
    volume: 45000000,
    marketCap: '₹1.6T',
    pe: 145.2,
    eps: 1.2,
    sector: 'Consumer Tech',
    historicalPrices: generateSparkline(150, 0.04),
    aiInsights: {
      trend: 'bullish',
      trendDescription: 'Blinkit (quick commerce) achieving profitability ahead of schedule is driving a massive re-rating of the stock.',
      newsSentiment: 'positive',
      riskFactors: ['High valuation multiple', 'Intense competition in quick commerce'],
    }
  }
];
