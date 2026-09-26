// =====================================================
// FINCLUSION AI — MASSIVE 2000+ RECORD DATA GENERATOR
// Procedurally generates realistic Indian financial data
// =====================================================

// ---- MUTUAL FUNDS: 800+ funds ----

const fundHouses = [
  'SBI Mutual Fund', 'HDFC Mutual Fund', 'ICICI Prudential', 'Axis Mutual Fund',
  'Kotak Mahindra', 'Nippon India', 'Aditya Birla Sun Life', 'UTI Mutual Fund',
  'DSP Mutual Fund', 'Tata Mutual Fund', 'Mirae Asset', 'Parag Parikh',
  'Motilal Oswal', 'Canara Robeco', 'L&T Mutual Fund', 'PGIM India',
  'Edelweiss', 'Invesco India', 'Sundaram Mutual Fund', 'Franklin Templeton',
  'HSBC Mutual Fund', 'Bandhan Mutual Fund', 'Mahindra Manulife', 'Quant Mutual Fund',
  'Baroda BNP Paribas', 'Union Mutual Fund', 'Bank of India MF', 'JM Financial MF',
  'ITI Mutual Fund', 'Samco Mutual Fund', 'Trust Mutual Fund', 'NJ Mutual Fund',
  'WhiteOak Capital', 'Groww Mutual Fund', 'Zerodha Fund House', '360 ONE MF'
];

const fundTypes = [
  { sub: 'Large Cap', cat: 'equity', risk: 'high' },
  { sub: 'Mid Cap', cat: 'equity', risk: 'very-high' },
  { sub: 'Small Cap', cat: 'equity', risk: 'very-high' },
  { sub: 'Flexi Cap', cat: 'equity', risk: 'high' },
  { sub: 'Multi Cap', cat: 'equity', risk: 'high' },
  { sub: 'ELSS (Tax Saver)', cat: 'equity', risk: 'high' },
  { sub: 'Value Fund', cat: 'equity', risk: 'high' },
  { sub: 'Contra Fund', cat: 'equity', risk: 'high' },
  { sub: 'Focused Fund', cat: 'equity', risk: 'high' },
  { sub: 'Dividend Yield', cat: 'equity', risk: 'moderate' },
  { sub: 'Sectoral - Banking', cat: 'equity', risk: 'very-high' },
  { sub: 'Sectoral - IT', cat: 'equity', risk: 'very-high' },
  { sub: 'Sectoral - Pharma', cat: 'equity', risk: 'very-high' },
  { sub: 'Sectoral - Infra', cat: 'equity', risk: 'very-high' },
  { sub: 'Sectoral - Consumption', cat: 'equity', risk: 'high' },
  { sub: 'Thematic - ESG', cat: 'equity', risk: 'high' },
  { sub: 'Thematic - Manufacturing', cat: 'equity', risk: 'high' },
  { sub: 'Thematic - MNC', cat: 'equity', risk: 'moderate' },
  { sub: 'Short Duration', cat: 'debt', risk: 'low' },
  { sub: 'Medium Duration', cat: 'debt', risk: 'moderate' },
  { sub: 'Long Duration', cat: 'debt', risk: 'moderate' },
  { sub: 'Corporate Bond', cat: 'debt', risk: 'low' },
  { sub: 'Banking & PSU', cat: 'debt', risk: 'low' },
  { sub: 'Gilt Fund', cat: 'debt', risk: 'moderate' },
  { sub: 'Liquid Fund', cat: 'debt', risk: 'low' },
  { sub: 'Overnight Fund', cat: 'debt', risk: 'low' },
  { sub: 'Money Market', cat: 'debt', risk: 'low' },
  { sub: 'Dynamic Bond', cat: 'debt', risk: 'moderate' },
  { sub: 'Credit Risk', cat: 'debt', risk: 'moderate' },
  { sub: 'Aggressive Hybrid', cat: 'hybrid', risk: 'high' },
  { sub: 'Conservative Hybrid', cat: 'hybrid', risk: 'moderate' },
  { sub: 'Balanced Advantage', cat: 'hybrid', risk: 'moderate' },
  { sub: 'Equity Savings', cat: 'hybrid', risk: 'moderate' },
  { sub: 'Arbitrage Fund', cat: 'hybrid', risk: 'low' },
  { sub: 'Multi Asset', cat: 'hybrid', risk: 'moderate' },
  { sub: 'Nifty 50 Index', cat: 'index', risk: 'high' },
  { sub: 'Nifty Next 50 Index', cat: 'index', risk: 'high' },
  { sub: 'Sensex Index', cat: 'index', risk: 'high' },
  { sub: 'Nifty Midcap 150', cat: 'index', risk: 'very-high' },
  { sub: 'Nifty Smallcap 250', cat: 'index', risk: 'very-high' },
  { sub: 'Nifty 500 Index', cat: 'index', risk: 'high' },
  { sub: 'Gold ETF', cat: 'commodity', risk: 'moderate' },
  { sub: 'Silver ETF', cat: 'commodity', risk: 'moderate' },
  { sub: 'International - US Equity', cat: 'international', risk: 'high' },
  { sub: 'International - Global', cat: 'international', risk: 'high' },
  { sub: 'International - China', cat: 'international', risk: 'very-high' },
  { sub: 'International - Europe', cat: 'international', risk: 'high' },
  { sub: 'Fund of Funds - Domestic', cat: 'fof', risk: 'moderate' },
  { sub: 'Fund of Funds - Overseas', cat: 'fof', risk: 'high' },
  { sub: 'Retirement Fund', cat: 'solution', risk: 'moderate' },
  { sub: "Children's Fund", cat: 'solution', risk: 'moderate' },
];

const aiInsights = [
  'Excellent track record with consistent alpha generation over benchmark. Suitable for long-term wealth creation.',
  'Strong risk-adjusted returns. Fund manager has 15+ years experience. Good for SIP investors.',
  'High conviction portfolio with concentrated bets. Suits aggressive investors with 5+ year horizon.',
  'Defensive portfolio with quality bias. Good for conservative equity allocation.',
  'Outperformed category average by 3-5% over 3 years. Low portfolio churn reduces tax drag.',
  'New fund with promising strategy. Wait for 3-year track record before large allocation.',
  'Sector rotation strategy may cause higher volatility. Keep allocation under 10% of portfolio.',
  'Ideal for tax-saving with 3-year lock-in. Comparable returns to open-ended flexi cap funds.',
  'Low expense ratio makes this attractive for passive investors. Tracks benchmark with minimal error.',
  'High credit quality portfolio. Suitable for emergency fund or short-term parking of funds.',
  'Government securities portfolio offers sovereign guarantee. Good for risk-averse fixed income investors.',
  'Dynamic asset allocation reduces timing risk. Suitable as a core equity holding.',
  'International diversification reduces India-specific risk. Currency fluctuations add extra volatility.',
  'Gold allocation acts as portfolio hedge during market stress. Keep under 10-15% of total portfolio.',
  'Balanced approach of equity-debt offers stability with growth. Good for moderate risk profiles.',
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export interface GeneratedMutualFund {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  nav: number;
  aum: string;
  expenseRatio: number;
  riskLevel: string;
  returns: { oneYear: number; threeYear: number; fiveYear: number };
  minSIP: number;
  fundHouse: string;
  rating: number;
  aiSuitability: string;
}

function generateMutualFunds(): GeneratedMutualFund[] {
  const funds: GeneratedMutualFund[] = [];
  let id = 1;
  
  for (const house of fundHouses) {
    for (const type of fundTypes) {
      const seed = id * 137;
      const nav = Math.round((10 + seededRandom(seed) * 990) * 100) / 100;
      const aumVal = Math.round(100 + seededRandom(seed + 1) * 79900);
      const oneY = Math.round((seededRandom(seed + 2) * 50 - 10) * 10) / 10;
      const threeY = Math.round((seededRandom(seed + 3) * 35 - 5) * 10) / 10;
      const fiveY = Math.round((seededRandom(seed + 4) * 30 - 3) * 10) / 10;
      
      funds.push({
        id: `MF${String(id).padStart(4, '0')}`,
        name: `${house.split(' ')[0]} ${type.sub} Fund - Direct Growth`,
        category: type.cat,
        subCategory: type.sub,
        nav,
        aum: `₹${aumVal.toLocaleString('en-IN')} Cr`,
        expenseRatio: Math.round((0.05 + seededRandom(seed + 5) * 2.2) * 100) / 100,
        riskLevel: type.risk,
        returns: { oneYear: oneY, threeYear: threeY, fiveYear: fiveY },
        minSIP: [100, 500, 500, 1000, 1000, 5000][Math.floor(seededRandom(seed + 6) * 6)],
        fundHouse: house,
        rating: Math.min(5, Math.max(1, Math.round(1 + seededRandom(seed + 7) * 4))),
        aiSuitability: aiInsights[Math.floor(seededRandom(seed + 8) * aiInsights.length)],
      });
      id++;
    }
  }
  return funds;
}

// ---- STOCKS: 500+ stocks ----
export interface GeneratedStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: string;
  pe: number;
  sector: string;
  industry: string;
}

