export type RiskCategory = 'conservative' | 'moderate' | 'aggressive';
export type GoalStatus = 'on-track' | 'behind' | 'ahead';
export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  income: number;
  monthlyExpenses: number;
  savings: number;
  existingLoans: number;
  existingEMI: number;
  financialGoals: string[];
  riskTolerance: RiskCategory;
  financialHealthScore: number;
  riskScore: number;
  isOnboarded: boolean;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'mutualfund' | 'etf' | 'nps' | 'ppf' | 'fd' | 'gold';
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface Portfolio {
  totalInvested: number;
  currentValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  holdings: PortfolioHolding[];
  allocation: {
    category: string;
    value: number;
    percentage: number;
    color: string;
  }[];
}

export interface FinancialGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  timelineYears: number;
  expectedReturn: number;
  riskLevel: RiskCategory;
  progress: number;
  projectedAmount: number;
  monthlySIPNeeded: number;
  status: GoalStatus;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  volume: number;
  marketCap: string;
  pe: number;
  eps: number;
  sector: string;
  historicalPrices: { date: string; price: number }[];
  aiInsights: {
    trend: 'bullish' | 'bearish' | 'neutral';
    trendDescription: string;
    newsSentiment: Sentiment;
    riskFactors: string[];
  };
}

export interface MutualFund {
  schemeCode: string;
  schemeName: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  nav: number;
  returns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  rating: number;
  riskLevel: string;
  minSIP: number;
  aum: string;
  expenseRatio: number;
  aiSuitability: string;
}

export interface GovtScheme {
  id: string;
  name: string;
  shortName: string;
  category: string;
  icon: string;
  description: string;
  minInvestment: string;
  maxInvestment: string;
  lockInPeriod: string;
  interestRate: string;
  taxBenefit: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    incomeLimit?: number;
    occupation?: string[];
    gender?: 'male' | 'female' | 'any';
  };
  features: string[];
  officialLink: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: Sentiment;
  impactLevel: 'high' | 'medium' | 'low';
  sector: string;
  companies: string[];
  aiSummary: string;
}

export interface FraudAnalysis {
  riskLevel: 'safe' | 'caution' | 'high-risk';
  riskScore: number;
  redFlags: { flag: string; description: string; severity: 'high' | 'medium' | 'low' }[];
  recommendation: string;
  analysisDetails: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'text' | 'chart' | 'warning' | 'recommendation';
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  isCompleted: boolean;
  points: number;
  badge: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
