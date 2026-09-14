import { create } from 'zustand';
import type { UserProfile, PortfolioSummary, FinancialGoal, ChatMessage, FraudAnalysis } from '../types';

// ═══════════════════════════════════════════════════════════════
// FINCLUSION AI 2.0 — Central State Store
// ═══════════════════════════════════════════════════════════════

interface AppState {
  // ── User ───────────────────────────────────────────────────
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;

  // ── Portfolio ──────────────────────────────────────────────
  portfolio: PortfolioSummary | null;
  setPortfolio: (portfolio: PortfolioSummary) => void;

  // ── Goals ──────────────────────────────────────────────────
  goals: FinancialGoal[];
  setGoals: (goals: FinancialGoal[]) => void;
  addGoal: (goal: FinancialGoal) => void;
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => void;

  // ── Chat ───────────────────────────────────────────────────
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // ── Fraud ──────────────────────────────────────────────────
  fraudHistory: { input: string; result: FraudAnalysis; date: string }[];
  addFraudCheck: (input: string, result: FraudAnalysis) => void;

  // ── UI ─────────────────────────────────────────────────────
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  chatWidgetOpen: boolean;
  setChatWidgetOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // ── User ───────────────────────────────────────────────────
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  // ── Portfolio ──────────────────────────────────────────────
  portfolio: null,
  setPortfolio: (portfolio) => set({ portfolio }),

  // ── Goals ──────────────────────────────────────────────────
  goals: [],
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) =>
    set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    })),

  // ── Chat ───────────────────────────────────────────────────
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  clearChat: () => set({ chatMessages: [] }),

  // ── Fraud ──────────────────────────────────────────────────
  fraudHistory: [],
  addFraudCheck: (input, result) =>
    set((state) => ({
      fraudHistory: [
        { input, result, date: new Date().toISOString() },
        ...state.fraudHistory,
      ],
    })),

  // ── UI ─────────────────────────────────────────────────────
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  chatWidgetOpen: false,
  setChatWidgetOpen: (open) => set({ chatWidgetOpen: open }),
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
