import type { LearningModule } from '../types';

export const mockLearning: LearningModule[] = [
  {
    id: 'mod_1',
    title: 'Investing 101: The Basics',
    description: 'Start your wealth creation journey. Learn the absolute basics of investing, inflation, and compounding.',
    icon: '🌱',
    level: 'beginner',
    progress: 100,
    isCompleted: true,
    points: 150,
    badge: 'First Steps Scholar',
    lessons: [
      {
        id: 'l1_1',
        title: 'What is Investing?',
        isCompleted: true,
        content: `
## The Power of Putting Your Money to Work

Most people think saving money is enough. It's not. 

Because of **inflation** (the rising cost of goods over time), money sitting in a locker loses its buying power every year. 

**Investing** is the act of allocating money with the expectation of generating an income or profit. You are essentially putting your money to work for you.

### Why Invest?
- **Beat Inflation:** Ensure your money grows faster than the cost of living.
- **Wealth Creation:** Build a corpus for large goals (buying a house, retirement).
- **Passive Income:** Generate money without actively working for it.

> "How many millionaires do you know who have become wealthy by investing in savings accounts? I rest my case." - Robert G. Allen
        `,
        quiz: [
          {
            question: 'What is the primary enemy of idle cash?',
            options: ['Taxes', 'Inflation', 'Banks', 'Stock Market'],
            correctIndex: 1,
            explanation: 'Inflation reduces the purchasing power of your money over time, meaning idle cash buys less in the future.'
          }
        ]
      },
      {
        id: 'l1_2',
        title: 'The Magic of Compounding',
        isCompleted: true,
        content: `
## The Eighth Wonder of the World

Compound interest is the interest on savings calculated on both the initial principal and the accumulated interest from previous periods.

Think of it like a snowball rolling down a hill. It starts small, but as it rolls, it picks up more snow, getting bigger and faster.

### Key Factors for Compounding:
- **Time:** The earlier you start, the better. Time is the most crucial factor in compounding.
- **Rate of Return:** Even a 1-2% difference in returns makes a massive difference over 20 years.
- **Consistency:** Regular investments (like SIPs) fuel the compounding engine.
        `,
        quiz: [
          {
            question: 'What is the most important factor in compound interest?',
            options: ['Amount invested', 'Time', 'The bank you choose', 'Luck'],
            correctIndex: 1,
            explanation: 'Time allows your interest to earn interest, creating an exponential growth curve over decades.'
          }
        ]
      }
    ]
  },
  {
    id: 'mod_2',
    title: 'Mutual Funds & SIPs',
    description: 'Deep dive into Mutual Funds. Understand how they work, how to choose them, and the power of SIPs.',
    icon: '📈',
    level: 'beginner',
    progress: 50,
    isCompleted: false,
    points: 200,
    badge: 'Fund Master',
    lessons: [
      {
        id: 'l2_1',
        title: 'What is a Mutual Fund?',
        isCompleted: true,
        content: `
## Pooling Resources

A mutual fund is a pool of money collected from many investors to invest in securities like stocks, bonds, or other assets.

It is managed by a professional **Fund Manager** who makes the investment decisions based on the fund's objective.

### Types of Mutual Funds:
- **Equity Funds:** Invest in shares of companies. High risk, high return.
- **Debt Funds:** Invest in fixed income instruments like government bonds. Low risk, stable return.
- **Hybrid Funds:** Invest in a mix of equity and debt.
        `,
        quiz: [
          {
            question: 'Who manages a mutual fund?',
            options: ['The Bank Manager', 'The Investors', 'A Professional Fund Manager', 'The Government'],
            correctIndex: 2,
            explanation: 'Mutual funds are managed by professional fund managers who analyze markets and make investment decisions.'
          }
        ]
      },
      {
        id: 'l2_2',
        title: 'Understanding SIPs',
        isCompleted: false,
        content: `
## Systematic Investment Plan (SIP)

A SIP allows you to invest a fixed amount regularly (usually monthly) in a mutual fund, rather than a lump sum.

### Benefits of SIP:
- **Rupee Cost Averaging:** You buy more units when prices are low and fewer when prices are high, averaging out the cost.
- **Discipline:** It forces you to save and invest regularly before you spend.
- **Convenience:** Auto-debit makes the process frictionless.
        `,
        quiz: [
          {
            question: 'What is a key benefit of a SIP?',
            options: ['Guaranteed Returns', 'Rupee Cost Averaging', 'No Taxes', 'Immediate Wealth'],
            correctIndex: 1,
            explanation: 'Rupee Cost Averaging helps average out the purchase cost of units over time, protecting you from market volatility.'
          }
        ]
      }
    ]
  },
  {
    id: 'mod_3',
    title: 'Advanced Stock Analysis',
    description: 'Learn to read balance sheets, understand PE ratios, and analyze market trends like a pro.',
    icon: '📊',
    level: 'advanced',
    progress: 0,
    isCompleted: false,
    points: 350,
    badge: 'Market Wizard',
    lessons: [
      {
        id: 'l3_1',
        title: 'Fundamental Analysis Basics',
        isCompleted: false,
        content: `Fundamental analysis evaluates a stock's intrinsic value by examining related economic, financial, and other qualitative and quantitative factors.`,
        quiz: [
          {
            question: 'What does Fundamental Analysis focus on?',
            options: ['Chart patterns', 'Company financials and intrinsic value', 'Rumors', 'Daily price movements'],
            correctIndex: 1,
            explanation: 'Fundamental analysis looks at the underlying health of a business through its financial statements.'
          }
        ]
      }
    ]
  }
];
