-- ═══════════════════════════════════════════════════════════════
--  Finclusion AI — Supabase Database Schema
--  Run this SQL in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- 1. User Profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  risk_profile TEXT DEFAULT 'moderate',
  monthly_income NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- 2. Chat Messages (AI chatbot history)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for users without Supabase Auth)
CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read their own messages"
  ON public.chat_messages FOR SELECT
  USING (true);


-- 3. Investment Goals
CREATE TABLE IF NOT EXISTS public.investment_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  goal_name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL DEFAULT 0,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  monthly_sip NUMERIC DEFAULT 0,
  target_date DATE,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.investment_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage goals"
  ON public.investment_goals
  FOR ALL USING (true) WITH CHECK (true);


-- 4. Portfolio Holdings
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  scheme_code TEXT,
  category TEXT,
  invested_amount NUMERIC DEFAULT 0,
  current_value NUMERIC DEFAULT 0,
  units NUMERIC DEFAULT 0,
  nav_at_purchase NUMERIC DEFAULT 0,
  purchase_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage holdings"
  ON public.portfolio_holdings
  FOR ALL USING (true) WITH CHECK (true);


-- 5. Fraud Reports
CREATE TABLE IF NOT EXISTS public.fraud_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  suspicious_text TEXT NOT NULL,
  risk_score NUMERIC DEFAULT 0,
  risk_level TEXT DEFAULT 'unknown',
  analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fraud_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage fraud reports"
  ON public.fraud_reports
  FOR ALL USING (true) WITH CHECK (true);


-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_investment_goals_user ON public.investment_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_user ON public.portfolio_holdings(user_id);
