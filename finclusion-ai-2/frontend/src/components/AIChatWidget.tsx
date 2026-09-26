import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Sparkles, Bot, User,
  Loader2, Trash2, Minimize2, Maximize2, Volume2, VolumeX,
  Globe2, ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithLLM, type LLMMessage } from '../lib/llm';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const LANGUAGES = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'te-IN', label: 'తెలుగు' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ' },
  { code: 'mr-IN', label: 'मराठी' },
];

const QUICK_PROMPTS = [
  { emoji: '📈', text: 'Calculate SIP of ₹10,000/mo for 15 years' },
  { emoji: '🏦', text: 'Home loan EMI for ₹50L at 8.5%' },
  { emoji: '🏛️', text: 'Best government savings schemes' },
  { emoji: '🛡️', text: 'How to detect UPI fraud?' },
];

export default function AIChatWidget() {
  const { user, language: globalLanguage, setLanguage: setGlobalLanguage } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use global language state, but map it to the locale format expected by the AI TTS if needed
  const language = globalLanguage === 'en' ? 'en-IN' : `${globalLanguage}-IN`;

  const [showLangPicker, setShowLangPicker] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`session_${Date.now()}`);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Save message to Supabase (if connected)
  const saveToSupabase = useCallback(async (msg: ChatMsg) => {
    try {
      if (!supabase || !user) return;
      await supabase.from('chat_messages').insert({
        user_id: user.id || 'anonymous',
        role: msg.role,
        content: msg.content,
        session_id: sessionId.current,
      });
    } catch (e) {
      // Silently fail — Supabase is optional
    }
  }, [user]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || isLoading) return;

    const userMsg: ChatMsg = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    saveToSupabase(userMsg);

    // Build LLM message history (last 10 messages for context)
    const historyForLLM: LLMMessage[] = [...messages.slice(-10), userMsg].map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.content,
    }));

    try {
      const response = await chatWithLLM(historyForLLM, language);

      const aiMsg: ChatMsg = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
      saveToSupabase(aiMsg);

      // Text-to-speech (if not muted)
      if (!isMuted && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.content.replace(/[*#_]/g, '').slice(0, 500));
        utterance.lang = language;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      const errorMsg: ChatMsg = {
        id: `msg_${Date.now()}_err`,
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionId.current = `session_${Date.now()}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button pulse animation
  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ─── Floating Trigger Button ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/20 group overflow-hidden"
            style={{ background: 'var(--accent-gradient)' }}
          >
            {/* Ping animation */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: 'var(--accent-primary)' }} />
            <MessageSquare className="w-6 h-6 text-white relative z-10" />
            
            {/* Notification dot */}
            {!hasMessages && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-[var(--bg-base)] flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">AI</span>
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Chat Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`fixed z-[9999] flex flex-col overflow-hidden border backdrop-blur-2xl shadow-2xl ${
              isMaximized
                ? 'inset-4 rounded-3xl'
                : 'bottom-6 right-6 w-[420px] h-[620px] rounded-2xl'
            }`}
            style={{ 
              background: 'var(--bg-card)', 
              borderColor: 'var(--border-card)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 40px var(--accent-glow-subtle)'
            }}
          >
            {/* ─── Header ─── */}
            <div className="px-4 py-3 flex items-center justify-between border-b shrink-0" style={{ borderColor: 'var(--border-card)', background: 'var(--sidebar-bg)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: 'var(--accent-gradient)' }}>
                  <Bot className="w-5 h-5 text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: '#10b981', borderColor: 'var(--sidebar-bg)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--text-main)] leading-tight">Finclusion AI</h3>
                  <p className="text-[10px] font-medium flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                    <Sparkles className="w-3 h-3" /> Llama 3.1 70B • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Language Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangPicker(!showLangPicker)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]"
                  >
                    <Globe2 className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                  {showLangPicker && (
                    <div className="absolute right-0 top-10 w-36 rounded-xl border overflow-hidden shadow-xl z-50" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      {LANGUAGES.map(lang => {
                        const globalCode = lang.code.replace('-IN', '');
                        return (
                        <button
                          key={lang.code}
                          onClick={() => { setGlobalLanguage(globalCode); setShowLangPicker(false); }}
                          className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors flex items-center justify-between ${globalLanguage === globalCode ? 'bg-[var(--accent-glow-subtle)]' : 'hover:bg-[var(--bg-card-hover)]'}`}
                          style={{ color: globalLanguage === globalCode ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                        >
                          {lang.label}
                          {globalLanguage === globalCode && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-primary)' }} />}
                        </button>
                      )})}
                    </div>
                  )}
                </div>

                <button onClick={() => setIsMuted(!isMuted)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]">
                  {isMuted ? <VolumeX className="w-4 h-4 text-[var(--text-muted)]" /> : <Volume2 className="w-4 h-4 text-[var(--text-muted)]" />}
                </button>
                <button onClick={clearChat} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]">
                  <Trash2 className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
                <button onClick={() => setIsMaximized(!isMaximized)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]">
                  {isMaximized ? <Minimize2 className="w-4 h-4 text-[var(--text-muted)]" /> : <Maximize2 className="w-4 h-4 text-[var(--text-muted)]" />}
                </button>
                <button onClick={() => { setIsOpen(false); window.speechSynthesis?.cancel(); }} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-rose-500/20">
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            {/* ─── Messages ─── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative" style={{ background: 'var(--accent-gradient)' }}>
                    <Sparkles className="w-8 h-8 text-white" />
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/10 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-black text-[var(--text-main)] mb-1">Hi! I'm Finclusion AI</h4>
                  <p className="text-xs text-[var(--text-muted)] mb-6 max-w-[260px]">
                    Your personal AI financial advisor. Powered by Llama 3.1 70B with deep Indian finance expertise.
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(prompt.text)}
                        className="p-3 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-lg group"
                        style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}
                      >
                        <span className="text-lg mb-1 block">{prompt.emoji}</span>
                        <span className="text-[11px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text-main)] leading-tight block">{prompt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ background: 'var(--accent-gradient)' }}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-md text-white'
                        : 'rounded-bl-md border'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'var(--accent-gradient)' }
                        : { background: 'var(--input-bg)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }
                    }
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_strong]:text-[var(--accent-primary)] [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 [&_a]:text-[var(--accent-primary)]">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                    <p className="text-[9px] mt-2 opacity-50 text-right">
                      {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                      <User className="w-4 h-4 text-[var(--text-main)]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent-gradient)' }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md border flex items-center gap-2" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Finclusion AI is thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ─── Input Bar ─── */}
            <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border-card)' }}>
              <div className="flex items-center gap-2 rounded-xl border px-3 py-2 transition-all focus-within:border-[var(--accent-primary)] focus-within:shadow-[0_0_15px_var(--accent-glow-subtle)]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about SIP, loans, schemes..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-dim)] text-[var(--text-main)]"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105"
                  style={{ background: input.trim() ? 'var(--accent-gradient)' : 'transparent' }}
                >
                  <Send className={`w-4 h-4 ${input.trim() ? 'text-white' : 'text-[var(--text-dim)]'}`} />
                </button>
              </div>
              <p className="text-[9px] text-center mt-2 font-medium" style={{ color: 'var(--text-dim)' }}>
                Powered by Llama 3.1 70B via Groq • Supabase Backend
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
