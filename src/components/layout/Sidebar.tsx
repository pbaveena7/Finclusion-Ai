import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard,
  MessageSquareText,
  TrendingUp,
  PieChart,
  Wallet,
  Target,
  Landmark,
  ShieldAlert,
  GraduationCap,
  Newspaper,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'chat', label: 'AI Assistant', icon: MessageSquareText, path: '/chat', badge: 'AI' },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp, path: '/stocks' },
  { id: 'mutual-funds', label: 'Mutual Funds', icon: PieChart, path: '/mutual-funds' },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet, path: '/portfolio' },
  { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
  { id: 'schemes', label: 'Govt Schemes', icon: Landmark, path: '/schemes' },
  { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert, path: '/fraud' },
  { id: 'learning', label: 'Learn', icon: GraduationCap, path: '/learn' },
  { id: 'news', label: 'News & Insights', icon: Newspaper, path: '/news' },
  { id: 'calculator', label: 'Loan Calculator', icon: Calculator, path: '/calculator' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-[#FFFBFE] z-40 hidden md:flex flex-col border-r border-[#E7E0EC]"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[#E7E0EC] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[#6750A4] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="text-sm font-bold text-[#1C1B1F] whitespace-nowrap">FINCLUSION AI</h1>
              <p className="text-[10px] text-[#49454F] -mt-0.5">v2.0 • AI-Powered</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-[#1C1B1F]'
                  : 'text-[#49454F] hover:text-[#1C1B1F] hover:bg-[#F3EDF7]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-[#E8DEF8] rounded-xl border border-[#6750A4]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon className={`w-5 h-5 shrink-0 relative z-10 ${isActive ? 'text-[#6750A4]' : ''}`} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && !sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[#6750A4] text-white"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-3 border-t border-[#E7E0EC] shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-[#49454F] hover:text-[#1C1B1F] hover:bg-[#F3EDF7] transition-all duration-200"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
