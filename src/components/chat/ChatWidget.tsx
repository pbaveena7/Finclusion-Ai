import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, X, Send, Sparkles, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import type { ChatMessage } from '../../types';

const quickReplies = [
  'How is my portfolio doing?',
  'Suggest SIPs for me',
  'Check this message for fraud',
];

export default function ChatWidget() {
  const { chatWidgetOpen, setChatWidgetOpen, chatMessages, addChatMessage } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `w_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
      type: 'text',
    };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200));

    const aiMsg: ChatMessage = {
      id: `w_${Date.now()}_ai`,
      role: 'ai',
      content: `Great question! For a detailed analysis, I recommend using the full AI Assistant. Click "Open Full Chat" below for comprehensive help.`,
      timestamp: new Date(),
      type: 'text',
    };
    addChatMessage(aiMsg);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!chatWidgetOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatWidgetOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 z-50"
          >
            <MessageSquareText className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              {chatMessages.length > 0 ? '' : '!'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[380px] h-[520px] glass-strong rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Finclusion AI</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setChatWidgetOpen(false); navigate('/chat'); }}
                  className="px-2 py-1 text-[10px] text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-all"
                >
                  Open Full Chat
                </button>
                <button onClick={() => setChatWidgetOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Ask me anything about your finances!</p>
                  <div className="space-y-1.5 mt-4">
                    {quickReplies.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 bg-dark-700/50 border border-border-primary hover:border-border-hover transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.slice(-10).map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'ai' && (
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500/20 border border-emerald-500/20 text-white'
                      : 'bg-dark-700/50 border border-border-primary text-slate-300'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-dark-600 flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-dark-700/50 border border-border-primary rounded-xl px-3 py-2 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="px-3 py-3 border-t border-border-primary flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-dark-700/50 border border-border-primary rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
