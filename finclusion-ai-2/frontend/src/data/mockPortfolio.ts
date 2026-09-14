import type { Portfolio } from '../types';

export const mockPortfolio: Portfolio = {
  totalInvested: 875000,
  currentValue: 1042500,
  totalPnl: 167500,
  totalPnlPercent: 19.14,
  allocation: [
    { category: 'Equity (Stocks)', value: 450000, percentage: 43.1, color: '#3b82f6' }, // Blue
    { category: 'Mutual Funds', value: 380000, percentage: 36.4, color: '#10b981' }, // Emerald
    { category: 'Fixed Deposits', value: 100000, percentage: 9.6, color: '#f59e0b' }, // Amber
    { category: 'Gold', value: 85000, percentage: 8.2, color: '#eab308' }, // Yellow
    { category: 'PPF', value: 27500, percentage: 2.7, color: '#8b5cf6' }, // Purple
  ],
  holdings: [
    {
      id: 'h1',
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      type: 'stock',
      quantity: 50,
      buyPrice: 2450,
      currentPrice: 2980,
      investedAmount: 122500,
      currentValue: 149000,
      pnl: 26500,
      pnlPercent: 21.6,
    },
    {
      id: 'h2',
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      type: 'stock',
      quantity: 100,
      buyPrice: 1550,
      currentPrice: 1680,
      investedAmount: 155000,
      currentValue: 168000,
      pnl: 13000,
      pnlPercent: 8.3,
    },
    {
      id: 'h3',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      type: 'stock',
      quantity: 30,
      buyPrice: 3400,
      currentPrice: 4100,
      investedAmount: 102000,
      currentValue: 123000,
      pnl: 21000,
      pnlPercent: 20.5,
    },
    {
      id: 'h4',
      symbol: 'INFY',
      name: 'Infosys',
      type: 'stock',
      quantity: 40,
      buyPrice: 1650,
      currentPrice: 1420,
      investedAmount: 66000,
      currentValue: 56800,
      pnl: -9200,
      pnlPercent: -13.9,
    },
    {
      id: 'h5',
      symbol: 'PARAG_FLEXI',
      name: 'Parag Parikh Flexi Cap Fund',
      type: 'mutualfund',
      quantity: 3500.5,
      buyPrice: 55.4,
      currentPrice: 68.2,
      investedAmount: 193927,
      currentValue: 238734,
      pnl: 44807,
      pnlPercent: 23.1,
    },
    {
      id: 'h6',
      symbol: 'SBI_SMALL',
      name: 'SBI Small Cap Fund',
      type: 'mutualfund',
      quantity: 1200.75,
      buyPrice: 110.5,
      currentPrice: 145.8,
      investedAmount: 132682,
      currentValue: 175069,
      pnl: 42387,
      pnlPercent: 31.9,
    },
    {
      id: 'h7',
      symbol: 'SGB_2023',
      name: 'SGB Series I 2023-24',
      type: 'gold',
      quantity: 15,
      buyPrice: 4800,
      currentPrice: 5666.66,
      investedAmount: 72000,
      currentValue: 85000,
      pnl: 13000,
      pnlPercent: 18.0,
    },
  ],
};

// Generate 6 months of historical portfolio value for charts
export const generatePortfolioHistory = () => {
  const data = [];
  const today = new Date();
  let baseValue = 850000;
  
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Add some random walk to make it look realistic
    const randomChange = (Math.random() - 0.45) * 5000;
    baseValue += randomChange;
    
    // Add systematic investment every 30 days
    if (i % 30 === 0) {
      baseValue += 15000; // Monthly SIP
    }
    
    data.push({
      date: d.toISOString().split('T')[0],
      value: Math.round(baseValue),
    });
  }
  
  // Ensure the last value matches the current portfolio value
  data[data.length - 1].value = mockPortfolio.currentValue;
  
  return data;
};
