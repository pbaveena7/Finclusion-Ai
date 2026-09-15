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

import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, theme } = useStore();
  
  return (
    <div className="flex min-h-screen bg-dark-900 bg-mesh overflow-x-hidden relative">
      {/* Material You Atmospheric Background */}
      {theme === 'material' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#E8DEF8] blur-3xl opacity-60 mix-blend-multiply" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-[100px] bg-[#F3EDF7] blur-3xl opacity-80 mix-blend-multiply" />
          <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#E7E0EC] blur-3xl opacity-40 mix-blend-multiply" />
        </div>
      )}

      <Sidebar />
      <main
        className={`flex-1 min-w-0 transition-all duration-300 relative z-10 main-content-layout ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      >
        <TopBar />
        <div className="min-h-[calc(100vh-4rem)] pb-20 relative z-10">
          {children}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}

export default function App() {
  const { user, setUser, setPortfolio, setGoals, theme } = useStore();

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initialize mock data on mount
  useEffect(() => {
    // We will leave user null initially if we want to show login, but for dev we can set it.
    // If you want to force login page, comment out setUser(mockUser).
    // setUser(mockUser);
    setPortfolio(mockPortfolio);
    setGoals(mockGoals);
  }, [setUser, setPortfolio, setGoals]);

  // Show onboarding for new users
  if (user && !user.isOnboarded) {
    return <Onboarding />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <ProtectedLayout>
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
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </ProtectedLayout>
            )
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
