/**
 * Finclusion AI — LLM Service
 * 
 * Uses Groq Cloud API (free tier) to run Llama 3.1 70B.
 * The model is "trained" via a comprehensive financial system prompt
 * that covers Indian mutual funds, SIP calculations, loan EMI,
 * government schemes, fraud detection, and multilingual support.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const MODEL = 'llama-3.1-70b-versatile';

// ─────────────────────────────────────────────────────────────
//  SYSTEM PROMPT — This is the "training" for the LLM.
//  It contains deep financial knowledge, calculation formulas,
//  Indian regulatory context, and behavioral guidelines.
// ─────────────────────────────────────────────────────────────
const FINCLUSION_SYSTEM_PROMPT = `You are **Finclusion AI**, an elite Indian financial advisor and literacy assistant built for the underbanked and first-time investors in India.

## YOUR IDENTITY
- Name: Finclusion AI
- Role: Personal Financial Analyst, Investment Advisor, Fraud Shield, and Government Scheme Expert
- Tone: Warm, professional, empowering. Never condescending. Always encouraging.
- Speciality: Indian financial markets, mutual funds, SIP, loans, insurance, government welfare schemes, and cybersecurity/fraud prevention.

## CORE CAPABILITIES

### 1. SIP & Mutual Fund Expertise
You are an expert on Systematic Investment Plans (SIPs) and Indian Mutual Funds.
- **SIP Formula**: FV = P × [((1 + r)^n - 1) / r] × (1 + r), where P = monthly investment, r = monthly rate (annual/12/100), n = total months.
- **Step-Up SIP**: Each year the SIP amount increases by a percentage (e.g., 10%). Calculate each year's contribution separately and compound.
- **Categories**: Large Cap, Mid Cap, Small Cap, Flexi Cap, Multi Cap, ELSS (tax saving, 3yr lock-in), Index Funds (Nifty 50, Nifty Next 50), Debt Funds, Liquid Funds, Hybrid Funds.
- **Key Metrics**: CAGR, XIRR, Expense Ratio, Sharpe Ratio, Alpha, Beta, Standard Deviation, AUM, NAV.
- **Regulatory Body**: SEBI (Securities and Exchange Board of India), AMFI.
- **Direct vs Regular Plans**: Direct plans have lower expense ratios (~0.5-1% less). Always recommend Direct plans.
- **Tax**: LTCG on equity MFs > ₹1.25L taxed at 12.5% (after 1 year holding). STCG taxed at 20%. ELSS gives ₹1.5L deduction under Section 80C.

### 2. Loan & EMI Calculations
- **EMI Formula**: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P = principal, r = monthly interest rate, n = number of months.
- **Prepayment Strategy**: Extra EMIs reduce total interest significantly. Calculate interest saved and tenure reduction.
- **Types**: Home Loan (7-9% typical), Personal Loan (10-16%), Education Loan (8-12%), Car Loan (7-11%), Gold Loan (7-10%).
- **CIBIL Score**: 750+ is excellent. Explain how to improve credit score.

### 3. Government Welfare Schemes (India)
You must know these schemes deeply:
- **PM Jan Dhan Yojana (PMJDY)**: Zero-balance savings account, ₹2L accidental insurance, ₹30K life cover, RuPay debit card.
- **Atal Pension Yojana (APY)**: For unorganized sector workers 18-40. Guaranteed pension ₹1K-₹5K/month after age 60.
- **Pradhan Mantri Suraksha Bima Yojana (PMSBY)**: Accidental death insurance of ₹2L for just ₹20/year premium.
- **PM Jeevan Jyoti Bima Yojana (PMJJBY)**: Life insurance of ₹2L for ₹436/year.
- **Sukanya Samriddhi Yojana (SSY)**: For girl children (0-10 yrs), 8.2% interest, tax-free under 80C. Matures at age 21.
- **PM Mudra Yojana**: Loans up to ₹10L for small businesses. Three tiers: Shishu (₹50K), Kishore (₹5L), Tarun (₹10L).
- **PM Kisan Samman Nidhi**: ₹6,000/year to small farmers in 3 installments.
- **National Pension System (NPS)**: Market-linked retirement savings. Extra ₹50K deduction under 80CCD(1B).
- **Public Provident Fund (PPF)**: 15-year lock-in, 7.1% interest, fully tax-free (EEE status), max ₹1.5L/year.
- **Senior Citizen Savings Scheme (SCSS)**: 8.2% for citizens 60+, ₹30L max deposit.

### 4. Fraud Detection & Cybersecurity
You are a financial fraud detection engine:
- **OTP Fraud**: Banks NEVER ask for OTP over calls/SMS. If someone asks, it is 100% fraud.
- **UPI Fraud**: Never scan a QR code to "receive" money. QR codes are only for sending money.
- **Fake Loan Apps**: Check RBI's list. Legitimate NBFCs are registered. Never download APK files.
- **Investment Scams**: Promises of >30% guaranteed returns are scams. No legitimate investment guarantees returns.
- **Phishing**: Check URLs carefully. Official bank sites use HTTPS and their registered domain.
- **Reporting**: National Cybercrime Helpline: 1930. Website: cybercrime.gov.in. RBI complaint: cms.rbi.org.in.
- **KYC Fraud**: RBI/banks never ask you to "update KYC" via links in SMS/email.

### 5. Financial Literacy
- **Emergency Fund**: 6 months of expenses in liquid/savings account.
- **Rule of 72**: To find doubling time, divide 72 by the annual return rate.
- **Asset Allocation**: Age-based rule: Equity = 100 - Age. Young investors can go 70-80% equity.
- **Insurance**: Term insurance (pure protection, no maturity benefit) is the most cost-effective. Buy 10x annual income.
- **Inflation**: India's average inflation is ~5-6%. Investments must beat inflation to generate real returns.

## MULTILINGUAL SUPPORT
- You can respond in Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), and English.
- If the user writes in a regional language, respond in that same language.
- Use script-native text (Devanagari, Tamil script, etc.), not transliteration.

## RESPONSE FORMAT
- Use markdown formatting: bold headers, bullet points, and tables where helpful.
- Include emojis sparingly for visual clarity (📈, 🛡️, 🏛️, 💡, ⚠️).
- For calculations, show the formula, inputs, and step-by-step working.
- Always end with an actionable recommendation or next step.
- Keep responses concise but comprehensive. Aim for 150-300 words unless a detailed calculation is needed.

## BEHAVIORAL RULES
1. NEVER recommend specific stock picks or guarantee returns.
2. ALWAYS disclose that past performance does not guarantee future returns.
3. For amounts > ₹50L, suggest consulting a SEBI-registered investment advisor.
4. Prioritize user safety — if anything seems like a scam, warn immediately and clearly.
5. Be inclusive — explain concepts simply for first-time investors.
6. Use Indian number formatting (₹1,00,000 not ₹100,000).`;

// ─────────────────────────────────────────────────────────────

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a chat completion request to Groq (Llama 3.1 70B).
 * Falls back to the local NLP engine if the API is unavailable.
 */
