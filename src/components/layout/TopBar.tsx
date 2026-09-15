import { Bell, Search, Globe, User, Palette } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState } from 'react';

export default function TopBar() {
  const { user, searchQuery, setSearchQuery, theme, setTheme } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFBFE] border-b border-[#E7E0EC] flex items-center justify-between px-6 lg:px-12 gap-4">
      {/* Search */}
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stocks, funds, schemes..."
          className="w-full h-10 pl-9 pr-4 bg-[#F3EDF7] border border-[#E7E0EC] rounded-[16px] text-sm text-[#1C1B1F] placeholder-[#49454F] focus:outline-none focus:border-[#6750A4] focus:bg-[#E8DEF8] transition-all"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Language Selector */}
        <button className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-[#49454F] hover:text-[#1C1B1F] hover:bg-[#F3EDF7] transition-all duration-200 border border-[#E7E0EC] whitespace-nowrap">
          <Globe className="w-4 h-4" />
          EN
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#49454F] hover:text-[#1C1B1F] hover:bg-[#F3EDF7] transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-dark-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-[#FFFBFE] rounded-[24px] border border-[#E7E0EC] shadow-md p-4">
              <h3 className="text-sm font-semibold text-[#1C1B1F] mb-3">Notifications</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-2 rounded-xl hover:bg-[#F3EDF7] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="text-sm">📈</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1C1B1F]">Reliance up 1.1% today</p>
                    <p className="text-[10px] text-[#49454F] mt-0.5">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-xl hover:bg-[#F3EDF7] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#E8DEF8] flex items-center justify-center shrink-0">
                    <span className="text-sm">💡</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1C1B1F]">AI Insight: Increase ELSS allocation by ₹7,325/month</p>
                    <p className="text-[10px] text-[#49454F] mt-0.5">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-xl hover:bg-[#F3EDF7] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1C1B1F]">Emergency Fund: 78% complete!</p>
                    <p className="text-[10px] text-[#49454F] mt-0.5">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E7E0EC]">
          <div className="w-8 h-8 rounded-full bg-[#6750A4] flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-[#1C1B1F] leading-none">{user?.name || 'User'}</p>
            <p className="text-[11px] font-medium text-[#49454F] mt-0.5">
              Score: {user?.financialHealthScore || 0}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
