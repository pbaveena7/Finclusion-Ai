import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, TrendingUp, ShieldAlert, Target, Wallet, 
  PieChart, LayoutDashboard, Calculator, ArrowRight 
} from 'lucide-react';

const SHORTCUTS = [
  { id: 'dashboard', icon: LayoutDashboard, title: 'Dashboard', path: '/' },
  { id: 'portfolio', icon: PieChart, title: 'Portfolio', path: '/portfolio' },
  { id: 'stocks', icon: TrendingUp, title: 'Stocks & Markets', path: '/stocks' },
  { id: 'funds', icon: Wallet, title: 'Mutual Funds', path: '/mutual-funds' },
  { id: 'goals', icon: Target, title: 'Goal Planner', path: '/goals' },
  { id: 'safety', icon: ShieldAlert, title: 'Fraud Scanner', path: '/safety' },
  { id: 'calc', icon: Calculator, title: 'Calculators', path: '/loans' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredShortcuts.length);
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredShortcuts.length) % filteredShortcuts.length);
      }

      if (e.key === 'Enter' && filteredShortcuts.length > 0) {
        e.preventDefault();
        navigate(filteredShortcuts[selectedIndex].path);
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, navigate]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const filteredShortcuts = SHORTCUTS.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] shadow-2xl rounded-2xl overflow-hidden border"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-card)' }}
          >
            <div className="flex items-center px-4 py-4 border-b" style={{ borderColor: 'var(--border-card)' }}>
              <Search className="w-5 h-5 mr-3 text-[var(--accent-primary)]" />
              <input 
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pages, stocks, funds... (Press Esc to close)"
                className="w-full bg-transparent border-none focus:outline-none text-base placeholder-[var(--text-muted)] text-[var(--text-main)]"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-card)', color: 'var(--text-dim)' }}>
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredShortcuts.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                  No results found for "{search}"
                </div>
              ) : (
                filteredShortcuts.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isSelected ? 'bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-card-hover)]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)]'}`}>
                          {item.title}
                        </span>
                      </div>
                      {isSelected && <ArrowRight className="w-4 h-4 text-[var(--accent-primary)]" />}
                    </button>
                  )
                })
              )}
            </div>
            
            <div className="px-4 py-3 border-t flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--border-card)', background: 'var(--bg-subtle)', color: 'var(--text-dim)' }}>
              <span><kbd className="font-mono bg-[var(--bg-card)] border rounded px-1.5 py-0.5 mx-1">↑↓</kbd> to navigate</span>
              <span><kbd className="font-mono bg-[var(--bg-card)] border rounded px-1.5 py-0.5 mx-1">Enter</kbd> to select</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
