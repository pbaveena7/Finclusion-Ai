import type { FinancialGoal } from '../types';

export const mockGoals: FinancialGoal[] = [
  {
    id: 'g1',
    name: 'Emergency Fund',
    icon: '🛡️',
    targetAmount: 500000,
    currentSavings: 380000,
    monthlyContribution: 10000,
    timelineYears: 1,
    expectedReturn: 6,
    riskLevel: 'conservative',
    progress: 76,
    projectedAmount: 510000,
    monthlySIPNeeded: 9500,
    status: 'ahead'
  },
  {
    id: 'g2',
    name: 'House Downpayment',
    icon: '🏠',
    targetAmount: 2500000,
    currentSavings: 850000,
    monthlyContribution: 25000,
    timelineYears: 4,
    expectedReturn: 12,
    riskLevel: 'moderate',
    progress: 34,
    projectedAmount: 2450000,
    monthlySIPNeeded: 26500,
    status: 'behind'
  },
  {
    id: 'g3',
    name: 'Dream Vacation',
    icon: '✈️',
    targetAmount: 300000,
    currentSavings: 120000,
    monthlyContribution: 15000,
    timelineYears: 1,
    expectedReturn: 8,
    riskLevel: 'moderate',
    progress: 40,
    projectedAmount: 315000,
    monthlySIPNeeded: 14000,
    status: 'on-track'
  }
];
