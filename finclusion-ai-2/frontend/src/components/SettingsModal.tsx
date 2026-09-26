import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Key, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';
import ThemeSelector from './ThemeSelector';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' },
  { name: 'Bengali', code: 'bn' },
  { name: 'Marathi', code: 'mr' },
  { name: 'Gujarati', code: 'gu' }
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage, llmApiKey, setLlmApiKey } = useStore();

  const handleLanguageChange = (langName: string, langCode: string) => {
    setLanguage(langName);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-card)' }}
          >
            <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: 'var(--border-card)' }}>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--accent-primary)]" />
                <h2 className="text-lg font-bold">Preferences</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[var(--bg-card-hover)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              
              {/* Language Selector */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                  Select Language (Full Page)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.name}
                      onClick={() => handleLanguageChange(lang.name, lang.code)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${language === lang.name ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'border-transparent bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)]'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* LLM API Key */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Key className="w-4 h-4 text-[var(--text-muted)]" />
                  Gemini LLM API Key (Optional)
                </label>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  Enter your Google Gemini API key to enable live, highly intelligent AI chat responses. If left blank, Finclusion AI falls back to its local NLP engine.
                </p>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={llmApiKey}
                  onChange={(e) => setLlmApiKey(e.target.value)}
                  className="fin-input w-full px-4 py-2 text-sm rounded-lg"
                />
              </div>

              {/* Theme Selector Integration */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-card)' }}>
                 <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  App Theme
                </label>
                <div className="w-full">
                  <ThemeSelector compact={false} />
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t bg-[var(--bg-subtle)] flex justify-end" style={{ borderColor: 'var(--border-card)' }}>
               <button onClick={onClose} className="btn-primary py-2 px-6">
                 Save & Close
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
