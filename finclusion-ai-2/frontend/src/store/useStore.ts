import { create } from 'zustand';
import type { User, Portfolio, FinancialGoal, ChatMessage, FraudAnalysis } from '../types';

interface AppState {
  // User State
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Portfolio State
  portfolio: Portfolio | null;
  setPortfolio: (portfolio: Portfolio) => void;
  
  // Goals State
  goals: FinancialGoal[];
  setGoals: (goals: FinancialGoal[]) => void;
  addGoal: (goal: FinancialGoal) => void;
  
  // Chat State
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  chatWidgetOpen: boolean;
  setChatWidgetOpen: (open: boolean) => void;
  
  // Fraud State
  fraudHistory: { input: string; result: FraudAnalysis; date: string }[];
  addFraudCheck: (input: string, result: FraudAnalysis) => void;
  
  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
  
  portfolio: null,
  setPortfolio: (portfolio) => set({ portfolio }),
  
  goals: [],
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  
  chatMessages: [],
  addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),
  chatWidgetOpen: false,
  setChatWidgetOpen: (open) => set({ chatWidgetOpen: open }),
  
  fraudHistory: [],
  addFraudCheck: (input, result) => set((state) => ({
    fraudHistory: [{ input, result, date: new Date().toISOString() }, ...state.fraudHistory].slice(0, 20)
  })),
  
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