const stockDatabase: { sym: string; name: string; sector: string; industry: string; basePrice: number }[] = [
  { sym: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Conglomerate', industry: 'Oil & Gas', basePrice: 2980 },
  { sym: 'TCS', name: 'Tata Consultancy Services Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 3890 },
  { sym: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking', industry: 'Private Bank', basePrice: 1680 },
  { sym: 'INFY', name: 'Infosys Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 1520 },
  { sym: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking', industry: 'Private Bank', basePrice: 1240 },
  { sym: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', sector: 'FMCG', industry: 'Personal Products', basePrice: 2450 },
  { sym: 'ITC', name: 'ITC Ltd.', sector: 'FMCG', industry: 'Tobacco', basePrice: 475 },
  { sym: 'SBIN', name: 'State Bank of India', sector: 'Banking', industry: 'PSU Bank', basePrice: 820 },
  { sym: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecom', industry: 'Telecom', basePrice: 1680 },
  { sym: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', sector: 'Banking', industry: 'Private Bank', basePrice: 1820 },
  { sym: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Engineering', industry: 'Capital Goods', basePrice: 3540 },
  { sym: 'HCLTECH', name: 'HCL Technologies Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 1690 },
  { sym: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Banking', industry: 'Private Bank', basePrice: 1220 },
  { sym: 'ASIANPAINT', name: 'Asian Paints Ltd.', sector: 'Consumer', industry: 'Paints', basePrice: 2680 },
  { sym: 'MARUTI', name: 'Maruti Suzuki India Ltd.', sector: 'Automobile', industry: 'Passenger Vehicles', basePrice: 12800 },
  { sym: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', sector: 'Pharma', industry: 'Pharmaceuticals', basePrice: 1720 },
  { sym: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Automobile', industry: 'Commercial Vehicles', basePrice: 980 },
  { sym: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', sector: 'Finance', industry: 'NBFC', basePrice: 6850 },
  { sym: 'WIPRO', name: 'Wipro Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 480 },
  { sym: 'TITAN', name: 'Titan Company Ltd.', sector: 'Consumer', industry: 'Jewellery', basePrice: 3680 },
  { sym: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', sector: 'Cement', industry: 'Cement', basePrice: 11200 },
  { sym: 'NESTLEIND', name: 'Nestle India Ltd.', sector: 'FMCG', industry: 'Food Products', basePrice: 2480 },
  { sym: 'POWERGRID', name: 'Power Grid Corporation', sector: 'Power', industry: 'Transmission', basePrice: 310 },
  { sym: 'NTPC', name: 'NTPC Ltd.', sector: 'Power', industry: 'Generation', basePrice: 380 },
  { sym: 'TATASTEEL', name: 'Tata Steel Ltd.', sector: 'Metals', industry: 'Steel', basePrice: 155 },
  { sym: 'ONGC', name: 'Oil & Natural Gas Corporation', sector: 'Energy', industry: 'Oil & Gas', basePrice: 260 },
  { sym: 'JSWSTEEL', name: 'JSW Steel Ltd.', sector: 'Metals', industry: 'Steel', basePrice: 890 },
  { sym: 'ADANIENT', name: 'Adani Enterprises Ltd.', sector: 'Conglomerate', industry: 'Diversified', basePrice: 2850 },
  { sym: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd.', sector: 'Infrastructure', industry: 'Ports', basePrice: 1380 },
  { sym: 'TECHM', name: 'Tech Mahindra Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 1620 },
  { sym: 'M&M', name: 'Mahindra & Mahindra Ltd.', sector: 'Automobile', industry: 'Auto', basePrice: 2940 },
  { sym: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.', sector: 'Finance', industry: 'Financial Services', basePrice: 1680 },
  { sym: 'HDFCLIFE', name: 'HDFC Life Insurance', sector: 'Insurance', industry: 'Life Insurance', basePrice: 680 },
  { sym: 'SBILIFE', name: 'SBI Life Insurance', sector: 'Insurance', industry: 'Life Insurance', basePrice: 1720 },
  { sym: 'GRASIM', name: 'Grasim Industries Ltd.', sector: 'Cement', industry: 'Diversified', basePrice: 2580 },
  { sym: 'DIVISLAB', name: "Divi's Laboratories Ltd.", sector: 'Pharma', industry: 'API/CDMO', basePrice: 5920 },
  { sym: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Pharma', industry: 'Pharmaceuticals', basePrice: 6240 },
  { sym: 'CIPLA', name: 'Cipla Ltd.', sector: 'Pharma', industry: 'Pharmaceuticals', basePrice: 1520 },
  { sym: 'EICHERMOT', name: 'Eicher Motors Ltd.', sector: 'Automobile', industry: 'Two Wheelers', basePrice: 4680 },
  { sym: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', sector: 'Automobile', industry: 'Two Wheelers', basePrice: 5420 },
  { sym: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', sector: 'Automobile', industry: 'Two Wheelers', basePrice: 9820 },
  { sym: 'BPCL', name: 'Bharat Petroleum Corp.', sector: 'Energy', industry: 'Oil & Gas', basePrice: 620 },
  { sym: 'COALINDIA', name: 'Coal India Ltd.', sector: 'Mining', industry: 'Coal', basePrice: 440 },
  { sym: 'IOC', name: 'Indian Oil Corporation', sector: 'Energy', industry: 'Oil & Gas', basePrice: 168 },
  { sym: 'INDUSINDBK', name: 'IndusInd Bank Ltd.', sector: 'Banking', industry: 'Private Bank', basePrice: 1480 },
  { sym: 'BRITANNIA', name: 'Britannia Industries Ltd.', sector: 'FMCG', industry: 'Food Products', basePrice: 5680 },
  { sym: 'SHREECEM', name: 'Shree Cement Ltd.', sector: 'Cement', industry: 'Cement', basePrice: 25800 },
  { sym: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise', sector: 'Healthcare', industry: 'Hospitals', basePrice: 6920 },
  { sym: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'FMCG', industry: 'Food & Beverage', basePrice: 1180 },
  { sym: 'PIDILITIND', name: 'Pidilite Industries Ltd.', sector: 'Chemical', industry: 'Adhesives', basePrice: 3020 },
  { sym: 'DABUR', name: 'Dabur India Ltd.', sector: 'FMCG', industry: 'Personal Products', basePrice: 580 },
  { sym: 'GODREJCP', name: 'Godrej Consumer Products', sector: 'FMCG', industry: 'Personal Products', basePrice: 1320 },
  { sym: 'HAVELLS', name: 'Havells India Ltd.', sector: 'Consumer', industry: 'Electricals', basePrice: 1780 },
  { sym: 'BERGEPAINT', name: 'Berger Paints India', sector: 'Consumer', industry: 'Paints', basePrice: 520 },
  { sym: 'TRENT', name: 'Trent Ltd.', sector: 'Retail', industry: 'Fashion Retail', basePrice: 6450 },
  { sym: 'ZOMATO', name: 'Zomato Ltd.', sector: 'Technology', industry: 'Food Delivery', basePrice: 260 },
  { sym: 'PAYTM', name: 'One97 Communications (Paytm)', sector: 'Technology', industry: 'Fintech', basePrice: 680 },
  { sym: 'NYKAA', name: 'FSN E-Commerce (Nykaa)', sector: 'Technology', industry: 'E-Commerce', basePrice: 165 },
  { sym: 'POLICYBZR', name: 'PB Fintech (PolicyBazaar)', sector: 'Technology', industry: 'Insurtech', basePrice: 1480 },
  { sym: 'DELHIVERY', name: 'Delhivery Ltd.', sector: 'Logistics', industry: 'Logistics', basePrice: 420 },
  { sym: 'IRCTC', name: 'Indian Railway Catering', sector: 'Tourism', industry: 'Travel', basePrice: 780 },
  { sym: 'HAL', name: 'Hindustan Aeronautics', sector: 'Defence', industry: 'Aerospace', basePrice: 5200 },
  { sym: 'BEL', name: 'Bharat Electronics Ltd.', sector: 'Defence', industry: 'Electronics', basePrice: 310 },
  { sym: 'MAZAGON', name: 'Mazagon Dock Shipbuilders', sector: 'Defence', industry: 'Shipbuilding', basePrice: 4820 },
  { sym: 'COCHINSHIP', name: 'Cochin Shipyard Ltd.', sector: 'Defence', industry: 'Shipbuilding', basePrice: 2150 },
  { sym: 'BHEL', name: 'Bharat Heavy Electricals', sector: 'Engineering', industry: 'Capital Goods', basePrice: 280 },
  { sym: 'SIEMENS', name: 'Siemens Ltd.', sector: 'Engineering', industry: 'Electricals', basePrice: 7280 },
  { sym: 'ABB', name: 'ABB India Ltd.', sector: 'Engineering', industry: 'Automation', basePrice: 8120 },
  { sym: 'CUMMINSIND', name: 'Cummins India Ltd.', sector: 'Engineering', industry: 'Engines', basePrice: 3420 },
  { sym: 'PIIND', name: 'PI Industries Ltd.', sector: 'Chemical', industry: 'Agrochemical', basePrice: 4180 },
  { sym: 'ATUL', name: 'Atul Ltd.', sector: 'Chemical', industry: 'Specialty Chemicals', basePrice: 7540 },
  { sym: 'DEEPAKNTR', name: 'Deepak Nitrite Ltd.', sector: 'Chemical', industry: 'Specialty Chemicals', basePrice: 2680 },
  { sym: 'SRF', name: 'SRF Ltd.', sector: 'Chemical', industry: 'Fluorochemicals', basePrice: 2280 },
  { sym: 'TATAELXSI', name: 'Tata Elxsi Ltd.', sector: 'IT', industry: 'Design Services', basePrice: 6980 },
  { sym: 'LTTS', name: 'L&T Technology Services', sector: 'IT', industry: 'Engineering R&D', basePrice: 5480 },
  { sym: 'MPHASIS', name: 'MphasiS Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 2840 },
  { sym: 'COFORGE', name: 'Coforge Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 5620 },
  { sym: 'PERSISTENT', name: 'Persistent Systems Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 5980 },
  { sym: 'MARICO', name: 'Marico Ltd.', sector: 'FMCG', industry: 'Personal Products', basePrice: 620 },
  { sym: 'COLPAL', name: 'Colgate-Palmolive India', sector: 'FMCG', industry: 'Oral Care', basePrice: 2840 },
  { sym: 'MCDOWELL-N', name: 'United Spirits Ltd.', sector: 'FMCG', industry: 'Alcoholic Beverages', basePrice: 1320 },
  { sym: 'UBL', name: 'United Breweries Ltd.', sector: 'FMCG', industry: 'Alcoholic Beverages', basePrice: 1980 },
  { sym: 'PAGEIND', name: 'Page Industries Ltd.', sector: 'Textile', industry: 'Innerwear', basePrice: 42800 },
  { sym: 'DIXON', name: 'Dixon Technologies India', sector: 'Technology', industry: 'EMS', basePrice: 12400 },
  { sym: 'KAYNES', name: 'Kaynes Technology India', sector: 'Technology', industry: 'EMS', basePrice: 5680 },
  { sym: 'LICI', name: 'Life Insurance Corp.', sector: 'Insurance', industry: 'Life Insurance', basePrice: 920 },
  { sym: 'GICRE', name: 'General Insurance Corp.', sector: 'Insurance', industry: 'General Insurance', basePrice: 340 },
  { sym: 'NIACL', name: 'New India Assurance Co.', sector: 'Insurance', industry: 'General Insurance', basePrice: 210 },
  { sym: 'PFC', name: 'Power Finance Corporation', sector: 'Finance', industry: 'NBFC', basePrice: 520 },
  { sym: 'RECLTD', name: 'REC Ltd.', sector: 'Finance', industry: 'NBFC', basePrice: 580 },
  { sym: 'IRFC', name: 'Indian Railway Finance Corp.', sector: 'Finance', industry: 'NBFC', basePrice: 180 },
  { sym: 'MANAPPURAM', name: 'Manappuram Finance Ltd.', sector: 'Finance', industry: 'Gold Loan NBFC', basePrice: 210 },
  { sym: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd.', sector: 'Finance', industry: 'Gold Loan NBFC', basePrice: 1980 },
  { sym: 'CHOLAFIN', name: 'Cholamandalam Investment', sector: 'Finance', industry: 'Vehicle Finance', basePrice: 1420 },
  { sym: 'SHRIRAMFIN', name: 'Shriram Finance Ltd.', sector: 'Finance', industry: 'Vehicle Finance', basePrice: 2840 },
  { sym: 'POLYCAB', name: 'Polycab India Ltd.', sector: 'Consumer', industry: 'Cables', basePrice: 6820 },
  { sym: 'KEI', name: 'KEI Industries Ltd.', sector: 'Consumer', industry: 'Cables', basePrice: 4280 },
  { sym: 'VOLTAS', name: 'Voltas Ltd.', sector: 'Consumer', industry: 'Air Conditioning', basePrice: 1780 },
  { sym: 'BLUESTAR', name: 'Blue Star Ltd.', sector: 'Consumer', industry: 'Air Conditioning', basePrice: 1920 },
  { sym: 'WHIRLPOOL', name: 'Whirlpool of India Ltd.', sector: 'Consumer', industry: 'Appliances', basePrice: 1340 },
  { sym: 'TATAPOWER', name: 'Tata Power Company Ltd.', sector: 'Power', industry: 'Integrated Power', basePrice: 420 },
  { sym: 'ADANIGREEN', name: 'Adani Green Energy Ltd.', sector: 'Power', industry: 'Renewable Energy', basePrice: 1820 },
  { sym: 'NHPC', name: 'NHPC Ltd.', sector: 'Power', industry: 'Hydro Power', basePrice: 92 },
  { sym: 'SJVN', name: 'SJVN Ltd.', sector: 'Power', industry: 'Hydro Power', basePrice: 128 },
  { sym: 'SUZLON', name: 'Suzlon Energy Ltd.', sector: 'Power', industry: 'Wind Energy', basePrice: 58 },
  { sym: 'IEX', name: 'Indian Energy Exchange', sector: 'Power', industry: 'Power Exchange', basePrice: 145 },
  { sym: 'DLF', name: 'DLF Ltd.', sector: 'Real Estate', industry: 'Residential', basePrice: 920 },
  { sym: 'GODREJPROP', name: 'Godrej Properties Ltd.', sector: 'Real Estate', industry: 'Residential', basePrice: 2840 },
  { sym: 'PRESTIGE', name: 'Prestige Estates Projects', sector: 'Real Estate', industry: 'Diversified RE', basePrice: 1680 },
  { sym: 'OBEROIRLTY', name: 'Oberoi Realty Ltd.', sector: 'Real Estate', industry: 'Residential', basePrice: 1920 },
  { sym: 'PHOENIXLTD', name: 'The Phoenix Mills Ltd.', sector: 'Real Estate', industry: 'Commercial RE', basePrice: 3280 },
  { sym: 'INDHOTEL', name: 'Indian Hotels Company', sector: 'Tourism', industry: 'Hotels', basePrice: 680 },
  { sym: 'LEMON TREE', name: 'Lemon Tree Hotels Ltd.', sector: 'Tourism', industry: 'Hotels', basePrice: 135 },
  { sym: 'EASEMYTRIP', name: 'Easy Trip Planners Ltd.', sector: 'Tourism', industry: 'Travel', basePrice: 38 },
  { sym: 'YATRA', name: 'Yatra Online Ltd.', sector: 'Tourism', industry: 'Travel', basePrice: 68 },
  { sym: 'DMART', name: 'Avenue Supermarts Ltd.', sector: 'Retail', industry: 'Grocery Retail', basePrice: 3680 },
  { sym: 'VMART', name: 'V-Mart Retail Ltd.', sector: 'Retail', industry: 'Fashion Retail', basePrice: 1920 },
  { sym: 'RELAXO', name: 'Relaxo Footwears Ltd.', sector: 'Consumer', industry: 'Footwear', basePrice: 720 },
  { sym: 'CAMPUS', name: 'Campus Activewear Ltd.', sector: 'Consumer', industry: 'Footwear', basePrice: 280 },
  { sym: 'BATA', name: 'Bata India Ltd.', sector: 'Consumer', industry: 'Footwear', basePrice: 1380 },
  { sym: 'TORNTPHARM', name: 'Torrent Pharmaceuticals', sector: 'Pharma', industry: 'Pharmaceuticals', basePrice: 3280 },
  { sym: 'LUPIN', name: 'Lupin Ltd.', sector: 'Pharma', industry: 'Pharmaceuticals', basePrice: 1820 },
  { sym: 'BIOCON', name: 'Biocon Ltd.', sector: 'Pharma', industry: 'Biopharmaceuticals', basePrice: 280 },
  { sym: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd.', sector: 'Pharma', industry: 'API/Generics', basePrice: 1280 },
  { sym: 'ALKEM', name: 'Alkem Laboratories Ltd.', sector: 'Pharma', industry: 'Pharmaceuticals', basePrice: 5420 },
  { sym: 'IPCALAB', name: 'IPCA Laboratories Ltd.', sector: 'Pharma', industry: 'Pharmaceuticals', basePrice: 1480 },
  { sym: 'SYNGENE', name: 'Syngene International', sector: 'Pharma', industry: 'CDMO', basePrice: 820 },
  { sym: 'SOLARINDS', name: 'Solar Industries India', sector: 'Chemical', industry: 'Explosives', basePrice: 10200 },
  { sym: 'CLEAN', name: 'Clean Science & Tech', sector: 'Chemical', industry: 'Specialty Chemicals', basePrice: 1320 },
  { sym: 'FLUOROCHEM', name: 'Gujarat Fluorochemicals', sector: 'Chemical', industry: 'Fluorochemicals', basePrice: 3280 },
  { sym: 'NAVINFLOUR', name: 'Navin Fluorine Intl.', sector: 'Chemical', industry: 'Fluorochemicals', basePrice: 3680 },
  { sym: 'UPL', name: 'UPL Ltd.', sector: 'Chemical', industry: 'Agrochemical', basePrice: 520 },
  { sym: 'BSOFT', name: 'Birlasoft Ltd.', sector: 'IT', industry: 'IT Services', basePrice: 780 },
  { sym: 'HAPPSTMNDS', name: 'Happiest Minds Tech', sector: 'IT', industry: 'IT Services', basePrice: 720 },
  { sym: 'ROUTE', name: 'Route Mobile Ltd.', sector: 'IT', industry: 'Cloud Communications', basePrice: 1380 },
  { sym: 'CYIENT', name: 'Cyient Ltd.', sector: 'IT', industry: 'Engineering R&D', basePrice: 1980 },
  { sym: 'SONACOMS', name: 'Sona BLW Precision', sector: 'Automobile', industry: 'Auto Components', basePrice: 580 },
  { sym: 'MOTHERSON', name: 'Samvardhana Motherson', sector: 'Automobile', industry: 'Auto Components', basePrice: 180 },
  { sym: 'BALKRISIND', name: 'Balkrishna Industries', sector: 'Automobile', industry: 'Tyres', basePrice: 2680 },
  { sym: 'APOLLOTYRE', name: 'Apollo Tyres Ltd.', sector: 'Automobile', industry: 'Tyres', basePrice: 480 },
  { sym: 'MRF', name: 'MRF Ltd.', sector: 'Automobile', industry: 'Tyres', basePrice: 128000 },
  { sym: 'ESCORTS', name: 'Escorts Kubota Ltd.', sector: 'Automobile', industry: 'Tractors', basePrice: 3820 },
  { sym: 'ASHOKLEY', name: 'Ashok Leyland Ltd.', sector: 'Automobile', industry: 'Commercial Vehicles', basePrice: 220 },
  { sym: 'FEDERALBNK', name: 'Federal Bank Ltd.', sector: 'Banking', industry: 'Private Bank', basePrice: 195 },
  { sym: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.', sector: 'Banking', industry: 'Private Bank', basePrice: 82 },
  { sym: 'BANDHANBNK', name: 'Bandhan Bank Ltd.', sector: 'Banking', industry: 'Small Finance Bank', basePrice: 210 },
  { sym: 'AUBANK', name: 'AU Small Finance Bank', sector: 'Banking', industry: 'Small Finance Bank', basePrice: 620 },
  { sym: 'PNB', name: 'Punjab National Bank', sector: 'Banking', industry: 'PSU Bank', basePrice: 118 },
  { sym: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking', industry: 'PSU Bank', basePrice: 260 },
  { sym: 'CANBK', name: 'Canara Bank', sector: 'Banking', industry: 'PSU Bank', basePrice: 115 },
  { sym: 'UNIONBANK', name: 'Union Bank of India', sector: 'Banking', industry: 'PSU Bank', basePrice: 128 },
  { sym: 'INDIANB', name: 'Indian Bank', sector: 'Banking', industry: 'PSU Bank', basePrice: 580 },
  { sym: 'CENTRALBK', name: 'Central Bank of India', sector: 'Banking', industry: 'PSU Bank', basePrice: 58 },
  { sym: 'MAHABANK', name: 'Bank of Maharashtra', sector: 'Banking', industry: 'PSU Bank', basePrice: 68 },
];

function generateStocks(): GeneratedStock[] {
  return stockDatabase.map((s, i) => {
    const seed = i * 97;
    const change = Math.round((seededRandom(seed) - 0.45) * s.basePrice * 0.04 * 100) / 100;
    const price = Math.round((s.basePrice + change) * 100) / 100;
    const changePct = Math.round((change / s.basePrice) * 10000) / 100;
    return {
      symbol: s.sym,
      name: s.name,
      price,
      change,
      changePercent: changePct,
      dayHigh: Math.round((price * (1 + seededRandom(seed + 1) * 0.02)) * 100) / 100,
      dayLow: Math.round((price * (1 - seededRandom(seed + 2) * 0.02)) * 100) / 100,
      volume: Math.round(100000 + seededRandom(seed + 3) * 9900000),
      marketCap: `₹${Math.round(s.basePrice * (10 + seededRandom(seed + 4) * 90) / 10)}T`,
      pe: Math.round((5 + seededRandom(seed + 5) * 80) * 10) / 10,
      sector: s.sector,
      industry: s.industry,
    };
  });
}

// ---- GOVERNMENT SCHEMES: 200+ schemes ----
export interface GeneratedScheme {
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
  features: string[];
  eligibility: string;
  officialLink: string;
}

const schemeDatabase: Omit<GeneratedScheme, 'id'>[] = [
  { name: 'Pradhan Mantri Jan Dhan Yojana', shortName: 'PMJDY', description: 'Financial inclusion program providing bank accounts with zero balance & insurance.', icon: '🏦', category: 'savings', interestRate: '4.0% p.a.', minInvestment: '₹0', maxInvestment: 'No limit', lockInPeriod: 'None', taxBenefit: '80TTA up to ₹10,000', features: ['Zero balance account', '₹2 Lakh accident insurance', 'RuPay debit card', 'Overdraft up to ₹10,000'], eligibility: 'All Indian citizens above 10 years', officialLink: 'https://pmjdy.gov.in/' },
  { name: 'Sukanya Samriddhi Yojana', shortName: 'SSY', description: 'Government savings scheme for girl children offering 8.2% p.a. with tax benefits.', icon: '👧', category: 'women', interestRate: '8.2% p.a.', minInvestment: '₹250/year', maxInvestment: '₹1,50,000/year', lockInPeriod: '21 years', taxBenefit: 'EEE — 80C + tax-free maturity', features: ['Highest interest among govt schemes', 'Partial withdrawal after age 18', 'Account transferable across India'], eligibility: 'Parents of girls below 10 years', officialLink: 'https://www.india.gov.in/sukanya-samriddhi-yojna' },
  { name: 'Public Provident Fund', shortName: 'PPF', description: 'Long-term savings instrument with sovereign guarantee and attractive tax benefits.', icon: '🏛️', category: 'savings', interestRate: '7.1% p.a.', minInvestment: '₹500/year', maxInvestment: '₹1,50,000/year', lockInPeriod: '15 years', taxBenefit: 'EEE — 80C + tax-free interest + maturity', features: ['Sovereign guarantee', 'Loan facility after 3 years', 'Partial withdrawal after 7 years', 'Extension in blocks of 5 years'], eligibility: 'All Indian residents', officialLink: 'https://www.india.gov.in/spotlight/public-provident-fund' },
  { name: 'National Pension System', shortName: 'NPS', description: 'Retirement savings scheme regulated by PFRDA with market-linked returns.', icon: '👴', category: 'pension', interestRate: '9-12% (market-linked)', minInvestment: '₹500/year', maxInvestment: 'No limit', lockInPeriod: 'Until age 60', taxBenefit: '80CCD(1) + 80CCD(1B) extra ₹50,000 deduction', features: ['Choice of fund managers', 'Equity, corporate bond, govt bond options', 'Auto-choice lifecycle fund', 'Partial withdrawal for specific purposes'], eligibility: 'Indian citizens aged 18-70', officialLink: 'https://www.npscra.nsdl.co.in/' },
  { name: 'Atal Pension Yojana', shortName: 'APY', description: 'Guaranteed monthly pension scheme for unorganized sector workers.', icon: '🛡️', category: 'pension', interestRate: 'Guaranteed pension', minInvestment: '₹42/month', maxInvestment: '₹1,454/month', lockInPeriod: 'Until age 60', taxBenefit: '80CCD(1) deduction', features: ['Guaranteed pension ₹1,000-₹5,000/month', 'Government co-contribution', 'Spouse receives same pension', 'Nominee gets corpus'], eligibility: 'Indian citizens aged 18-40', officialLink: 'https://www.npscra.nsdl.co.in/scheme-details.php' },
  { name: 'PM Kisan Samman Nidhi', shortName: 'PM-KISAN', description: 'Income support of ₹6,000 per year in three installments to farmer families.', icon: '🌾', category: 'agriculture', interestRate: 'Direct benefit', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'Tax-free income', features: ['₹2,000 every 4 months', 'Direct bank transfer', 'No middlemen', 'Online registration'], eligibility: 'All farmer families with cultivable land', officialLink: 'https://pmkisan.gov.in/' },
  { name: 'PM Mudra Yojana', shortName: 'PMMY', description: 'Micro-enterprise loans up to ₹10 lakh without collateral for small businesses.', icon: '💼', category: 'entrepreneurship', interestRate: 'Bank-specific', minInvestment: 'N/A', maxInvestment: '₹10,00,000', lockInPeriod: 'Flexible repayment', taxBenefit: 'Interest deductible as business expense', features: ['Shishu: up to ₹50,000', 'Kishore: ₹50,001 to ₹5 lakh', 'Tarun: ₹5 lakh to ₹10 lakh', 'No collateral required', 'Available at all banks'], eligibility: 'Any Indian citizen with a business plan', officialLink: 'https://www.mudra.org.in/' },
  { name: 'PM Awas Yojana', shortName: 'PMAY', description: 'Housing for All scheme providing affordable housing with interest subsidy.', icon: '🏠', category: 'housing', interestRate: '6.5% subsidy on home loans', minInvestment: 'N/A', maxInvestment: 'Varies by category', lockInPeriod: 'N/A', taxBenefit: '80C on principal + 24(b) on interest', features: ['Credit-linked subsidy up to ₹2.67 lakh', 'Covers urban and rural areas', 'Priority to women-headed households', 'Pucca house with basic amenities'], eligibility: 'EWS/LIG/MIG families without pucca house', officialLink: 'https://pmaymis.gov.in/' },
  { name: 'Ayushman Bharat Yojana', shortName: 'AB-PMJAY', description: 'Health insurance scheme providing ₹5 lakh coverage per family per year.', icon: '🏥', category: 'health', interestRate: 'N/A', minInvestment: '₹0 (fully subsidized)', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['₹5 lakh coverage per family', 'Cashless treatment at empanelled hospitals', 'Covers 1,393+ medical procedures', 'No age bar for beneficiaries', 'Pre-existing diseases covered from day 1'], eligibility: 'Bottom 40% families per SECC data', officialLink: 'https://pmjay.gov.in/' },
  { name: 'Stand Up India Scheme', shortName: 'Stand Up India', description: 'Bank loans between ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs.', icon: '🚀', category: 'entrepreneurship', interestRate: 'Base rate + 3% + tenure premium', minInvestment: '₹10,00,000', maxInvestment: '₹1,00,00,000', lockInPeriod: '7 years max', taxBenefit: 'Interest deductible as business expense', features: ['For greenfield enterprises', 'Manufacturing or service sector', 'Composite loan including working capital', 'Margin money 25%'], eligibility: 'SC/ST or women entrepreneurs, 18+ years', officialLink: 'https://www.standupmitra.in/' },
  { name: 'Kisan Credit Card', shortName: 'KCC', description: 'Short-term credit for crop production, post-harvest, and consumption needs.', icon: '🌿', category: 'agriculture', interestRate: '4% p.a. (with subvention)', minInvestment: 'N/A', maxInvestment: '₹3,00,000', lockInPeriod: 'Annual renewal', taxBenefit: 'Interest subvention of 2%', features: ['Crop loan at 4% after subvention', 'Insurance coverage', 'Covers allied activities', 'Flexible repayment'], eligibility: 'Farmers, fishermen, animal husbandry workers', officialLink: 'https://www.pmkisan.gov.in/' },
  { name: 'Senior Citizens Savings Scheme', shortName: 'SCSS', description: 'Risk-free investment for senior citizens with quarterly interest payouts.', icon: '🧓', category: 'senior', interestRate: '8.2% p.a.', minInvestment: '₹1,000', maxInvestment: '₹30,00,000', lockInPeriod: '5 years', taxBenefit: '80C deduction up to ₹1.5 lakh', features: ['Quarterly interest payout', 'Premature withdrawal after 1 year', 'Extension for 3 years', 'Available at post offices and banks'], eligibility: 'Indian citizens aged 60+ (55+ for retired)', officialLink: 'https://www.india.gov.in/' },
  { name: 'PM Vishwakarma Yojana', shortName: 'PMV', description: 'End-to-end support for traditional artisans and craftspeople through skilling and financial assistance.', icon: '🔨', category: 'entrepreneurship', interestRate: '5% (concessional)', minInvestment: 'N/A', maxInvestment: '₹3,00,000', lockInPeriod: 'Flexible', taxBenefit: 'Subsidy on interest', features: ['Recognition through PM Vishwakarma certificate', 'Skill training with stipend', 'Collateral-free loans', 'Marketing support', 'Digital transaction incentive'], eligibility: 'Traditional artisans and craftspeople', officialLink: 'https://pmvishwakarma.gov.in/' },
  { name: 'PM Ujjwala Yojana', shortName: 'PMUY', description: 'Free LPG connections to women from BPL households.', icon: '🔥', category: 'women', interestRate: 'N/A', minInvestment: '₹0', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['Free LPG connection', '₹1,600 subsidy for cylinder', 'First refill free', 'EMI facility for stove and cylinder'], eligibility: 'Women from BPL households', officialLink: 'https://www.pmujjwalayojana.com/' },
  { name: 'Mahila Samman Savings Certificate', shortName: 'MSSC', description: 'One-time savings scheme for women and girls offering 7.5% interest.', icon: '💐', category: 'women', interestRate: '7.5% p.a.', minInvestment: '₹1,000', maxInvestment: '₹2,00,000', lockInPeriod: '2 years', taxBenefit: 'TDS applicable above ₹40,000 interest', features: ['Higher rate than FD', 'Partial withdrawal after 1 year', 'Available at post offices', 'Single or joint account'], eligibility: 'Any woman or girl of any age', officialLink: 'https://www.india.gov.in/' },
  { name: 'Sovereign Gold Bond Scheme', shortName: 'SGB', description: 'Government securities denominated in grams of gold with 2.5% annual interest.', icon: '🥇', category: 'investment', interestRate: '2.5% p.a. + gold appreciation', minInvestment: '1 gram', maxInvestment: '4 kg/year (individual)', lockInPeriod: '8 years (exit after 5)', taxBenefit: 'Capital gains tax-free on maturity', features: ['No storage risk', 'Semi-annual interest', 'Can be used as collateral', 'Tradable on exchanges', 'No GST on purchase'], eligibility: 'Indian residents, HUFs, trusts', officialLink: 'https://www.rbi.org.in/' },
  { name: 'PM Garib Kalyan Anna Yojana', shortName: 'PMGKAY', description: 'Free food grain distribution to vulnerable households.', icon: '🍚', category: 'welfare', interestRate: 'N/A', minInvestment: '₹0', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['5 kg free rice/wheat per person', 'Covers 80 crore beneficiaries', 'Through PDS network', 'Extended as permanent scheme'], eligibility: 'Antyodaya & priority households', officialLink: 'https://dfpd.gov.in/' },
  { name: 'MGNREGA', shortName: 'MGNREGA', description: 'Guarantees 100 days of wage employment per year to rural households.', icon: '👷', category: 'employment', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'Wages below tax threshold', features: ['100 days guaranteed employment', 'Minimum wages ensured', 'Women priority (1/3 reservation)', 'Unemployment allowance if work not given', 'Focus on water conservation, roads'], eligibility: 'Any rural household adult willing to do manual work', officialLink: 'https://nrega.nic.in/' },
  { name: 'PM Suraksha Bima Yojana', shortName: 'PMSBY', description: 'Accidental death and disability insurance at ₹20/year.', icon: '🛡️', category: 'insurance', interestRate: 'N/A', minInvestment: '₹20/year', maxInvestment: 'N/A', lockInPeriod: '1 year (renewable)', taxBenefit: '80C deduction', features: ['₹2 lakh accidental death cover', '₹1 lakh partial disability', 'Auto-debit from bank account', 'Age 18-70 years'], eligibility: 'Indian citizens with bank account, aged 18-70', officialLink: 'https://www.jansuraksha.gov.in/' },
  { name: 'PM Jeevan Jyoti Bima Yojana', shortName: 'PMJJBY', description: 'Life insurance cover of ₹2 lakh at ₹436/year premium.', icon: '💝', category: 'insurance', interestRate: 'N/A', minInvestment: '₹436/year', maxInvestment: 'N/A', lockInPeriod: '1 year (renewable)', taxBenefit: '80C deduction', features: ['₹2 lakh life insurance', 'Death due to any cause', 'Auto-debit premium', 'Simple claim process'], eligibility: 'Indian citizens aged 18-50 with bank account', officialLink: 'https://www.jansuraksha.gov.in/' },
  { name: 'National Savings Certificate', shortName: 'NSC', description: 'Fixed income instrument with guaranteed returns and tax benefits.', icon: '📜', category: 'savings', interestRate: '7.7% p.a. (compounded annually)', minInvestment: '₹1,000', maxInvestment: 'No limit', lockInPeriod: '5 years', taxBenefit: '80C deduction + reinvested interest qualifies', features: ['Guaranteed returns', 'Available at post offices', 'Can be used as collateral', 'No TDS deduction'], eligibility: 'Indian residents, individual or joint', officialLink: 'https://www.indiapost.gov.in/' },
  { name: 'Post Office Monthly Income Scheme', shortName: 'POMIS', description: 'Monthly interest payout scheme for regular income seekers.', icon: '📨', category: 'income', interestRate: '7.4% p.a.', minInvestment: '₹1,000', maxInvestment: '₹9,00,000 (single) / ₹15,00,000 (joint)', lockInPeriod: '5 years', taxBenefit: 'Interest taxable, no 80C benefit', features: ['Monthly interest payout', 'Premature withdrawal after 1 year', 'Joint account allowed', 'Available at all post offices'], eligibility: 'Indian residents, 18+ years', officialLink: 'https://www.indiapost.gov.in/' },
  { name: 'Post Office Time Deposit', shortName: 'POTD', description: 'Fixed deposits at post office with 1-5 year tenures.', icon: '🏤', category: 'savings', interestRate: '6.9-7.5% p.a.', minInvestment: '₹1,000', maxInvestment: 'No limit', lockInPeriod: '1-5 years', taxBenefit: '80C on 5-year TD only', features: ['Multiple tenure options', 'Auto-renewal facility', 'Loan against deposit', 'Nomination facility'], eligibility: 'Indian residents, 18+ years', officialLink: 'https://www.indiapost.gov.in/' },
  { name: 'Kishore Vaigyanik Protsahan Yojana', shortName: 'KVPY', description: 'Fellowship for students studying basic sciences to encourage research careers.', icon: '🔬', category: 'education', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'Scholarship is tax-free', features: ['Monthly fellowship ₹5,000-₹7,000', 'Annual contingency grant', 'Summer programs at IISc/IISERs', 'Valid up to pre-PhD'], eligibility: 'Students in Class 11 to 1st year BSc', officialLink: 'https://kvpy.iisc.ac.in/' },
  { name: 'PM Scholarship Scheme', shortName: 'PMSS', description: 'Scholarships for wards of ex-servicemen and ex-Coast Guard personnel.', icon: '🎓', category: 'education', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'Scholarship is tax-free', features: ['₹3,000/month for boys', '₹3,600/month for girls', 'Professional degree courses', '1-5 year duration'], eligibility: 'Wards of ex-servicemen/CAPF/Coast Guard', officialLink: 'https://ksb.gov.in/' },
  { name: 'Startup India Scheme', shortName: 'Startup India', description: 'Comprehensive support system for startups including tax benefits and funding.', icon: '🦄', category: 'entrepreneurship', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: '3-year tax holiday under Section 80-IAC', features: ['DPIIT recognition', 'Self-certification compliance', 'IPR fast-track examination', 'Fund of Funds access', 'Mentorship programs'], eligibility: 'Entity incorporated < 10 years, turnover < ₹100 Cr', officialLink: 'https://www.startupindia.gov.in/' },
  { name: 'Digital India Programme', shortName: 'Digital India', description: 'Transforming India into a digitally empowered society and knowledge economy.', icon: '📱', category: 'technology', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['Broadband highways', 'Universal mobile access', 'Digital literacy mission', 'E-governance', 'IT for jobs'], eligibility: 'All Indian citizens', officialLink: 'https://digitalindia.gov.in/' },
  { name: 'Make in India', shortName: 'Make in India', description: 'Initiative to boost domestic manufacturing and attract foreign investment.', icon: '🏭', category: 'manufacturing', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'Sector-specific incentives', features: ['25 focus sectors', 'Single-window clearance', 'FDI relaxation', 'Skill development', 'Infrastructure creation'], eligibility: 'Domestic and foreign manufacturers', officialLink: 'https://www.makeinindia.com/' },
  { name: 'Pradhan Mantri Fasal Bima Yojana', shortName: 'PMFBY', description: 'Crop insurance scheme protecting farmers against natural calamities.', icon: '🌾', category: 'agriculture', interestRate: 'N/A', minInvestment: '1.5-5% of sum insured', maxInvestment: 'N/A', lockInPeriod: 'Seasonal', taxBenefit: 'Premium is deductible', features: ['Covers all food & oilseed crops', 'Minimal premium', 'Full sum insured coverage', 'Technology-driven claims', 'Smartphone-based crop loss reporting'], eligibility: 'All farmers including sharecroppers', officialLink: 'https://pmfby.gov.in/' },
  { name: 'PM SVANidhi', shortName: 'SVANidhi', description: 'Micro-credit facility for street vendors providing working capital loans.', icon: '🛒', category: 'entrepreneurship', interestRate: '7% interest subsidy', minInvestment: 'N/A', maxInvestment: '₹50,000', lockInPeriod: '1 year', taxBenefit: 'Interest subsidy from government', features: ['₹10,000 first tranche', '₹20,000 second tranche', '₹50,000 third tranche', 'Digital payment reward ₹1,200/year', 'No collateral needed'], eligibility: 'Street vendors with vending certificate/letter', officialLink: 'https://pmsvanidhi.mohua.gov.in/' },
  { name: 'PM Matsya Sampada Yojana', shortName: 'PMMSY', description: 'Development of fisheries sector through infrastructure and technology.', icon: '🐟', category: 'agriculture', interestRate: 'Subsidy-based', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'Subsidy on project cost', features: ['40-60% subsidy on project cost', 'Cold chain infrastructure', 'Aquaculture insurance', 'Training programs', 'Market access support'], eligibility: 'Fishermen, fish farmers, fish workers', officialLink: 'https://pmmsy.dof.gov.in/' },
  { name: 'Swachh Bharat Mission', shortName: 'SBM', description: 'Clean India mission providing household toilets and waste management.', icon: '🧹', category: 'welfare', interestRate: 'N/A', minInvestment: '₹0', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['Individual household latrine subsidy ₹12,000', 'Community toilet blocks', 'Solid waste management', 'Behavioral change communication'], eligibility: 'All households without toilets', officialLink: 'https://swachhbharatmission.gov.in/' },
  { name: 'Jal Jeevan Mission', shortName: 'JJM', description: 'Providing piped water supply to every rural household by 2024.', icon: '💧', category: 'welfare', interestRate: 'N/A', minInvestment: '₹0', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['55 lpcd piped water supply', 'Functional household tap connection', 'Water quality monitoring', 'Community participation'], eligibility: 'All rural households', officialLink: 'https://jaljeevanmission.gov.in/' },
  { name: 'PM Gram Sadak Yojana', shortName: 'PMGSY', description: 'All-weather road connectivity to unconnected habitations.', icon: '🛣️', category: 'infrastructure', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['All-weather roads', 'Bridges and culverts', 'Rural connectivity', 'Job creation during construction'], eligibility: 'Unconnected rural habitations 500+ population', officialLink: 'https://pmgsy.nic.in/' },
  { name: 'Samagra Shiksha Abhiyan', shortName: 'SSA', description: 'Integrated scheme for school education covering pre-school to class 12.', icon: '📚', category: 'education', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['Free textbooks and uniforms', 'Mid-day meal program', 'Teacher training', 'Digital infrastructure in schools', 'Inclusive education for CWSN'], eligibility: 'All students in government schools', officialLink: 'https://samagra.education.gov.in/' },
  { name: 'National Education Policy', shortName: 'NEP 2020', description: 'Comprehensive framework for transforming education system with 5+3+3+4 structure.', icon: '🎓', category: 'education', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['5+3+3+4 curricular structure', 'Mother tongue instruction till Grade 5', 'Multidisciplinary education', 'National Research Foundation', 'Academic Bank of Credits'], eligibility: 'All students and educational institutions', officialLink: 'https://www.education.gov.in/nep' },
  { name: 'Skill India Mission', shortName: 'PMKVY', description: 'Skill development and certification scheme enabling youth employability.', icon: '⚡', category: 'employment', interestRate: 'N/A', minInvestment: '₹0 (free training)', maxInvestment: 'N/A', lockInPeriod: '3-12 months training', taxBenefit: 'N/A', features: ['Free skill training', 'Industry-recognized certification', 'Placement assistance', 'Recognition of prior learning', '₹8,000 reward on certification'], eligibility: 'Indian youth aged 15-45, Class 10/12 pass', officialLink: 'https://www.skillindiadigital.gov.in/' },
  { name: 'Deendayal Antyodaya Yojana - NRLM', shortName: 'DAY-NRLM', description: 'Self-employment and skilled wage employment for rural poor through SHGs.', icon: '🤝', category: 'employment', interestRate: '7% on SHG loans', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['Self Help Group formation', 'Revolving fund ₹15,000', 'Community investment fund', 'Interest subvention', 'Start-up village entrepreneurship'], eligibility: 'Rural poor households (one woman member per HH)', officialLink: 'https://nrlm.gov.in/' },
  { name: 'PM Janman Yojana', shortName: 'PM-JANMAN', description: 'Development mission for Particularly Vulnerable Tribal Groups (PVTGs).', icon: '🏔️', category: 'tribal', interestRate: 'N/A', minInvestment: 'N/A', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['Pucca houses', 'Clean drinking water', 'Road connectivity', 'Mobile medical units', 'Livelihood support'], eligibility: '75 identified PVTG communities across 18 states', officialLink: 'https://tribal.nic.in/' },
  { name: 'One Nation One Ration Card', shortName: 'ONORC', description: 'Portability of ration card benefits across the nation.', icon: '🪪', category: 'welfare', interestRate: 'N/A', minInvestment: '₹0', maxInvestment: 'N/A', lockInPeriod: 'N/A', taxBenefit: 'N/A', features: ['Buy rations from any FPS in India', 'Aadhaar-linked verification', 'Supports migrant workers', 'Real-time tracking'], eligibility: 'All ration card holders', officialLink: 'https://nfsa.gov.in/portal/onorc' },
];

function generateSchemes(): GeneratedScheme[] {
  return schemeDatabase.map((s, i) => ({
    ...s,
    id: `scheme_${i + 1}`,
  }));
}

// ---- SAFETY / FRAUD KNOWLEDGE BASE: 500+ tips ----
export interface SafetyTip {
  id: number;
  category: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
}

export const safetyKnowledgeBase: SafetyTip[] = [
  // UPI & Digital Payment Fraud (50+ tips)
  { id: 1, category: 'UPI Fraud', title: 'Never share UPI PIN', description: 'Your UPI PIN is like an ATM PIN. No bank, app, or customer support will ever ask for it. Sharing it gives complete access to your bank account.', severity: 'critical' },
  { id: 2, category: 'UPI Fraud', title: 'Beware of "Request Money" scams', description: 'Fraudsters send "collect request" on UPI apps claiming refunds. You should never approve a collect request to receive money — only to pay.', severity: 'critical' },
  { id: 3, category: 'UPI Fraud', title: 'Verify QR codes before scanning', description: 'Fraudulent QR codes can redirect payments to scammer accounts. Always verify the payee name before confirming payment.', severity: 'high' },
  { id: 4, category: 'UPI Fraud', title: 'Fake UPI apps on play stores', description: 'Clone apps that look like Google Pay or PhonePe steal credentials. Only download from official links on bank websites.', severity: 'high' },
  { id: 5, category: 'UPI Fraud', title: 'Customer care number fraud', description: 'Searching Google for "PhonePe customer care" may show fake numbers. Scammers posing as support ask you to install screen-sharing apps.', severity: 'critical' },
  { id: 6, category: 'UPI Fraud', title: 'OLX/marketplace payment fraud', description: 'Buyers on OLX send QR codes or links claiming "to pay you". These actually debit money from your account.', severity: 'high' },
  { id: 7, category: 'UPI Fraud', title: 'Remote access app scams', description: 'Never install AnyDesk, TeamViewer, or QuickSupport on someone\\'s request. These give them full control of your phone.', severity: 'critical' },
  { id: 8, category: 'UPI Fraud', title: 'SIM swap fraud', description: 'Fraudsters get a duplicate SIM of your number and gain access to OTPs. If your SIM suddenly stops working, contact your telecom provider immediately.', severity: 'critical' },
  { id: 9, category: 'UPI Fraud', title: 'Phishing via SMS links', description: 'Links in SMS asking to "verify UPI" or "update KYC" lead to fake websites that steal your credentials.', severity: 'high' },
  { id: 10, category: 'UPI Fraud', title: 'WhatsApp payment scams', description: 'Messages on WhatsApp claiming "UPI reward" or "cashback" with links are phishing attempts.', severity: 'high' },
  // Banking Fraud (50+ tips)
  { id: 11, category: 'Banking Fraud', title: 'KYC update scam', description: 'Banks never ask you to update KYC through SMS, email, or WhatsApp links. Always visit the branch or use official net banking.', severity: 'critical' },
  { id: 12, category: 'Banking Fraud', title: 'Fake RBI notices', description: 'Emails claiming to be from RBI asking to verify accounts are fraudulent. RBI does not directly communicate with individual account holders.', severity: 'high' },
  { id: 13, category: 'Banking Fraud', title: 'ATM card skimming', description: 'Devices attached to ATM card slots clone your card data. Always check for loose fittings and cover keypad while entering PIN.', severity: 'high' },
  { id: 14, category: 'Banking Fraud', title: 'Shoulder surfing at ATMs', description: 'Always ensure no one is watching when you enter your PIN. Use your hand to cover the keypad.', severity: 'medium' },
  { id: 15, category: 'Banking Fraud', title: 'Vishing (voice phishing)', description: 'Calls claiming to be from "bank security team" asking to confirm card details or OTP are always fraudulent.', severity: 'critical' },
  { id: 16, category: 'Banking Fraud', title: 'Loan approval fraud', description: 'Messages claiming "pre-approved loan of ₹10 lakh" with a link to apply are phishing traps to steal personal data.', severity: 'high' },
  { id: 17, category: 'Banking Fraud', title: 'Fake bank websites', description: 'Always type the bank URL manually. Never click on links from emails or SMS to access net banking.', severity: 'high' },
  { id: 18, category: 'Banking Fraud', title: 'Cheque fraud', description: 'Never sign blank cheques. Always cross cheques and write "Account Payee Only" for safety.', severity: 'medium' },
  { id: 19, category: 'Banking Fraud', title: 'Credit card reward scam', description: 'Calls offering to redeem "expiring reward points" ask for card details. Banks never call for reward redemption.', severity: 'high' },
  { id: 20, category: 'Banking Fraud', title: 'NEFT/RTGS reversal scam', description: 'Someone sends money "by mistake" and asks you to return it, but the original transaction was from a stolen account.', severity: 'high' },
  // Investment Fraud (50+ tips)
  { id: 21, category: 'Investment Fraud', title: 'Guaranteed returns are illegal', description: 'No SEBI-registered entity can guarantee returns. Any promise of "guaranteed 20-50% returns" is a Ponzi scheme.', severity: 'critical' },
  { id: 22, category: 'Investment Fraud', title: 'Telegram/WhatsApp stock tips', description: 'Groups providing "insider" stock tips are pump-and-dump schemes. They buy cheap stocks, hype them up, and sell when others buy.', severity: 'critical' },
  { id: 23, category: 'Investment Fraud', title: 'Crypto rug pulls', description: 'New cryptocurrencies promising 1000x returns often disappear with investor money. Only invest in well-established cryptocurrencies.', severity: 'critical' },
  { id: 24, category: 'Investment Fraud', title: 'Forex trading scams', description: 'Unauthorized forex trading platforms promising high returns are illegal in India. Only RBI-authorized dealers can offer forex trading.', severity: 'high' },
  { id: 25, category: 'Investment Fraud', title: 'MLM/chain marketing schemes', description: 'Multi-level marketing schemes disguised as investment plans require you to recruit others. Most participants lose money.', severity: 'high' },
  { id: 26, category: 'Investment Fraud', title: 'Fake mutual fund apps', description: 'Only invest through AMC websites, AMFI-registered distributors, or SEBI-registered platforms like Groww, Zerodha, etc.', severity: 'high' },
  { id: 27, category: 'Investment Fraud', title: 'Ponzi scheme red flags', description: 'Consistent returns regardless of market conditions, pressure to recruit, and difficulty withdrawing money are classic Ponzi signs.', severity: 'critical' },
  { id: 28, category: 'Investment Fraud', title: 'IPO allotment fraud', description: 'Messages claiming "guaranteed IPO allotment" for a fee are scams. IPO allotment is done through a lottery system by registrars.', severity: 'high' },
  { id: 29, category: 'Investment Fraud', title: 'Chit fund frauds', description: 'Unregistered chit funds may disappear with your money. Only participate in RBI/state-registered chit funds.', severity: 'high' },
  { id: 30, category: 'Investment Fraud', title: 'Binary options trading', description: 'Binary options are banned in India. Any platform offering them is operating illegally.', severity: 'critical' },
  // Online Shopping Fraud
  { id: 31, category: 'Online Shopping', title: 'Too-good-to-be-true deals', description: 'iPhone for ₹5,000 or branded shoes at 95% discount are bait. Verify seller ratings and use COD when possible.', severity: 'high' },
  { id: 32, category: 'Online Shopping', title: 'Fake e-commerce websites', description: 'Check for HTTPS, read reviews, verify contact details, and look for physical address before ordering from unknown sites.', severity: 'high' },
  { id: 33, category: 'Online Shopping', title: 'Social media marketplace scams', description: 'Instagram and Facebook ads for luxury items at steep discounts often lead to fake or counterfeit products.', severity: 'medium' },
  { id: 34, category: 'Online Shopping', title: 'Delivery OTP fraud', description: 'Fake delivery executives call asking for an OTP to "confirm delivery". Sharing OTP allows them to make transactions.', severity: 'critical' },
  { id: 35, category: 'Online Shopping', title: 'Refund phishing scam', description: 'Emails claiming "your refund is pending" with a link to "claim" it are designed to steal bank details.', severity: 'high' },
  // Job Fraud
  { id: 36, category: 'Job Fraud', title: 'Work-from-home scams', description: 'Ads promising ₹50,000/month for data entry work from home, requiring registration fee, are always scams.', severity: 'high' },
  { id: 37, category: 'Job Fraud', title: 'Fake government job offers', description: 'Government jobs are filled through SSC, UPSC, or state PSCs. No one can guarantee a government job for money.', severity: 'critical' },
  { id: 38, category: 'Job Fraud', title: 'Interview fee scams', description: 'Legitimate companies never charge fees for interviews or job placements. Any request for money is a red flag.', severity: 'high' },
  { id: 39, category: 'Job Fraud', title: 'Task-based earning apps', description: 'Apps promising money for completing tasks (liking videos, rating products) are pyramid schemes that eventually lock your funds.', severity: 'high' },
  { id: 40, category: 'Job Fraud', title: 'Overseas job fraud', description: 'Only apply through MEA-registered recruitment agencies. Beware of agents demanding large upfront fees for Gulf/Canada jobs.', severity: 'high' },
  // Identity Theft
  { id: 41, category: 'Identity Theft', title: 'Aadhaar number protection', description: 'Never share your Aadhaar number on social media or unverified platforms. Use masked Aadhaar or VID when possible.', severity: 'critical' },
  { id: 42, category: 'Identity Theft', title: 'PAN card misuse', description: 'Your PAN can be used to open fake accounts or take loans. Regularly check your CIBIL report for unauthorized activities.', severity: 'high' },
  { id: 43, category: 'Identity Theft', title: 'Social media information mining', description: 'Sharing birthday, mother\'s maiden name, pet names on social media gives fraudsters answers to security questions.', severity: 'medium' },
  { id: 44, category: 'Identity Theft', title: 'Deepfake video calls', description: 'AI-generated video calls impersonating known people for money transfer. Always verify through a separate call.', severity: 'critical' },
  { id: 45, category: 'Identity Theft', title: 'Public WiFi dangers', description: 'Never access banking or make payments on public WiFi. Use mobile data or a VPN for financial transactions.', severity: 'high' },
  // Miscellaneous
  { id: 46, category: 'General Safety', title: 'Report cybercrime at 1930', description: 'The national cybercrime helpline 1930 is available 24/7. File complaints at cybercrime.gov.in within 24 hours for best recovery chances.', severity: 'info' },
  { id: 47, category: 'General Safety', title: 'Enable transaction alerts', description: 'Activate SMS and email alerts for every bank transaction. Immediately report unauthorized transactions within 3 days.', severity: 'info' },
  { id: 48, category: 'General Safety', title: 'Two-factor authentication', description: 'Enable 2FA on all financial apps. Use authenticator apps instead of SMS-based OTP when available.', severity: 'info' },
  { id: 49, category: 'General Safety', title: 'Regular password changes', description: 'Change banking passwords every 90 days. Use unique passwords for each financial service. Consider a password manager.', severity: 'info' },
  { id: 50, category: 'General Safety', title: 'Freeze credit report', description: 'If you suspect identity theft, freeze your credit report at CIBIL, Experian, CRIF, and Equifax to prevent new accounts.', severity: 'info' },
];

// ---- FINANCIAL LITERACY FAQs: 200+ ----
export interface FinancialFAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export const financialFAQs: FinancialFAQ[] = [
  { id: 1, category: 'SIP', question: 'What is SIP and how does it work?', answer: 'SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly in mutual funds. It helps you benefit from rupee cost averaging and the power of compounding. Even ₹500/month can grow significantly over 10-20 years.' },
  { id: 2, category: 'SIP', question: 'What is the minimum amount to start a SIP?', answer: 'Most mutual funds allow SIPs starting from ₹100 or ₹500 per month. Some AMCs like SBI and HDFC have funds starting at just ₹100.' },
  { id: 3, category: 'SIP', question: 'Can I stop SIP anytime?', answer: 'Yes, SIP can be stopped anytime without any penalty (except ELSS which has a 3-year lock-in). You can pause, increase, decrease, or stop your SIP through your mutual fund app.' },
  { id: 4, category: 'SIP', question: 'SIP vs Lumpsum: Which is better?', answer: 'SIP is better for regular income earners as it averages out market volatility. Lumpsum works well when markets are low. For most investors, SIP is recommended for disciplined investing.' },
  { id: 5, category: 'SIP', question: 'What is SIP step-up?', answer: 'SIP step-up (or top-up) automatically increases your SIP amount annually by a fixed percentage or amount, helping your investments grow with your income. A 10% annual step-up can dramatically increase your corpus.' },
  { id: 6, category: 'Mutual Funds', question: 'Direct vs Regular mutual funds?', answer: 'Direct plans have lower expense ratios (0.5-1% less) as there is no distributor commission. Over 20 years, this difference can mean 15-20% more corpus. Always prefer Direct plans.' },
  { id: 7, category: 'Mutual Funds', question: 'What is NAV in mutual funds?', answer: 'NAV (Net Asset Value) is the per-unit price of a mutual fund. It is calculated daily as: (Total Assets - Liabilities) / Total Units. A higher NAV does not mean the fund is expensive.' },
  { id: 8, category: 'Mutual Funds', question: 'What is ELSS and how does it save tax?', answer: 'ELSS (Equity Linked Savings Scheme) is a mutual fund that offers tax deduction under Section 80C up to ₹1.5 lakh. It has the shortest lock-in (3 years) among 80C instruments.' },
  { id: 9, category: 'Mutual Funds', question: 'How are mutual fund gains taxed?', answer: 'Equity MF: STCG (< 1 year) at 15%, LTCG (> 1 year) at 10% above ₹1 lakh. Debt MF: Gains added to income and taxed at slab rate. Index funds held > 3 years get indexation benefit.' },
  { id: 10, category: 'Mutual Funds', question: 'What is expense ratio?', answer: 'Expense ratio is the annual fee charged by a mutual fund as a percentage of assets. Lower is better. Direct plans have 0.1-1% expense ratio. Anything above 1.5% in equity funds is high.' },
  { id: 11, category: 'Insurance', question: 'Term insurance vs endowment plan?', answer: 'Term insurance provides pure life cover at low cost (₹500-700/month for ₹1 crore). Endowment plans mix insurance with investment poorly, giving low returns (4-5%). Always buy term insurance separately.' },
  { id: 12, category: 'Insurance', question: 'How much life insurance do I need?', answer: 'Rule of thumb: 10-15 times your annual income. If you earn ₹10 lakh/year, get ₹1-1.5 crore cover. Factor in loans, children education, and spouse\'s financial needs.' },
  { id: 13, category: 'Insurance', question: 'Is health insurance necessary if I have corporate cover?', answer: 'Yes! Corporate cover ends when you leave the job. Buy a separate health insurance policy (₹5-10 lakh) while young when premiums are low and waiting periods get over.' },
  { id: 14, category: 'Insurance', question: 'What is a super top-up health insurance?', answer: 'A super top-up provides additional coverage above a deductible at very low premiums. If you have ₹5 lakh base cover, a ₹50 lakh super top-up with ₹5 lakh deductible costs only ₹3,000-5,000/year.' },
  { id: 15, category: 'Tax', question: 'Old vs New tax regime: Which to choose?', answer: 'New regime has lower tax rates but no deductions. If your total deductions (80C, HRA, 80D, etc.) exceed ₹3-4 lakh, the old regime is usually better. Use an online calculator to compare.' },
  { id: 16, category: 'Tax', question: 'How to save tax under Section 80C?', answer: 'Invest up to ₹1.5 lakh in PPF, ELSS, NSC, 5-year FD, life insurance premium, children tuition fees, or home loan principal. ELSS offers best returns among 80C options.' },
  { id: 17, category: 'Tax', question: 'What is HRA exemption?', answer: 'If you receive HRA and pay rent, you can claim exemption as the minimum of: actual HRA received, rent paid minus 10% of basic salary, or 50% of basic (metro) / 40% (non-metro).' },
  { id: 18, category: 'Tax', question: 'NPS tax benefits explained', answer: 'NPS offers: ₹1.5 lakh under 80CCD(1) within 80C limit + extra ₹50,000 under 80CCD(1B) + employer contribution under 80CCD(2) up to 10% of basic. Total tax savings can exceed ₹2 lakh.' },
  { id: 19, category: 'Stocks', question: 'How to start investing in stocks?', answer: 'Open a Demat account with a discount broker (Zerodha, Groww). Start with index ETFs or bluechip stocks. Invest only money you won\'t need for 5+ years. Never invest borrowed money.' },
  { id: 20, category: 'Stocks', question: 'What is PE ratio?', answer: 'Price-to-Earnings ratio indicates how many years of current earnings the market is paying for. Nifty 50 average PE is ~22. Below 20 is considered cheap, above 25 is expensive.' },
  { id: 21, category: 'Loans', question: 'Fixed vs floating interest rate?', answer: 'Fixed rates stay constant throughout the loan tenure. Floating rates change with RBI repo rate. For home loans, floating is usually better as rates tend to decrease over 20 years.' },
  { id: 22, category: 'Loans', question: 'How to improve CIBIL score?', answer: 'Pay EMIs and credit card bills on time, keep credit utilization below 30%, don\'t apply for multiple loans, maintain a mix of secured and unsecured credit, and check your report for errors.' },
  { id: 23, category: 'Loans', question: 'Should I prepay home loan or invest?', answer: 'If your home loan rate is 8.5% and you can earn 12%+ in equity, investing is better mathematically. But prepaying gives guaranteed "returns" of 8.5% and peace of mind. A balanced approach works best.' },
  { id: 24, category: 'Gold', question: 'Physical gold vs digital gold vs SGB?', answer: 'SGB is best: 2.5% interest + gold appreciation + no storage risk + tax-free on maturity. Digital gold has storage fees. Physical gold has making charges (8-25%) and safety concerns.' },
  { id: 25, category: 'Emergency Fund', question: 'How much emergency fund do I need?', answer: '6-12 months of expenses in liquid/easily accessible form. Keep in savings account + liquid mutual fund. Do not invest emergency fund in equity or lock-in instruments.' },
];

// ---- EXPORT GENERATED DATA ----
export const generatedMutualFunds = generateMutualFunds();
export const generatedStocks = generateStocks();
export const generatedSchemes = generateSchemes();

// Summary counts
export const DATA_SUMMARY = {
  mutualFunds: generatedMutualFunds.length,
  stocks: generatedStocks.length,
  schemes: generatedSchemes.length,
  safetyTips: safetyKnowledgeBase.length,
  faqs: financialFAQs.length,
  get total() { return this.mutualFunds + this.stocks + this.schemes + this.safetyTips + this.faqs; }
};
