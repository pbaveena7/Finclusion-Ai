import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  PieChart, 
  Target, 
  ShieldAlert,
  Landmark,
  GraduationCap,
  Calculator,
  MessageSquareText,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/stocks', icon: TrendingUp, label: 'Stocks' },
  { path: '/mutual-funds', icon: PieChart, label: 'Mutual Funds' },
  { path: '/portfolio', icon: Target, label: 'Portfolio' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/schemes', icon: Landmark, label: 'Govt Schemes' },
  { path: '/loans', icon: Calculator, label: 'Loans & EMI' },
  { path: '/fraud', icon: ShieldAlert, label: 'Fraud Detection' },
  { path: '/learn', icon: GraduationCap, label: 'Learning Hub' },
  { path: '/chat', icon: MessageSquareText, label: 'AI Assistant' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      className="fixed left-0 top-0 h-screen glass border-r border-y-0 border-l-0 z-40 hidden md:flex flex-col"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-primary">
        {!sidebarCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold gradient-text"
          >
            Finclusion AI
          </motion.span>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
              ${isActive 
                ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }
            `}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </div>
    </motion.aside>
  );
}
