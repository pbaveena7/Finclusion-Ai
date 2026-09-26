import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LANGUAGES } from '../hooks/useTranslation';

// Map our language codes to Google Translate's language codes
const GOOGLE_LANG_MAP: Record<string, string> = {
  en: 'en',
  ta: 'ta',
  hi: 'hi',
  te: 'te',
  ml: 'ml',
  kn: 'kn',
  bn: 'bn',
  mr: 'mr',
};

/**
 * Programmatically trigger Google Translate to switch the page language.
 * Google Translate injects a <select> element inside the hidden widget div.
 * We set its value and dispatch a 'change' event to trigger the translation.
 */
function triggerGoogleTranslate(langCode: string) {
  // No-op: Google Translate removed. Language is handled via internal i18n.
  // Keeping this function signature so call sites don't break.
  return;
}

export default function LanguageSwitcher() {
  const language = useStore(state => state.language);
  const setLanguage = useStore(state => state.setLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
    triggerGoogleTranslate(code);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        className="flex items-center gap-2 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors border border-transparent hover:border-[var(--border-card)]"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium hidden lg:block">{activeLang.name}</span>
        <ChevronDown className={`w-4 h-4 hidden lg:block transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-xl overflow-hidden z-50 origin-top-right glass-blur"
          style={{ animation: 'scaleIn 0.15s ease-out' }}
        >
          <div className="py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors
                  ${language === lang.code
                    ? 'bg-[var(--accent-light)] text-[var(--accent-primary)] font-semibold'
                    : 'text-[var(--text-body)] hover:bg-[var(--bg-subtle)]'
                  }
                `}
              >
                <span>{lang.name}</span>
                {language === lang.code && <Check className="w-4 h-4 shrink-0" />}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-[var(--border-card)]">
            <p className="text-[10px] text-[var(--text-dim)] flex items-center gap-1">
              <Globe className="w-3 h-3" /> Powered by Google Translate
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
