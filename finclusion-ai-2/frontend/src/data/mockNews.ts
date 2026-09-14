import type { NewsItem } from '../types';

export const mockNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%',
    description: 'The Reserve Bank of India maintained status quo on the repo rate for the sixth consecutive time, focusing on inflation control while supporting growth.',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    url: '#',
    sentiment: 'neutral',
    impactLevel: 'high',
    sector: 'Banking',
    companies: ['HDFCBANK', 'ICICIBANK', 'SBIN'],
    aiSummary: 'Interest rates remain stable. This is mildly positive for banking margins but implies borrowing costs for consumers and corporates won\'t decrease soon. Equities usually respond well to rate stability.'
  },
  {
    id: 'n2',
    title: 'Govt Announces ₹1 Trillion EV Subsidy Package',
    description: 'A massive push for electric vehicles with new subsidies for domestic manufacturing and charging infrastructure rollout over the next 5 years.',
    source: 'Economic Times',
    publishedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    url: '#',
    sentiment: 'positive',
    impactLevel: 'high',
    sector: 'Auto',
    companies: ['TATAMOTORS', 'M&M', 'EXIDEIND'],
    aiSummary: 'Major catalyst for EV ecosystem stocks. Auto manufacturers with strong EV pipelines and battery makers will see significant tailwinds. Traditional ICE-only companies might face pressure.'
  },
  {
    id: 'n3',
    title: 'IT Sector Faces Headwinds as US Clients Cut Discretionary Spend',
    description: 'Top Indian IT firms report slowing deal pipelines as major US and European clients tighten tech budgets amid macroeconomic uncertainties.',
    source: 'Mint',
    publishedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    url: '#',
    sentiment: 'negative',
    impactLevel: 'medium',
    sector: 'IT',
    companies: ['TCS', 'INFY', 'WIPRO'],
    aiSummary: 'Short-term negative for IT stocks. Revenue growth estimates might be downgraded. However, long-term structural demand for cloud and AI remains intact. Good accumulation opportunity if prices correct.'
  },
  {
    id: 'n4',
    title: 'Monsoon 10% Above Normal, Boosting Rural Demand Hopes',
    description: 'IMD reports excellent rainfall distribution across key agricultural states, raising expectations for a bumper Kharif crop and rural economic recovery.',
    source: 'Business Standard',
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    url: '#',
    sentiment: 'positive',
    impactLevel: 'medium',
    sector: 'FMCG',
    companies: ['HINDUNILVR', 'ITC', 'HEROMOTOCO'],
    aiSummary: 'Very positive for rural-facing sectors like FMCG, two-wheelers, and agrochemicals. Expected increase in disposable income could drive volume growth in the next two quarters.'
  }
];
