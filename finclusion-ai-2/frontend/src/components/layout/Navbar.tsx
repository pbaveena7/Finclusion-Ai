import { Bell, Search, Mic, User as UserIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const { searchQuery, setSearchQuery, user } = useStore();

  return (
    <header className="h-16 glass border-b border-x-0 border-t-0 sticky top-0 z-30 flex items-center justify-between px-6">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stocks, funds, or ask AI..."
          className="w-full bg-dark-800/50 border border-border-primary rounded-full pl-10 pr-12 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-emerald-400 hover:bg-emerald-500/10 transition-colors">
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-dark-900"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border-primary cursor-pointer hover:opacity-80 transition-opacity">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white leading-tight">{user?.name || 'Guest'}</p>
            <p className="text-xs text-emerald-400">Pro Member</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center border-2 border-dark-900 shadow-md">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
