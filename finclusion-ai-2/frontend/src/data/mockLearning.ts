import type { LearningModule } from '../types';

export const mockLearning: LearningModule[] = [
  {
    id: 'learn_1',
    title: 'Budgeting 101',
    description: 'Master the fundamentals of personal budgeting — track income, control expenses, and build a savings habit.',
    icon: '💰',
    level: 'beginner',
    points: 100,
    badge: '🏆 Budget Master',
    isCompleted: true,
    progress: 100,
    lessons: [
      {
        id: 'l1_1',
        title: 'Why Budgeting Matters',
        content: `## Why Budgeting Matters\n\nA budget is your financial roadmap. Without one, you're driving blind.\n\n### The 50/30/20 Rule\n- **50% Needs**: Rent, food, utilities, EMIs\n- **30% Wants**: Entertainment, dining, shopping\n- **20% Savings**: Investments, emergency fund\n\n### Key Benefits\n1. **Control** — Know exactly where your money goes\n2. **Goals** — Save consistently for what matters\n3. **Peace** — Reduce financial stress and anxiety\n4. **Growth** — Build wealth over time\n\n> 💡 **Pro Tip**: If your income is ₹1,20,000/month, aim for ₹24,000 minimum savings.`,
        isCompleted: true,
        quiz: [
          {
            question: 'In the 50/30/20 rule, what percentage should go to savings?',
            options: ['10%', '20%', '30%', '50%'],
            correctIndex: 1,
            explanation: 'The 50/30/20 rule suggests allocating 20% of your income to savings and investments.',
          },
        ],
      },
      {
        id: 'l1_2',
        title: 'Tracking Your Expenses',
        content: `## Tracking Your Expenses\n\n### Methods\n1. **Apps**: Use Walnut, Money Manager, or ET Money\n2. **Spreadsheet**: Google Sheets or Excel\n3. **Notebook**: Traditional but effective\n\n### Categorize Everything\n- **Fixed**: Rent, insurance, subscriptions\n- **Variable**: Groceries, fuel, medical\n- **Discretionary**: Movies, restaurants, shopping\n\n### The Coffee Latte Factor\nSmall daily expenses add up. ₹200/day on coffee & snacks = ₹6,000/month = ₹72,000/year!\n\n> 💡 **Challenge**: Track every rupee for 30 days. You'll be surprised where your money goes.`,
        isCompleted: true,
        quiz: [
          {
            question: 'If you spend ₹200 daily on small expenses, how much is that per year?',
            options: ['₹36,000', '₹48,000', '₹60,000', '₹72,000'],
            correctIndex: 3,
            explanation: '₹200 × 365 days = ₹73,000 per year. Small leaks sink great ships!',
          },
        ],
      },
      {
        id: 'l1_3',
        title: 'Building an Emergency Fund',
        content: `## Building an Emergency Fund\n\nAn emergency fund is your financial safety net.\n\n### How Much?\n- **Minimum**: 3 months of expenses\n- **Ideal**: 6 months of expenses\n- **With dependents**: 9-12 months\n\n### Where to Keep It?\n1. **Savings account**: Instant access, low returns\n2. **Liquid fund**: 1-day withdrawal, ~6-7% returns\n3. **FD with sweep**: Balance of access and returns\n\n### Building Strategy\n1. Start with ₹1,000/month — any amount is fine\n2. Automate via standing instruction\n3. Never touch it except for true emergencies\n4. Replenish immediately if used\n\n> ⚠️ **Not an emergency**: Sales, vacations, new phone. Only job loss, medical emergencies, or major unexpected expenses.`,
        isCompleted: true,
        quiz: [
          {
            question: 'What is the ideal emergency fund size?',
            options: ['1 month expenses', '3 months expenses', '6 months expenses', '12 months expenses'],
            correctIndex: 2,
            explanation: '6 months of expenses is the ideal emergency fund. Start with 3 months and build up.',
          },
        ],
      },
    ],
  },
  {
    id: 'learn_2',
    title: 'SIP & Power of Compounding',
    description: 'Understand how Systematic Investment Plans work and harness the power of compounding to build wealth.',
    icon: '📈',
    level: 'beginner',
    points: 150,
    badge: '🌟 SIP Champion',
    isCompleted: false,
    progress: 66,
    lessons: [
      {
        id: 'l2_1',
        title: 'What is a SIP?',
        content: `## What is a SIP?\n\nSIP (Systematic Investment Plan) is a disciplined way to invest a fixed amount regularly in mutual funds.\n\n### How SIP Works\n1. Choose a mutual fund\n2. Set a monthly amount (min ₹500)\n3. Select date (1st, 5th, 10th, etc.)\n4. Amount auto-debited from bank\n5. Units allocated at current NAV\n\n### Benefits of SIP\n- **Rupee Cost Averaging**: Buy more units when markets are low\n- **Discipline**: Removes emotional decision-making\n- **Flexibility**: Start, stop, increase anytime\n- **Small Start**: Begin with just ₹500/month\n\n### SIP vs Lump Sum\n| Feature | SIP | Lump Sum |\n|---------|-----|----------|\n| Risk | Lower | Higher |\n| Timing | Not needed | Critical |\n| Amount | Small | Large |\n| Best for | Salaried | Windfalls |`,
        isCompleted: true,
        quiz: [
          {
            question: 'What does SIP stand for?',
            options: ['Savings Investment Portfolio', 'Systematic Investment Plan', 'Standard Income Protocol', 'Smart Investment Platform'],
            correctIndex: 1,
            explanation: 'SIP stands for Systematic Investment Plan — a method of investing a fixed sum regularly.',
          },
        ],
      },
      {
        id: 'l2_2',
        title: 'The Magic of Compounding',
        content: `## The Magic of Compounding\n\nEinstein called compound interest the "8th wonder of the world."\n\n### Simple vs Compound Interest\n- **Simple**: Earn interest only on principal\n- **Compound**: Earn interest on principal + accumulated interest\n\n### Real Example\n₹10,000 SIP per month at 12% for different periods:\n\n| Years | Invested | Returns | Total |\n|-------|----------|---------|-------|\n| 5 | ₹6L | ₹2.2L | ₹8.2L |\n| 10 | ₹12L | ₹11.2L | ₹23.2L |\n| 20 | ₹24L | ₹75.9L | ₹99.9L |\n| 30 | ₹36L | ₹3.17Cr | ₹3.53Cr |\n\n### Key Takeaway\nIn 30 years, ₹36L invested becomes ₹3.53 Cr! The returns (₹3.17 Cr) are **88x** the monthly SIP amount.\n\n> 💡 **Rule of 72**: Divide 72 by your expected return rate to find years to double your money. At 12%, money doubles in 6 years.`,
        isCompleted: true,
        quiz: [
          {
            question: 'Using the Rule of 72, how many years to double money at 12% return?',
            options: ['4 years', '6 years', '8 years', '12 years'],
            correctIndex: 1,
            explanation: '72 ÷ 12 = 6 years. At 12% annual returns, your investment doubles roughly every 6 years.',
          },
        ],
      },
      {
        id: 'l2_3',
        title: 'Choosing the Right SIP Amount',
        content: `## Choosing the Right SIP Amount\n\n### Step 1: Define Your Goal\n- What are you saving for?\n- How much do you need?\n- When do you need it?\n\n### Step 2: Use the SIP Calculator\nFormula: FV = SIP × [((1+r)^n - 1) / r] × (1+r)\n\nWhere:\n- FV = Future Value (your goal)\n- SIP = Monthly investment\n- r = Monthly return rate (annual/12)\n- n = Number of months\n\n### Recommended SIP Allocation by Age\n| Age Group | Equity % | Debt % | Gold % |\n|-----------|----------|--------|--------|\n| 20-30 | 80% | 15% | 5% |\n| 30-40 | 70% | 25% | 5% |\n| 40-50 | 50% | 40% | 10% |\n| 50+ | 30% | 60% | 10% |\n\n### Step Up SIP\nIncrease SIP by 10% annually. This alone can increase your corpus by 50-60% over 20 years!\n\n> 💡 **Your Case**: At 28 with ₹1.2L income, aim for ₹24,000-30,000/month total SIPs across all goals.`,
        isCompleted: false,
        quiz: [
          {
            question: 'For a 28-year-old, what should be the equity allocation?',
            options: ['50%', '60%', '70-80%', '90%'],
            correctIndex: 2,
            explanation: 'For ages 20-30, 70-80% equity allocation is recommended due to long investment horizon.',
          },
        ],
      },
    ],
  },
  {
    id: 'learn_3',
    title: 'Mutual Fund Types Decoded',
    description: 'Navigate the world of mutual funds — equity, debt, hybrid, ELSS, and index funds explained simply.',
    icon: '🏦',
    level: 'intermediate',
    points: 200,
    badge: '📊 Fund Expert',
    isCompleted: false,
    progress: 33,
    lessons: [
      {
        id: 'l3_1',
        title: 'Equity Funds',
        content: `## Equity Funds\n\nEquity funds invest in stocks. They carry higher risk but offer higher returns over the long term.\n\n### Categories by Market Cap\n1. **Large Cap**: Top 100 companies (Nifty 50, Sensex)\n   - Risk: Moderate | Returns: 12-15%\n   - Example: SBI Bluechip, Mirae Asset Large Cap\n\n2. **Mid Cap**: 101st to 250th companies\n   - Risk: High | Returns: 15-20%\n   - Example: HDFC Mid-Cap, Kotak Emerging\n\n3. **Small Cap**: 251st onwards\n   - Risk: Very High | Returns: 18-25%\n   - Example: Axis Small Cap, SBI Small Cap\n\n4. **Flexi Cap**: Invests across market caps\n   - Risk: High | Returns: 14-18%\n   - Example: Parag Parikh Flexi Cap\n\n### Direct vs Regular Plans\n- **Direct**: Lower expense ratio, higher returns (~1% more/year)\n- **Regular**: Includes distributor commission\n\n> 💡 **Always choose Direct Growth plans** for maximum returns.`,
        isCompleted: true,
        quiz: [
          {
            question: 'Which type of equity fund invests in the top 100 companies?',
            options: ['Mid Cap', 'Small Cap', 'Large Cap', 'Flexi Cap'],
            correctIndex: 2,
            explanation: 'Large Cap funds invest in the top 100 companies by market capitalization.',
          },
        ],
      },
      {
        id: 'l3_2',
        title: 'Debt and Hybrid Funds',
        content: `## Debt and Hybrid Funds\n\n### Debt Funds\nInvest in bonds, treasury bills, and government securities.\n\n**Types**:\n- **Liquid Fund**: For parking money (<90 days)\n- **Short Duration**: 1-3 year horizon\n- **Corporate Bond**: Higher quality bonds\n- **Gilt Fund**: Government securities only\n\n**Returns**: 6-8% p.a. | **Risk**: Low to Moderate\n\n### Hybrid Funds\nMix of equity and debt in varying proportions.\n\n**Types**:\n- **Conservative Hybrid**: 25% equity + 75% debt\n- **Balanced Advantage/Dynamic**: Auto-adjusts based on valuations\n- **Aggressive Hybrid**: 65-80% equity + rest debt\n\n**Returns**: 9-14% p.a. | **Risk**: Moderate\n\n### When to Use What\n| Goal Timeline | Fund Type |\n|---------------|----------|\n| < 1 year | Liquid/Overnight |\n| 1-3 years | Short Duration Debt |\n| 3-5 years | Balanced Advantage |\n| 5+ years | Equity Funds |`,
        isCompleted: false,
        quiz: [
          {
            question: 'For a 2-year investment horizon, which fund type is most suitable?',
            options: ['Small Cap Fund', 'Short Duration Debt Fund', 'Large Cap Fund', 'Liquid Fund'],
            correctIndex: 1,
            explanation: 'Short Duration Debt Funds are ideal for 1-3 year horizons, offering better-than-FD returns with low risk.',
          },
        ],
      },
      {
        id: 'l3_3',
        title: 'ELSS and Index Funds',
        content: `## ELSS and Index Funds\n\n### ELSS (Equity Linked Savings Scheme)\n- **Purpose**: Tax saving under Section 80C\n- **Lock-in**: 3 years (shortest among 80C options)\n- **Returns**: 15-20% historically\n- **Max deduction**: ₹1,50,000/year\n\n**Top ELSS Funds**:\n1. Mirae Asset Tax Saver\n2. Quant ELSS Tax Saver\n3. Canara Robeco ELSS\n\n### Index Funds\n- **What**: Passively track an index (Nifty 50, Sensex)\n- **Cost**: Extremely low (0.05-0.30% expense ratio)\n- **Returns**: Market returns minus tiny fees\n\n**Why Index Funds?**\n- 75% of active large-cap funds fail to beat Nifty 50\n- Lower costs = higher long-term returns\n- No fund manager risk\n- Warren Buffett recommends index funds\n\n**Top Index Funds**:\n1. UTI Nifty 50 (0.18% TER)\n2. Navi Nifty 50 (0.06% TER)\n3. Motilal Oswal Nifty Next 50\n\n> 💡 **Strategy**: Use index funds for core (60%) and active funds for satellite (40%) allocation.`,
        isCompleted: false,
        quiz: [
          {
            question: 'What is the lock-in period for ELSS mutual funds?',
            options: ['1 year', '3 years', '5 years', 'No lock-in'],
            correctIndex: 1,
            explanation: 'ELSS has the shortest lock-in of 3 years among all Section 80C tax-saving investments.',
          },
        ],
      },
    ],
  },
  {
    id: 'learn_4',
    title: 'Tax Saving Strategies',
    description: 'Optimize your tax outflow using legal deductions and exemptions — 80C, 80D, HRA, NPS, and more.',
    icon: '📋',
    level: 'intermediate',
    points: 200,
    badge: '🎯 Tax Guru',
    isCompleted: false,
    progress: 0,
    lessons: [
      {
        id: 'l4_1',
        title: 'Section 80C Deductions',
        content: `## Section 80C — The Big One\n\nMaximum deduction: ₹1,50,000/year\n\n### Eligible Investments\n| Investment | Lock-in | Returns |\n|------------|---------|--------|\n| ELSS | 3 years | 12-18% |\n| PPF | 15 years | 7.1% |\n| NPS | Till 60 | 9-12% |\n| Tax Saver FD | 5 years | 6.5-7% |\n| Sukanya Samriddhi | 21 years | 8.2% |\n| NSC | 5 years | 7.7% |\n| EPF | Till retirement | 8.25% |\n| Life Insurance | Policy term | Varies |\n| Tuition Fees | N/A | N/A |\n\n### Best Strategy by Risk Profile\n- **Conservative**: PPF (₹1.5L) — zero risk, guaranteed\n- **Moderate**: ELSS (₹1L) + PPF (₹50K)\n- **Aggressive**: ELSS (₹1.5L) — best returns potential\n\n> 💡 **Your Optimal Mix**: ELSS ₹1L + NPS ₹50K = ₹1.5L under 80C + ₹50K extra under 80CCD(1B)`,
        isCompleted: false,
        quiz: [
          {
            question: 'Which 80C investment has the shortest lock-in with best returns potential?',
            options: ['PPF', 'ELSS', 'Tax Saver FD', 'NPS'],
            correctIndex: 1,
            explanation: 'ELSS has only 3-year lock-in (shortest) and 12-18% historical returns (highest among 80C options).',
          },
        ],
      },
      {
        id: 'l4_2',
        title: 'Beyond 80C: Other Deductions',
        content: `## Beyond 80C\n\n### Section 80D — Health Insurance\n- Self/Family: ₹25,000 (₹50,000 if senior)\n- Parents: ₹25,000 (₹50,000 if senior)\n- **Max**: ₹1,00,000/year\n\n### Section 80CCD(1B) — NPS\n- Additional ₹50,000 over and above 80C\n- Extra tax saving of ₹15,600 at 30% slab\n\n### HRA Exemption\n- Lowest of: Actual HRA, 50%/40% of salary, or rent paid minus 10% of salary\n\n### Section 80E — Education Loan\n- Interest deduction for 8 years\n- No upper limit!\n\n### Section 24(b) — Home Loan Interest\n- Up to ₹2,00,000/year for self-occupied property\n\n> 💡 **Total possible deductions**: ₹1.5L (80C) + ₹50K (NPS) + ₹1L (80D) + ₹2L (24b) = ₹5 Lakh/year!`,
        isCompleted: false,
        quiz: [
          {
            question: 'How much additional deduction does Section 80CCD(1B) for NPS offer?',
            options: ['₹25,000', '₹50,000', '₹1,00,000', '₹1,50,000'],
            correctIndex: 1,
            explanation: 'Section 80CCD(1B) offers an additional ₹50,000 deduction for NPS, over and above the ₹1.5L limit of Section 80C.',
          },
        ],
      },
      {
        id: 'l4_3',
        title: 'Old vs New Tax Regime',
        content: `## Old vs New Tax Regime\n\n### New Regime (Default from FY2024-25)\n| Income Slab | Tax Rate |\n|-------------|----------|\n| Up to ₹3L | Nil |\n| ₹3L - ₹7L | 5% |\n| ₹7L - ₹10L | 10% |\n| ₹10L - ₹12L | 15% |\n| ₹12L - ₹15L | 20% |\n| Above ₹15L | 30% |\n\n**Standard Deduction**: ₹75,000\n\n### When to Choose OLD Regime\nIf total deductions > ₹3.75L:\n- 80C: ₹1.5L + NPS: ₹50K + 80D: ₹50K + HRA + 24(b)\n\n### When to Choose NEW Regime\n- Few investments/deductions\n- Income < ₹7.5L (effectively tax-free)\n\n> 💡 **For ₹14.4L income with moderate deductions**: Old regime saves ₹15,000-25,000 more. Use our calculator to compare!`,
        isCompleted: false,
        quiz: [
          {
            question: 'Up to what income is effectively tax-free under the new regime?',
            options: ['₹5 Lakh', '₹7 Lakh', '₹7.5 Lakh', '₹10 Lakh'],
            correctIndex: 2,
            explanation: 'Under the new regime, income up to ₹7.5L is effectively tax-free (₹7L exemption + ₹75K standard deduction + rebate under 87A).',
          },
        ],
      },
    ],
  },
  {
    id: 'learn_5',
    title: 'Stock Market Fundamentals',
    description: 'Learn how the stock market works — from opening a Demat account to analyzing stocks using fundamental and technical analysis.',
    icon: '📊',
    level: 'advanced',
    points: 250,
    badge: '🐂 Market Pro',
    isCompleted: false,
    progress: 0,
    lessons: [
      {
        id: 'l5_1',
        title: 'Getting Started with Stocks',
        content: `## Getting Started with Stocks\n\n### What You Need\n1. **PAN Card** — Mandatory for trading\n2. **Demat Account** — Holds your shares electronically\n3. **Trading Account** — To buy/sell shares\n4. **Bank Account** — Linked for fund transfer\n\n### Top Brokers in India\n| Broker | Account Fee | Brokerage |\n|--------|-------------|----------|\n| Zerodha | Free | ₹20/trade |\n| Groww | Free | ₹20/trade |\n| Angel One | Free | ₹20/trade |\n| Upstox | Free | ₹20/trade |\n| ICICI Direct | Free | 0.55% |\n\n### Market Timings\n- Pre-open: 9:00 AM - 9:15 AM\n- Trading: 9:15 AM - 3:30 PM\n- Post-close: 3:30 PM - 4:00 PM\n\n> 💡 **First Step**: Open a Zerodha/Groww account (takes 15 minutes) and start with ₹10,000.`,
        isCompleted: false,
        quiz: [
          {
            question: 'What is a Demat account used for?',
            options: ['Trading stocks', 'Holding shares electronically', 'Paying taxes', 'Getting loans'],
            correctIndex: 1,
            explanation: 'A Demat (Dematerialized) account holds your shares in electronic form, similar to how a bank account holds money.',
          },
        ],
      },
      {
        id: 'l5_2',
        title: 'Fundamental Analysis Basics',
        content: `## Fundamental Analysis\n\nAnalyze a company's financial health to determine if its stock is worth buying.\n\n### Key Metrics\n\n**1. P/E Ratio (Price-to-Earnings)**\n- Formula: Stock Price / EPS\n- Lower P/E = potentially undervalued\n- Compare within same sector\n\n**2. EPS (Earnings Per Share)**\n- Formula: Net Profit / Total Shares\n- Higher and growing EPS = good sign\n\n**3. ROE (Return on Equity)**\n- Formula: Net Income / Shareholders' Equity\n- Good: >15% | Great: >20%\n\n**4. Debt-to-Equity Ratio**\n- Lower is better (< 1 ideal)\n- Exception: Banks and NBFCs\n\n**5. Free Cash Flow**\n- Cash generated after all expenses\n- Positive and growing = healthy business\n\n### Where to Find Data\n- Screener.in (free)\n- Tickertape (free)\n- Moneycontrol, BSE/NSE websites\n\n> 💡 **Quick Filter**: ROE > 15%, Debt/Equity < 0.5, 5-year profit CAGR > 15%`,
        isCompleted: false,
        quiz: [
          {
            question: 'What does a low P/E ratio potentially indicate?',
            options: ['Overvalued stock', 'High risk', 'Potentially undervalued stock', 'High dividend'],
            correctIndex: 2,
            explanation: 'A low P/E ratio may indicate the stock is undervalued relative to its earnings, though always compare within the same sector.',
          },
        ],
      },
      {
        id: 'l5_3',
        title: 'Building Your First Portfolio',
        content: `## Building Your First Stock Portfolio\n\n### Portfolio Construction Rules\n\n**1. Diversification**\n- 10-15 stocks across different sectors\n- No single stock > 10% of portfolio\n- Mix of large, mid, and small caps\n\n**2. Sector Allocation**\n| Sector | Weight |\n|--------|--------|\n| Banking/Finance | 25-30% |\n| IT | 15-20% |\n| FMCG/Consumer | 10-15% |\n| Pharma | 10% |\n| Auto | 10% |\n| Others | 15-20% |\n\n**3. Investment Strategy**\n- **Core** (60%): Blue-chips like HDFC Bank, TCS, Reliance\n- **Growth** (30%): Mid-caps with strong fundamentals\n- **Tactical** (10%): Small-caps or thematic bets\n\n**4. Common Mistakes to Avoid**\n- ❌ Buying tips from WhatsApp/Telegram\n- ❌ Chasing momentum without research\n- ❌ Over-trading (high brokerage costs)\n- ❌ Not having a stop-loss\n- ❌ Ignoring diversification\n\n> 💡 **Golden Rule**: "Be fearful when others are greedy, and greedy when others are fearful." — Warren Buffett`,
        isCompleted: false,
        quiz: [
          {
            question: 'What is the maximum weight a single stock should have in your portfolio?',
            options: ['5%', '10%', '20%', '25%'],
            correctIndex: 1,
            explanation: 'No single stock should exceed 10% of your portfolio to manage concentration risk effectively.',
          },
        ],
      },
    ],
  },
];
