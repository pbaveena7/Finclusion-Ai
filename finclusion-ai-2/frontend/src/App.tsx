import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Mic, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import Learning from './pages/Learning';
import News from './pages/News';
import { useStore } from './store/useStore';

// Route Wrapper - Enforces login page visit
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useStore(state => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppContent() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen relative overflow-hidden font-sans" style={{ background: 'var(--bg-base)', color: 'var(--text-main)' }}>
      
      {/* ── Animated Mesh Background ─────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary glow orb */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full animate-mesh opacity-30 blur-[150px]"
          style={{ top: '-20%', left: '-10%', background: 'var(--accent-primary)' }}
        />
        {/* Secondary glow orb */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full animate-mesh-reverse opacity-20 blur-[120px]"
          style={{ bottom: '-20%', right: '-10%', background: 'var(--accent-secondary)' }}
        />
        {/* Tertiary subtle orb */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full animate-float-slow opacity-10 blur-[100px]"
          style={{ top: '40%', left: '30%', background: 'var(--accent-primary)' }}
        />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      </div>
      
      <div className="relative z-10 h-full">
        <Routes>
          {/* Open Sign In & Registration (No Auth Required) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Application Routes - Wrapped in ProtectedRoute */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
          <Route path="/mutual-funds" element={<ProtectedRoute><MutualFunds /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><GoalPlanner /></ProtectedRoute>} />
          <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
          <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>} />
          <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIFinancialAssistant /></ProtectedRoute>} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ── Global AI Assistant Floating Button ─── */}
        {!isAuthPage && !isAssistantOpen && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
            onClick={() => setIsAssistantOpen(true)}
            className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 px-6 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.4), 0 8px 30px rgba(0, 0, 0, 0.3)' 
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 overflow-hidden" />
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-ping" style={{ animationDuration: '3s' }} />
            <Mic className="w-5 h-5 animate-pulse relative z-10" />
            <span className="relative z-10">Ask Finclusion AI</span>
          </motion.button>
        )}

        {/* ── Global AI Assistant Slide-over ─────── */}
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex justify-end"
              style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full max-w-2xl h-full flex flex-col relative overflow-hidden border-l"
                style={{ background: 'var(--bg-base)', borderColor: 'var(--border-card)' }}
              >
                {/* Glass header glow */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'var(--accent-primary)', opacity: 0.05 }} />
                
                <div className="flex justify-between items-center p-6 border-b relative z-10" style={{ borderColor: 'var(--border-card)' }}>
                  <h2 className="font-bold text-xl flex items-center gap-2 gradient-text tracking-tight">
                    <Sparkles className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} /> Finclusion AI
                  </h2>
                  <button 
                    onClick={() => setIsAssistantOpen(false)} 
                    className="p-2 rounded-full transition-all hover:bg-[var(--bg-card)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative z-10">
                  <AIFinancialAssistant />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
