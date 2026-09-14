import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { mockUser } from './data/mockUser';
import { mockPortfolio } from './data/mockPortfolio';
import { mockGoals } from './data/mockGoals';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import ChatWidget from './components/chat/ChatWidget';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import Stocks from './pages/Stocks';
import MutualFunds from './pages/MutualFunds';
import Portfolio from './pages/Portfolio';
import Goals from './pages/Goals';
import GovtSchemes from './pages/GovtSchemes';
import FraudDetection from './pages/FraudDetection';
import Learning from './pages/Learning';
import News from './pages/News';
import LoanCalculator from './pages/LoanCalculator';
import Onboarding from './pages/Onboarding';

export default function App() {
  const { user, setUser, setPortfolio, setGoals, sidebarCollapsed } = useStore();

  // Initialize mock data on mount
  useEffect(() => {
    setUser(mockUser);
    setPortfolio(mockPortfolio);
    setGoals(mockGoals);
  }, [setUser, setPortfolio, setGoals]);

  // Show onboarding for new users
  if (user && !user.isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="flex min-h-screen bg-dark-900 bg-mesh">
      <Sidebar />
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
      >
        <TopBar />
        <div className="min-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/mutual-funds" element={<MutualFunds />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/schemes" element={<GovtSchemes />} />
              <Route path="/fraud" element={<FraudDetection />} />
              <Route path="/learn" element={<Learning />} />
              <Route path="/news" element={<News />} />
              <Route path="/calculator" element={<LoanCalculator />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
