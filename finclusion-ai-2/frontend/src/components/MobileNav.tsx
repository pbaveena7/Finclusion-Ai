import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, PieChart, Shield, BrainCircuit } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/' },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart, path: '/portfolio' },
    { id: 'ai', label: 'AI', icon: BrainCircuit, path: '/ai-assistant' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'safety', label: 'Safety', icon: Shield, path: '/safety' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t z-50 px-2 py-2 pb-safe"
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
    >
      <div className="flex justify-between items-center max-w-md mx-auto">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.id} 
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[60px] transition-colors ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--sidebar-item-hover)]'}`}
              style={isActive ? { background: 'var(--sidebar-item-active)' } : {}}
            >
              <item.icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
