import React, { useState } from 'react';
import { Palette, Check, Sparkles, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export interface ThemeOption {
  id: string;
  name: string;
  tagline: string;
  dotColor: string;
  gradient: string;
  isLight?: boolean;
}

export const PROFESSIONAL_THEMES: ThemeOption[] = [
  {
    id: 'light',
    name: 'Premium Light',
    tagline: 'Clean & Professional',
    dotColor: '#4F46E5',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    isLight: true
  },
  {
    id: 'dark',
    name: 'Midnight Pro',
    tagline: 'Deep Navy & Indigo',
    dotColor: '#818CF8',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)'
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    tagline: 'OLED Black & Violet',
    dotColor: '#A855F7',
    gradient: 'linear-gradient(135deg, #A855F7, #EC4899)'
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    tagline: 'Terminal Amber & Green',
    dotColor: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #22C55E)'
  },
  {
    id: 'nordic',
    name: 'Nordic Sapphire',
    tagline: 'Deep Ocean & Arctic Blue',
    dotColor: '#38BDF8',
    gradient: 'linear-gradient(135deg, #38BDF8, #6366F1)'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    tagline: 'Warm Sunset Amber',
    dotColor: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316, #EAB308)'
  },
  {
    id: 'emerald',
    name: 'Emerald Vault',
    tagline: 'Forest Green & Gold',
    dotColor: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #EAB308)'
  },
  {
    id: 'rose',
    name: 'Rose',
    tagline: 'Elegant Rose & Pink',
    dotColor: '#F43F5E',
    gradient: 'linear-gradient(135deg, #F43F5E, #EC4899)'
  },
];

interface ThemeSelectorProps {
  compact?: boolean;
}

export default function ThemeSelector({ compact = false }: ThemeSelectorProps) {
  const { theme, setTheme } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeTheme = PROFESSIONAL_THEMES.find(t => t.id === theme) || PROFESSIONAL_THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:bg-[var(--bg-subtle)]"
        style={{ color: 'var(--text-muted)' }}
        title="Switch Theme"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 border"
          style={{ background: activeTheme.gradient, borderColor: 'var(--border-card)' }}
        />
        {!compact && (
          <span className="hidden sm:inline truncate max-w-[100px]">{activeTheme.name}</span>
        )}
        <Palette className="w-3.5 h-3.5 opacity-60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-2 w-64 p-1.5 rounded-xl border shadow-xl z-50"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-card)',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-card)' }}>
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
                  Themes
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                  {PROFESSIONAL_THEMES.length}
                </span>
              </div>

              <div className="py-1 max-h-72 overflow-y-auto no-scrollbar">
                {PROFESSIONAL_THEMES.map(t => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-100 group"
                      style={{
                        background: isSelected ? 'var(--accent-light)' : 'transparent',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full shrink-0 border transition-transform group-hover:scale-110"
                          style={{
                            background: t.gradient,
                            borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-card)'
                          }}
                        />
                        <div>
                          <p className="text-xs font-semibold leading-tight" style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                            {t.name}
                          </p>
                          <p className="text-[10px] leading-tight" style={{ color: 'var(--text-dim)' }}>
                            {t.tagline}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
