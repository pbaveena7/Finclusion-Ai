import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, PieChart, BarChart2, Target, Calculator,
  Shield, Landmark, GraduationCap, Newspaper, Receipt, Palmtree,
  PiggyBank, CreditCard, Flame, User, LogOut, ChevronLeft, ChevronRight,
  Wallet, BrainCircuit, Sparkles, HelpCircle, Settings, Search
} from 'lucide-react';
import { useStore } from '../store/useStore';
import ThemeSelector from './ThemeSelector';
import SettingsModal from './SettingsModal';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ]
  },
  {
    label: 'AI',
    items: [
      { id: 'ai', label: 'AI Assistant', icon: BrainCircuit, path: '/ai-assistant' },
    ]
  },
  {
    label: 'Invest',
    items: [
      { id: 'stocks', label: 'Stocks', icon: TrendingUp, path: '/stocks' },
      { id: 'mutual-funds', label: 'Mutual Funds', icon: PieChart, path: '/mutual-funds' },
      { id: 'portfolio', label: 'Portfolio', icon: BarChart2, path: '/portfolio' },
      { id: 'options', label: 'Options', icon: Flame, path: '/options' },
    ]
  },
  {
    label: 'Plan',
    items: [
      { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
      { id: 'loans', label: 'Loan Calculator', icon: Calculator, path: '/loans' },
      { id: 'tax', label: 'Tax Planner', icon: Receipt, path: '/tax' },
      { id: 'retirement', label: 'FIRE Calculator', icon: Palmtree, path: '/retirement' },
      { id: 'fd-calculator', label: 'FD Calculator', icon: PiggyBank, path: '/fd-calculator' },
      { id: 'credit-score', label: 'Credit Score', icon: CreditCard, path: '/credit-score' },
    ]
  },
  {
    label: 'Protect',
    items: [
      { id: 'safety', label: 'Fraud Detection', icon: Shield, path: '/safety' },
    ]
  },
  {
    label: 'Discover',
    items: [
      { id: 'schemes', label: 'Govt Schemes', icon: Landmark, path: '/schemes' },
      { id: 'learning', label: 'Learn', icon: GraduationCap, path: '/learning' },
      { id: 'news', label: 'News & Insights', icon: Newspaper, path: '/news' },
    ]
  },
];

interface SidebarProps {
  activeId?: string;
}

export default function Sidebar({ activeId }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, sidebarCollapsed: collapsed, toggleSidebar } = useStore();
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentPath = location.pathname;
  const allItems = NAV_SECTIONS.flatMap(s => s.items);
  const currentId = activeId ?? (allItems.find(n => n.path === currentPath)?.id ?? 'overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const w = collapsed ? 'w-[72px]' : 'w-[260px]';

  return (
    <>
    <aside className={`hidden lg:flex ${w} border-r flex-col z-20 h-screen fixed transition-all duration-300 ease-in-out`}
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>

      {/* ── Logo ───────────────────────────────────── */}
      <div className={`shrink-0 flex items-center ${collapsed ? 'justify-center px-0' : 'px-5'} py-5 border-b`} style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent-gradient)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <span className="font-bold text-sm tracking-tight block" style={{ color: 'var(--text-main)' }}>FINCLUSION AI</span>
              <span className="text-[10px] font-medium block" style={{ color: 'var(--text-dim)' }}>v2.0 • AI-Powered</span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Nav ────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="mb-1">
            {!collapsed && (
              <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: 'var(--text-dim)' }}>
                {t(`section.${section.label.toLowerCase()}`) !== `section.${section.label.toLowerCase()}` 
                  ? t(`section.${section.label.toLowerCase()}`) 
                  : section.label}
              </p>
            )}
            {collapsed && <div className="my-2 mx-auto w-6 h-px" style={{ background: 'var(--border-card)' }} />}

            {section.items.map(nav => {
              const isActive = currentId === nav.id;
              const translatedLabel = t(`nav.${nav.id}`) !== `nav.${nav.id}` ? t(`nav.${nav.id}`) : nav.label;
              return (
                <Link key={nav.id} to={nav.path}
                  className={`flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative group
                    ${collapsed ? 'justify-center px-0 py-2.5 mx-auto w-11' : 'px-3 py-[7px]'}
                    ${isActive
                      ? ''
                      : 'hover:bg-[var(--sidebar-item-hover)]'
                    }`}
                  style={isActive ? {
                    background: 'var(--sidebar-item-active)',
                    color: 'var(--accent-primary)',
                  } : {
                    color: 'var(--text-muted)',
                  }}
                  title={collapsed ? translatedLabel : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                      style={{ height: 18, background: 'var(--accent-primary)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <nav.icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{translatedLabel}</span>}

                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none"
                      style={{ background: 'var(--bg-card)', color: 'var(--text-main)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-card)' }}>
                      {translatedLabel}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Bottom ──────────────────────────────────── */}
      <div className="shrink-0 border-t px-2 py-3 space-y-1" style={{ borderColor: 'var(--sidebar-border)' }}>
        {!collapsed && (
          <div className="px-1 pb-2 flex gap-2 justify-between">
            <ThemeSelector />
            <LanguageSwitcher />
          </div>
        )}

        {/* Settings button */}
        <button onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-1.5 mb-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--sidebar-item-hover)]"
          style={{ color: 'var(--text-main)' }}>
          {collapsed ? <Settings className="w-4 h-4" /> : <><Settings className="w-4 h-4" /> <span>Settings</span></>}
        </button>

        {/* Collapse toggle */}
        <button onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ color: 'var(--text-dim)' }}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span>Collapse</span></>}
        </button>

        {/* User */}
        <div className={`rounded-lg border flex items-center ${collapsed ? 'justify-center p-2' : 'justify-between p-2.5'}`}
          style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-card)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
              style={{ background: 'var(--accent-gradient)' }}>
              {user?.name?.[0] || 'N'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate max-w-[100px]" style={{ color: 'var(--text-main)' }}>{user?.name || 'Naveen'}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>Premium</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={handleLogout}
              className="p-1 rounded hover:bg-[var(--bg-card-hover)] transition-colors"
              style={{ color: 'var(--text-dim)' }}
              title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
