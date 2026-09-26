import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Mic, Sparkles, X, BrainCircuit, Activity, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import AIChatWidget from './components/AIChatWidget';
import CommandPalette from './components/CommandPalette';
import MobileNav from './components/MobileNav';
import AmbientBackground from './components/animations/AmbientBackground';
import PageTransition from './components/animations/PageTransition';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const MutualFunds = lazy(() => import('./pages/MutualFunds'));
const Stocks = lazy(() => import('./pages/Stocks'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Schemes = lazy(() => import('./pages/Schemes'));
const AIFinancialAssistant = lazy(() => import('./pages/AIFinancialAssistant'));
const GoalPlanner = lazy(() => import('./pages/GoalPlanner'));
const Loans = lazy(() => import('./pages/Loans'));
const Safety = lazy(() => import('./pages/Safety'));
const Profile = lazy(() => import('./pages/Profile'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Learning = lazy(() => import('./pages/Learning'));
const News = lazy(() => import('./pages/News'));
const TaxPlanner = lazy(() => import('./pages/TaxPlanner'));
const Retirement = lazy(() => import('./pages/Retirement'));
const FDCalculator = lazy(() => import('./pages/FDCalculator'));
const CreditScore = lazy(() => import('./pages/CreditScore'));
const OptionsTrading = lazy(() => import('./pages/OptionsTrading'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-base)]">
    <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
  </div>
);

import { ErrorBoundary } from './components/ErrorBoundary';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Authentication bypass: permanently load the app without login
  return <>{children}</>;
}

function AIModelWrapper({ children }: { children: React.ReactNode }) {
  const [aiMode, setAiMode] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setAiMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Ambient floating orb background */}
      <AmbientBackground />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
              <Route path="/" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
              <Route path="/stocks" element={<ProtectedRoute><PageTransition><Stocks /></PageTransition></ProtectedRoute>} />
              <Route path="/mutual-funds" element={<ProtectedRoute><PageTransition><MutualFunds /></PageTransition></ProtectedRoute>} />
              <Route path="/portfolio" element={<ProtectedRoute><PageTransition><Portfolio /></PageTransition></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><PageTransition><GoalPlanner /></PageTransition></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><PageTransition><Loans /></PageTransition></ProtectedRoute>} />
              <Route path="/schemes" element={<ProtectedRoute><PageTransition><Schemes /></PageTransition></ProtectedRoute>} />
              <Route path="/safety" element={<ProtectedRoute><PageTransition><Safety /></PageTransition></ProtectedRoute>} />
              <Route path="/learning" element={<ProtectedRoute><PageTransition><Learning /></PageTransition></ProtectedRoute>} />
              <Route path="/news" element={<ProtectedRoute><PageTransition><News /></PageTransition></ProtectedRoute>} />
              <Route path="/tax" element={<ProtectedRoute><PageTransition><TaxPlanner /></PageTransition></ProtectedRoute>} />
              <Route path="/retirement" element={<ProtectedRoute><PageTransition><Retirement /></PageTransition></ProtectedRoute>} />
              <Route path="/fd-calculator" element={<ProtectedRoute><PageTransition><FDCalculator /></PageTransition></ProtectedRoute>} />
              <Route path="/credit-score" element={<ProtectedRoute><PageTransition><CreditScore /></PageTransition></ProtectedRoute>} />
              <Route path="/options" element={<ProtectedRoute><PageTransition><OptionsTrading /></PageTransition></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute><PageTransition><AIFinancialAssistant /></PageTransition></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>

        {/* AI Full-Screen Modal */}
        <AnimatePresence>
          {aiMode && !isAuthPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <button onClick={() => setAiMode(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl border"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-card)' }}
              >
                <AIFinancialAssistant />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating AI Chatbot Widget */}
        {!isAuthPage && <AIChatWidget />}

        {/* Global Command Palette */}
        {!isAuthPage && <CommandPalette />}

        {/* Mobile Bottom Navigation */}
        {!isAuthPage && <MobileNav />}
      </ErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AIModelWrapper />
      </ErrorBoundary>
    </Router>
  );
}
