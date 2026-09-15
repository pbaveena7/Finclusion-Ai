import React from 'react';
import { 
  TrendingUp, ShieldCheck, Target, User
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const user = useStore(state => state.user);

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full font-sans">
      <Sidebar activeId="settings" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        <header className="px-8 py-5 border-b backdrop-blur-md sticky top-0 z-30 flex justify-end" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <button 
            className="px-5 py-2 text-white text-xs font-bold rounded-full transition-all shadow-glow hover:brightness-110"
            style={{ background: 'var(--accent-gradient)' }}
          >
            Edit Profile
          </button>
        </header>

        <div className="p-8 max-w-[1000px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-1 tracking-tight text-[var(--text-main)]">My Profile</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your account and investor settings</p>
          </div>

          <div className="glass-card-lg p-8 flex items-center gap-8 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" style={{ background: 'var(--accent-primary)' }} />
            
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center border relative z-10" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
              <User className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>{user?.name || 'Investor Name'}</h2>
              <p className="font-medium mb-4" style={{ color: 'var(--text-muted)' }}>{user?.email || 'investor@example.com'}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border shadow-sm" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.2)' }}>
                  Premium Member
                </span>
                <span className="px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border shadow-sm" style={{ background: 'var(--accent-glow-subtle)', color: 'var(--accent-primary)', borderColor: 'var(--border-card)' }}>
                  KYC Verified
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, label: 'Risk Profile', val: 'Balanced', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
              { icon: ShieldCheck, label: 'Safety Score', val: '98/100', color: 'var(--accent-primary)', bg: 'var(--accent-glow-subtle)' },
              { icon: Target, label: 'Goals Set', val: '4 Active', color: 'var(--accent-secondary)', bg: 'rgba(56,189,248,0.1)' }
            ].map(s => (
              <div key={s.label} className="glass-card p-6 flex items-center gap-4 transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: s.bg, borderColor: 'var(--border-card)' }}>
                  <s.icon className="w-6 h-6" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>{s.label}</p>
                  <p className="text-xl font-extrabold text-[var(--text-main)]">{s.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
