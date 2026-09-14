import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Mic, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MutualFunds from './pages/MutualFunds';
import Stocks from './pages/Stocks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Schemes from './pages/Schemes';
import AIFinancialAssistant from './pages/AIFinancialAssistant';
import GoalPlanner from './pages/GoalPlanner';
import Loans from './pages/Loans';
import Safety from './pages/Safety';

function AppContent() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 relative">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mutual-funds" element={<MutualFunds />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/goals" element={<GoalPlanner />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/safety" element={<Safety />} />
      </Routes>

      {/* Global AI Assistant Floating Button (hidden on auth pages) */}
      {!isAuthPage && !isAssistantOpen && (
        <button 
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-105"
        >
          <Mic className="w-5 h-5 animate-pulse" />
          <span>Ask Finclusion AI</span>
        </button>
      )}

      {/* Global AI Assistant Modal */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-2xl h-full bg-[#0B0F19] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
              <h2 className="font-bold text-xl flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tight">
                <Sparkles className="w-6 h-6 mr-2 text-purple-400" /> Finclusion AI
              </h2>
              <button 
                onClick={() => setIsAssistantOpen(false)} 
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative z-10">
              <AIFinancialAssistant />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
