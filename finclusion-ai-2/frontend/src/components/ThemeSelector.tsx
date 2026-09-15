import React, { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
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
    id: 'midnight',
    name: 'Midnight Emerald',
    tagline: 'Deep Navy & Emerald',
    dotColor: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)'
  },
  {
    id: 'obsidian',
    name: 'Obsidian Cyber',
    tagline: 'OLED Black & Violet',
    dotColor: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)'
  },
  {
    id: 'aurora',
    name: 'Aurora Solar',
    tagline: 'Dark Umber & Sunset Amber',
    dotColor: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #eab308)'
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg Terminal',
    tagline: 'Wall Street Slate & Amber',
    dotColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #22c55e)'
  },
  {
    id: 'nordic',
    name: 'Nordic Sapphire',
    tagline: 'Deep Oceanic & Arctic Blue',
    dotColor: '#38bdf8',
    gradient: 'linear-gradient(135deg, #38bdf8, #6366f1)'
  },
  {
    id: 'swiss',
    name: 'Swiss Vault',
    tagline: 'Imperial Forest & Champagne Gold',
    dotColor: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #eab308)'
  },
  {
    id: 'titanium',
    name: 'Executive Titanium',
    tagline: 'Clean Light Pearl & Indigo',
    dotColor: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5, #0284c7)',
    isLight: true
  }
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
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-200"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          color: 'var(--text-main)'
        }}
        title="Switch Professional Theme"
      >
        <span
          className="w-3 h-3 rounded-full shadow-sm shrink-0"
          style={{ background: activeTheme.gradient }}
        />
        {!compact && (
          <span className="truncate max-w-[110px] hidden sm:inline">{activeTheme.name}</span>
        )}
        <Palette className="w-3.5 h-3.5 opacity-70" />
      </motion.button>

      {/* Popover / Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click-away */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 p-2 rounded-2xl border shadow-2xl z-50 backdrop-blur-2xl"
              style={{
                background: 'var(--sidebar-bg)',
                borderColor: 'var(--border-hover)',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--sidebar-border)' }}>
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  Professional Themes
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--bg-card)', color: 'var(--accent-primary)' }}>
                  {PROFESSIONAL_THEMES.length}
                </span>
              </div>

              <div className="p-1 space-y-1 max-h-80 overflow-y-auto mt-1">
                {PROFESSIONAL_THEMES.map(t => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-150 group"
                      style={{
                        background: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                        borderColor: isSelected ? 'var(--border-hover)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{
                            background: t.gradient,
                            borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'
                          }}
                        />
                        <div>
                          <p className="text-xs font-bold leading-tight" style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                            {t.name}
                          </p>
                          <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                            {t.tagline}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
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
