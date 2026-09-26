import { create } from 'zustand';
import type { User, Portfolio, FinancialGoal, ChatMessage, FraudAnalysis } from '../types';
import { mockUser } from '../data/mockUser';

interface AppState {
  // User State
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  
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
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  llmApiKey: string;
  setLlmApiKey: (key: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user });
  },
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },
  logout: () => {
    // Keep mock user so auth is never required
    set({ user: mockUser, token: 'dev-token' });
  },
  updateUser: (updates) => set((state) => {
    const updatedUser = state.user ? { ...state.user, ...updates } : null;
    if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),
  
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
  theme: localStorage.getItem('theme') || 'light',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  language: localStorage.getItem('language') || 'English',
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    set({ language });
  },
  llmApiKey: localStorage.getItem('llmApiKey') || '',
  setLlmApiKey: (llmApiKey) => {
    localStorage.setItem('llmApiKey', llmApiKey);
    set({ llmApiKey });
  },
}));
