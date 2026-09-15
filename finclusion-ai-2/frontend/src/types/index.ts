// ═══════════════════════════════════════════════════════════════
// FINCLUSION AI 2.0 — Core Type Definitions (Merged)
// ═══════════════════════════════════════════════════════════════

export type RiskCategory = 'conservative' | 'moderate' | 'aggressive';
export type GoalStatus = 'on-track' | 'behind' | 'ahead';
export type Sentiment = 'positive' | 'negative' | 'neutral';

// ── User & Profile ──────────────────────────────────────────
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
  // Extended fields from legacy
  email?: string;
  phone?: string;
  investmentHorizon?: 'short' | 'medium' | 'long';
  preferredLanguage?: 'en' | 'hi' | 'ta';
  existingInvestments?: number;
  createdAt?: string;
}

// Alias for backward compatibility
export type UserProfile = User;

// ── Risk Profile ─────────────────────────────────────────────
export interface RiskQuestion {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

// ── Financial Goals ─────────────────────────────────────────
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

// ── Stocks ──────────────────────────────────────────────────
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
  // Aliases for legacy field names
  high52w?: number;
  low52w?: number;
  volume: number;
  marketCap: string;
  pe: number;
  eps: number;
  sector: string;
  industry?: string;
  historicalPrices: { date: string; price: number }[];
  // Alias for legacy field name
  history?: { date: string; price: number }[];
  aiInsights: {
    trend: 'bullish' | 'bearish' | 'neutral';
    trendDescription: string;
    newsSentiment: Sentiment;
    newsDescription?: string;
    riskFactors: string[];
    fundamentalSnapshot?: string;
  };
}

// ── Mutual Funds ────────────────────────────────────────────
export interface MutualFund {
  schemeCode: string;
  schemeName: string;
  // Aliases for legacy field names used in UI components
  id?: string;
  name?: string;
  risk?: string;
  return1Y?: number;
  return3Y?: number;
  return5Y?: number;
  minSip?: number;
  category: 'equity' | 'debt' | 'hybrid' | 'elss' | 'index';
  subCategory: string;
  nav: number;
  navDate?: string;
  aum: string;
  expenseRatio: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  returns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  minSIP: number;
  minLumpsum?: number;
  fundHouse: string;
  rating: number;
  aiSuitability: string;
}

// ── Portfolio ───────────────────────────────────────────────
export interface PortfolioHolding {
  id: string;
  symbol?: string;
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
  allocation: {
    category: string;
    value: number;
    percentage: number;
    color: string;
  }[];
  holdings: PortfolioHolding[];
}

// Alias for backward compatibility
export type PortfolioSummary = Portfolio;

// ── Loan & EMI ──────────────────────────────────────────────
export interface LoanDetails {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  emi: number;
  totalPayment: number;
  totalInterest: number;
  debtToIncomeRatio: number;
  financialStressScore: number;
}

export interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

// ── Government Schemes ──────────────────────────────────────
export interface GovtScheme {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  category: string;
  interestRate: string;
  minInvestment: string;
  maxInvestment: string;
  lockInPeriod: string;
  taxBenefit: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    gender?: 'male' | 'female' | 'any';
    incomeLimit?: number;
    occupation?: string[];
  };
  features: string[];
  officialLink: string;
}

// ── Fraud Detection ─────────────────────────────────────────
export interface FraudAnalysis {
  riskLevel: 'safe' | 'caution' | 'high-risk';
  riskScore: number;
  confidence?: number;
  redFlags: { flag: string; description: string; severity: 'low' | 'medium' | 'high' }[];
  recommendation: string;
  analysisDetails: string[];
}

// ── Learning ────────────────────────────────────────────────
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  points: number;
  badge: string;
  isCompleted: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz: QuizQuestion[];
  isCompleted: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ── News ────────────────────────────────────────────────────
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  sentiment: Sentiment;
  impactLevel: 'high' | 'medium' | 'low';
  sector: string;
  companies: string[];
  aiSummary: string;
}

// ── AI Chat ─────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'text' | 'chart' | 'warning' | 'recommendation' | 'analysis';
  data?: Record<string, unknown>;
}

// ── Onboarding ──────────────────────────────────────────────
export type OnboardingStep = 'welcome' | 'personal' | 'financial' | 'goals' | 'risk' | 'complete';

// ── Navigation ──────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string;
}
