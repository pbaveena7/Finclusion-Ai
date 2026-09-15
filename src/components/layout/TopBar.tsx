import { Bell, Search, Globe, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState } from 'react';

export default function TopBar() {
  const { user, searchQuery, setSearchQuery } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 glass-strong border-b border-border-primary px-6 flex items-center justify-between">
      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stocks, funds, schemes..."
          className="w-full pl-10 pr-4 py-2 bg-dark-700/50 border border-border-primary rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 border border-border-primary">
          <Globe className="w-3.5 h-3.5" />
          EN
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-dark-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 glass-strong rounded-xl border border-border-primary shadow-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Notifications</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <span className="text-sm">📈</span>
                  </div>
                  <div>
                    <p className="text-xs text-white">Reliance up 1.1% today</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                    <span className="text-sm">💡</span>
                  </div>
                  <div>
                    <p className="text-xs text-white">AI Insight: Increase ELSS allocation by ₹7,325/month</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div>
                    <p className="text-xs text-white">Emergency Fund: 78% complete!</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-border-primary">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500">
              Score: {user?.financialHealthScore || 0}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