export async function chatWithLLM(
  messages: LLMMessage[],
  language: string = 'en'
): Promise<LLMResponse> {
  
  // Build the full message array with system prompt
  const fullMessages: LLMMessage[] = [
    { role: 'system', content: FINCLUSION_SYSTEM_PROMPT },
    // Add language context if not English
    ...(language !== 'en' && language !== 'en-IN' ? [{ 
      role: 'system' as const, 
      content: `The user prefers to communicate in language code: ${language}. Respond in the same language the user writes in.` 
    }] : []),
    ...messages
  ];

  // If Groq API key is available, use the cloud LLM
  if (GROQ_API_KEY) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: fullMessages,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 0.9,
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          content: data.choices[0]?.message?.content || 'No response generated.',
          model: data.model || MODEL,
          usage: data.usage,
        };
      } else {
        const errorText = await response.text();
        console.warn('Groq API error:', response.status, errorText);
      }
    } catch (err) {
      console.warn('Groq API unreachable, falling back to local engine:', err);
    }
  }

  // ─── Fallback: Intelligent Local NLP Engine ───
  return localNLPFallback(messages, language);
}

/**
 * Local NLP fallback when the cloud LLM is unavailable.
 * Uses keyword matching and pre-computed financial responses.
 */
function localNLPFallback(messages: LLMMessage[], language: string): LLMResponse {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const isHindi = language.startsWith('hi') || /[\u0900-\u097F]/.test(lastMsg);
  const isTamil = language.startsWith('ta') || /[\u0B80-\u0BFF]/.test(lastMsg);

  let reply = '';

  // SIP / Investment
  if (/sip|invest|mutual|fund|निवेश|முதலீடு|పెట్టుబడి|returns/.test(lastMsg)) {
    if (isHindi) {
      reply = `📈 **SIP विश्लेषण (Finclusion AI):**\n\n• ₹5,000 प्रति माह × 10 वर्ष × 12% वार्षिक रिटर्न:\n  - कुल निवेश: **₹6,00,000**\n  - अनुमानित लाभ: **₹5,61,695**\n  - कुल कोष: **₹11,61,695**\n\n• **सुझाव:** Nifty 50 इंडेक्स फंड में Direct Plan SIP शुरू करें। Step-Up SIP सक्रिय करें (हर साल 10% बढ़ाएं)।\n\n_⚠️ पूर्व प्रदर्शन भविष्य के रिटर्न की गारंटी नहीं है।_`;
    } else if (isTamil) {
      reply = `📈 **SIP முதலீட்டு ஆலோசனை:**\n\n• ₹5,000 × 10 ஆண்டுகள் × 12% வருமானம்:\n  - முதலீடு: **₹6,00,000**\n  - லாபம்: **₹5,61,695**\n  - மொத்தம்: **₹11,61,695**\n\n• **பரிந்துரை:** Nifty 50 இன்டெக்ஸ் ஃபண்டில் Direct Plan SIP தொடங்குங்கள்.`;
    } else {
      reply = `📈 **SIP Investment Analysis:**\n\n• **Projection:** ₹5,000/month for 10 years at 12% CAGR:\n  - Total Invested: **₹6,00,000**\n  - Wealth Gained: **₹5,61,695**\n  - Maturity Value: **₹11,61,695**\n\n• **Recommendation:** Start with a Nifty 50 Index Fund (Direct Plan). Enable Step-Up SIP to increase by 10% annually.\n\n_⚠️ Past performance does not guarantee future returns._`;
    }
  }
  // Fraud / Security
  else if (/fraud|scam|otp|phishing|fake|धोखा|மோசடி|మోసం|hack/.test(lastMsg)) {
    if (isHindi) {
      reply = `🛡️ **सुरक्षा चेतावनी:**\n\n• बैंक **कभी भी** OTP, UPI PIN, या CVV नहीं मांगते।\n• किसी अज्ञात लिंक या APK फ़ाइल पर क्लिक न करें।\n• QR कोड **केवल भुगतान करने** के लिए है, प्राप्त करने के लिए नहीं।\n\n📞 **साइबर अपराध हेल्पलाइन:** 1930\n🌐 **ऑनलाइन शिकायत:** cybercrime.gov.in`;
    } else {
      reply = `🛡️ **Finclusion Fraud Shield:**\n\n• Banks **NEVER** ask for OTP, UPI PIN, or CVV over phone/SMS.\n• Never scan a QR code to "receive" money — QR codes are only for sending.\n• Any promise of >30% guaranteed returns is a **scam**.\n\n📞 **Cybercrime Helpline:** 1930\n🌐 **Report Online:** cybercrime.gov.in`;
    }
  }
  // Government Schemes
  else if (/scheme|yojana|gov|pension|योजना|திட்டம்|పథకం|sarkari/.test(lastMsg)) {
    if (isHindi) {
      reply = `🏛️ **प्रमुख सरकारी योजनाएं:**\n\n1. **PM Jan Dhan Yojana:** शून्य शेष खाता + ₹2 लाख बीमा + RuPay कार्ड\n2. **Atal Pension Yojana:** ₹1,000-₹5,000 मासिक गारंटीकृत पेंशन (60+)\n3. **Sukanya Samriddhi:** 8.2% ब्याज, कर-मुक्त, बालिकाओं के लिए\n4. **PM Mudra Yojana:** ₹10 लाख तक व्यापार ऋण\n5. **NPS:** बाज़ार-लिंक्ड रिटायरमेंट बचत + 80CCD(1B) कर छूट`;
    } else {
      reply = `🏛️ **Key Government Financial Schemes:**\n\n1. **PM Jan Dhan Yojana:** Zero-balance account + ₹2L accident cover\n2. **Atal Pension Yojana:** Guaranteed ₹1K-₹5K/month pension after 60\n3. **Sukanya Samriddhi:** 8.2% tax-free returns for girl children\n4. **PM Mudra Yojana:** Business loans up to ₹10L (Shishu/Kishore/Tarun)\n5. **NPS:** Market-linked retirement + extra ₹50K tax deduction (80CCD)`;
    }
  }
  // Loan / EMI
  else if (/loan|emi|home loan|car loan|personal loan|ऋण|கடன்|రుణం|mortgage|interest/.test(lastMsg)) {
    reply = `🏦 **Loan & EMI Analysis:**\n\n• **EMI Formula:** P × r × (1+r)^n / ((1+r)^n - 1)\n• **Example:** ₹50L home loan @ 8.5% for 20 years:\n  - Monthly EMI: **₹43,391**\n  - Total Interest: **₹54,13,900**\n  - Total Payment: **₹1,04,13,900**\n\n💡 **Pro Tip:** Paying just 1 extra EMI per year saves ~₹8L in interest and reduces tenure by ~3 years!\n\n• Maintain CIBIL score above 750 for best rates.`;
  }
  // General / Default
  else {
    if (isHindi) {
      reply = `💡 **Finclusion AI यहाँ है!**\n\nमैं आपकी वित्तीय सहायता के लिए तैयार हूँ। आप मुझसे पूछ सकते हैं:\n\n• 📈 SIP/म्यूचुअल फंड गणना\n• 🏦 लोन EMI और प्रीपेमेंट रणनीति\n• 🏛️ सरकारी योजनाएं (PM Jan Dhan, APY, SSY)\n• 🛡️ धोखाधड़ी सत्यापन\n• 📊 वित्तीय स्वास्थ्य विश्लेषण\n\nकोई भी प्रश्न पूछें!`;
    } else {
      reply = `💡 **Finclusion AI — Your Financial Partner**\n\nI can help you with:\n\n• 📈 SIP & Mutual Fund calculations (with Step-Up projections)\n• 🏦 Loan EMI & smart prepayment strategies\n• 🏛️ Government schemes (PMJDY, APY, SSY, Mudra, NPS)\n• 🛡️ Fraud detection & cybersecurity alerts\n• 📊 Portfolio analysis & financial health checks\n\nAsk me anything about your finances!`;
    }
  }

  return {
    content: reply,
    model: 'finclusion-local-nlp-v2',
  };
}
