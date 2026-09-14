import type { MutualFund } from '../types';

export const mockMutualFunds: MutualFund[] = [
  {
    schemeCode: 'PPFAS01',
    schemeName: 'Parag Parikh Flexi Cap Fund Direct Growth',
    fundHouse: 'PPFAS Mutual Fund',
    category: 'equity',
    subCategory: 'Flexi Cap',
    nav: 68.24,
    returns: { oneYear: 28.4, threeYear: 22.1, fiveYear: 24.5 },
    rating: 5,
    riskLevel: 'very-high',
    minSIP: 1000,
    aum: '₹45,000 Cr',
    expenseRatio: 0.65,
    aiSuitability: 'Excellent core portfolio fund. Unique advantage of up to 35% international equity exposure provides geographical diversification and hedge against INR depreciation.'
  },
  {
    schemeCode: 'SBI01',
    schemeName: 'SBI Small Cap Fund Direct Growth',
    fundHouse: 'SBI Mutual Fund',
    category: 'equity',
    subCategory: 'Small Cap',
    nav: 145.8,
    returns: { oneYear: 42.1, threeYear: 28.5, fiveYear: 26.2 },
    rating: 4,
    riskLevel: 'very-high',
    minSIP: 500,
    aum: '₹22,000 Cr',
    expenseRatio: 0.71,
    aiSuitability: 'High growth potential but comes with significant volatility. Suitable only if your investment horizon is 7+ years. Currently restricting lumpsum investments.'
  },
  {
    schemeCode: 'HDFC01',
    schemeName: 'HDFC Balanced Advantage Fund Direct Plan',
    category: 'hybrid',
    fundHouse: 'HDFC Mutual Fund',
    subCategory: 'Dynamic Asset Allocation',
    nav: 42.15,
    returns: { oneYear: 18.5, threeYear: 16.2, fiveYear: 14.8 },
    rating: 4,
    riskLevel: 'moderate',
    minSIP: 1000,
    aum: '₹65,000 Cr',
    expenseRatio: 0.85,
    aiSuitability: 'Perfect for moderate risk takers. The fund automatically adjusts equity and debt ratio based on market valuations, providing downside protection.'
  },
  {
    schemeCode: 'MIRAE01',
    schemeName: 'Mirae Asset ELSS Tax Saver Fund Direct',
    fundHouse: 'Mirae Asset Mutual Fund',
    category: 'elss',
    subCategory: 'ELSS (Tax Saving)',
    nav: 38.9,
    returns: { oneYear: 24.2, threeYear: 19.5, fiveYear: 18.7 },
    rating: 5,
    riskLevel: 'high',
    minSIP: 500,
    aum: '₹18,000 Cr',
    expenseRatio: 0.58,
    aiSuitability: 'Top choice for Section 80C tax saving. Has a mandatory 3-year lock-in. Consistent benchmark outperformance over a 10-year period.'
  },
  {
    schemeCode: 'UTI01',
    schemeName: 'UTI Nifty 50 Index Fund Direct Growth',
    fundHouse: 'UTI Mutual Fund',
    category: 'index',
    subCategory: 'Large Cap Index',
    nav: 142.5,
    returns: { oneYear: 22.5, threeYear: 15.8, fiveYear: 14.2 },
    rating: 4,
    riskLevel: 'high',
    minSIP: 500,
    aum: '₹12,000 Cr',
    expenseRatio: 0.21,
    aiSuitability: 'Lowest cost way to invest in India\'s top 50 companies. No fund manager risk. Highly recommended for beginners.'
  }
];
