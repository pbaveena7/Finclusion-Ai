import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, LineChart, PieChart, Wallet, Landmark,
  FileText, Shield, Headphones, HelpCircle, Newspaper,
  Calculator, ShieldCheck, BrainCircuit, LogOut, Sparkles,
  GraduationCap, BarChart2, User, TrendingUp
} from 'lucide-react';
import { useStore } from '../store/useStore';
import ThemeSelector from './ThemeSelector';

const SIDEBAR_NAV = [
  { id: 'overview',      label: 'Dashboard',         icon: LayoutDashboard, path: '/' },
  { id: 'stocks',        label: 'Stocks',             icon: TrendingUp,      path: '/stocks' },
  { id: 'mutual-funds',  label: 'Mutual Funds',       icon: PieChart,        path: '/mutual-funds' },
  { id: 'portfolio',     label: 'Portfolio',          icon: BarChart2,       path: '/portfolio' },
  { id: 'goals',         label: 'Goal Planner',       icon: Wallet,          path: '/goals' },
  { id: 'loans',         label: 'Loans & SIP',        icon: Calculator,      path: '/loans' },
  { id: 'schemes',       label: 'Govt Schemes',       icon: Landmark,        path: '/schemes' },
  { id: 'safety',        label: 'Safety & Fraud',     icon: Shield,          path: '/safety' },
  { id: 'learning',      label: 'Learning Hub',       icon: GraduationCap,   path: '/learning' },
  { id: 'news',          label: 'Market News',        icon: Newspaper,       path: '/news' },
  { id: 'profile',       label: 'My Profile',         icon: User,            path: '/profile' },
];

const QUICK_ACTIONS = [
  {
    id: 'sip',
    label: 'SIP Calc',
    icon: Calculator,
    path: '/loans',
    gradient: 'from-emerald-500 to-cyan-500',
    glow: 'shadow-[0_4px_20px_rgba(16,185,129,0.3)]',
  },
  {
    id: 'fraud',
    label: 'Fraud Check',
    icon: ShieldCheck,
    path: '/safety',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'shadow-[0_4px_20px_rgba(244,63,94,0.3)]',
  },
  {
    id: 'schemes',
    label: 'Schemes',
    icon: Landmark,
    path: '/schemes',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-[0_4px_20px_rgba(245,158,11,0.3)]',
  },
  {
    id: 'ai',
    label: 'Ask AI',
    icon: BrainCircuit,
    path: '/ai-assistant',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'shadow-[0_4px_20px_rgba(139,92,246,0.3)]',
  },
];

interface SidebarProps {
  activeId?: string;
}

export default function Sidebar({ activeId }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();

  // Match current path to a nav item
  const currentId = activeId ?? (
    SIDEBAR_NAV.find(n => n.path === location.pathname)?.id ??
    (location.pathname === '/' ? 'overview' : 'overview')
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r flex flex-col z-20 h-screen fixed backdrop-blur-xl" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
      
      {/* Subtle glow accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--accent-gradient)', opacity: 0.4 }} />
      
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 shrink-0">
        <motion.div 
          whileHover={{ rotate: 12, scale: 1.1 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow relative overflow-hidden"
          style={{ background: 'var(--accent-gradient)' }}
        >
          <Sparkles className="w-5 h-5 text-white relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
        <div className="leading-tight">
          <span className="font-extrabold text-sm tracking-wider uppercase block" style={{ color: 'var(--text-main)' }}>Finclusion</span>
          <span className="font-medium text-[10px] tracking-widest uppercase block gradient-text">AI 2.0</span>
        </div>
      </div>

      {/* Main Nav — scrollable */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto no-scrollbar">
        {SIDEBAR_NAV.map(nav => {
          const isActive = currentId === nav.id;
          return (
            <motion.div key={nav.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={nav.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 relative group ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-[var(--bg-card)]'
                }`}
                style={isActive ? {} : { color: 'var(--text-muted)' }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl shadow-glow-sm"
                    style={{ background: 'var(--accent-gradient)', opacity: 0.9 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Active glow bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                    style={{ background: 'var(--accent-primary)', boxShadow: `0 0 12px var(--glow-color)` }}
                  />
                )}
                <nav.icon className={`w-4 h-4 shrink-0 relative z-10 transition-colors ${isActive ? 'text-white' : 'group-hover:text-[var(--text-main)]'}`} />
                <span className="relative z-10">{nav.label}</span>
              </Link>
            </motion.div>
          );
        })}

        {/* Quick Actions */}
        <div className="pt-4 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest px-4 mb-3" style={{ color: 'var(--text-dim)' }}>
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2 px-1">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={action.path}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 group hover:border-transparent"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} ${action.glow} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight transition-colors" style={{ color: 'var(--text-muted)' }}>
                    {action.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-1 border-t shrink-0" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link
          to="/support"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-[var(--bg-card)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <Headphones className="w-4 h-4" /> Support
        </Link>
        <Link
          to="/help"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-[var(--bg-card)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <HelpCircle className="w-4 h-4" /> Help Center
        </Link>

        {/* Professional Theme Switcher */}
        <div className="pt-2 pb-1">
          <ThemeSelector />
        </div>

        {/* User card */}
        <div className="mt-2 p-2.5 rounded-xl border flex items-center justify-between" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shrink-0" style={{ background: 'var(--accent-gradient)' }}>
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate max-w-[90px]" style={{ color: 'var(--text-main)' }}>{user?.name || 'User'}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Premium ✦</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
            style={{ color: 'var(--text-muted)' }}
            title="Sign out / Switch account"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
