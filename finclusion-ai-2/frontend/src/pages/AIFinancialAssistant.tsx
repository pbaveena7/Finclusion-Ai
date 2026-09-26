import React, { useState, useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { Mic, MicOff, Send, Globe2, Loader2, Volume2, ShieldCheck, Square, Sparkles } from 'lucide-react';
import { sendMessage } from '../api';

const INDIAN_LANGUAGES = [
  { code: 'en-IN', name: 'English' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)' },
  { code: 'bn-IN', name: 'Bengali (বাংলা)' },
  { code: 'mr-IN', name: 'Marathi (मराठी)' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml-IN', name: 'Malayalam (മലയാളം)' },
  { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'or-IN', name: 'Odia (ଓଡ଼ିଆ)' }
];

const PROMPTS_BY_LANG: Record<string, string[]> = {
  'hi-IN': [
    "₹5,000 की SIP 10 साल में कितना बनेगी?",
    "अटल पेंशन योजना के मुख्य लाभ क्या हैं?",
    "क्या यह संदिग्ध OTP संदेश धोखाधड़ी है?",
    "कम जोखिम वाले इंडेक्स म्यूचुअल फंड कौन से हैं?"
  ],
  'ta-IN': [
    "10 ஆண்டு SIP முதலீட்டில் எவ்வளவு லாபம் கிடைக்கும்?",
    "பிரதான் மந்திரி ஜன் தன் திட்டம் பற்றி கூறுங்கள்",
    "போலி OTP செய்தியை எவ்வாறு கண்டறிவது?",
    "மியூச்சுவல் ஃபண்ட் வரி சலுகைகள் என்ன?"
  ],
  'te-IN': [
    "SIP ద్వారా 10 సంవత్సరాలలో ఎంత సంపాదించవచ్చు?",
    "ప్రభుత్వ పొదుపు పథకాల వివరాలు చెప్పండి",
    "UPI మోసాల నుండి ఎలా సురక్షితంగా ఉండాలి?",
    "మంచి మ్యూచువల్ ఫండ్స్ ఏవి?"
  ],
  'default': [
    "Calculate SIP of ₹5,000/mo for 10 years",
    "How to detect and report UPI/OTP frauds?",
    "Explain Pradhan Mantri Jan Dhan Yojana benefits",
    "What are the best diversified index funds for beginners?"
  ]
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isStreaming?: boolean;
  citations?: Array<{source: string, timestamp: string}>;
}

export default function AIFinancialAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<string>('en-IN');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, isSpeaking, transcript, interimTranscript, startListening, stopListening, speak, stopSpeaking, hasSpeechRecognition } = useSpeech(language);

  // Auto-greeting on load — runs once only
  useEffect(() => {
    if (!hasGreeted) {
      let greeting = "Hello! I'm Finclusion AI, your personal financial analyst. Tap the microphone or type a question to get started.";
      if (language === 'hi-IN') greeting = "नमस्ते! मैं Finclusion AI हूँ, आपका निजी वित्तीय विश्लेषक। शुरू करने के लिए माइक्रोफ़ोन पर टैप करें या कोई प्रश्न टाइप करें।";
      if (language === 'ta-IN') greeting = "வணக்கம்! நான் Finclusion AI, உங்கள் தனிப்பட்ட நிதி ஆய்வாளர். தொடங்க மைக்ரோஃபோனைத் தட்டவும் அல்லது கேள்வியை உள்ளிடவும்.";
      
      speak(greeting);
      setHasGreeted(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — only run once on mount

  // Handle voice transcript updates — send to Groq when speech recognition finishes
  useEffect(() => {
    if (transcript && !isListening) {
      sendMsg(transcript);
    }
  }, [transcript, isListening]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = async (textToSent?: string) => {
    const text = textToSent || input;
    if (!text.trim()) return;

    // Stop speaking if currently reading previous answer
    stopSpeaking();

    // Add user message to UI
    const newUserMsg: ChatMessage = { id: Math.random().toString(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      // Add temporary loading message for AI
      const aiMsgId = Math.random().toString();
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '', isStreaming: true }]);

      const messageHistory = [
        ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: text }
      ];

      const data = await sendMessage(messageHistory, language);
      const reply = data.answer || data.response || "I have analyzed your financial context. How else can I assist you?";

      // Update AI message with final text
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId ? { ...msg, text: reply, isStreaming: false, citations: [{source: "Finclusion NLP Engine", timestamp: new Date().toISOString()}] } : msg
      ));
      
      // Speak the response aloud (voice assistant behavior)
      speak(reply);

    } catch (error: any) {
      console.error(error);
      const fallbackReply = language.startsWith('hi') 
        ? "नमस्ते! मैं Finclusion AI हूँ। आप मुझसे SIP निवेश, शेयर बाजार, म्यूचुअल फंड या वित्तीय सुरक्षा के बारे में पूछ सकते हैं।"
        : "Hello! I am Finclusion AI. You can ask me to calculate SIP returns, evaluate loans, detect fraud SMS, or check government schemes.";
      
      setMessages(prev => [...prev, { 
        id: Math.random().toString(), 
        sender: 'ai', 
        text: fallbackReply, 
        isStreaming: false 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusText = () => {
    if (isListening) return "Listening...";
    if (isProcessing) return "Thinking...";
    if (isSpeaking) return "Speaking...";
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-transparent font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b z-10" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[var(--text-main)]">Finclusion AI</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your personal financial analyst</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Voice Status Indicator */}
          {getStatusText() && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border animate-pulse ${
              isListening ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
              isProcessing ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              isSpeaking ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              'bg-white/5 text-white/50 border-white/10'
            }`}>
              {isListening && <Mic className="w-3 h-3" />}
              {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
              {isSpeaking && <Volume2 className="w-3 h-3" />}
              {getStatusText()}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[var(--text-dim)]" />
            <select 
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setHasGreeted(false);
              }}
              className="text-xs border rounded-full px-3 py-1.5 focus:outline-none cursor-pointer"
              style={{ background: 'var(--input-bg)', color: 'var(--text-main)', borderColor: 'var(--border-card)' }}
            >
              {INDIAN_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 z-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-glow" style={{ background: 'var(--accent-glow-subtle)' }}>
              <Sparkles className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h3 className="text-2xl font-extrabold mb-2 text-[var(--text-main)]">How can I help you today?</h3>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Ask about investing, tax planning, or government schemes.</p>
            <p className="text-sm mb-8 flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
              <Mic className="w-4 h-4" /> Tap the mic to use voice, or type below
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {(PROMPTS_BY_LANG[language] || PROMPTS_BY_LANG['default']).map((q, i) => (
                <button 
                  key={i}
                  onClick={() => sendMsg(q)}
                  className="glass-card p-3.5 text-xs text-left transition-all duration-200 hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card-hover)] hover:scale-[1.01] flex items-center justify-between group card-hover"
                  style={{ color: 'var(--text-main)', borderColor: 'var(--border-card)' }}
                >
                  <span className="group-hover:text-[var(--accent-primary)] transition-colors">"{q}"</span>
                  <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" style={{ color: 'var(--accent-primary)' }} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 ${
                msg.sender === 'user' 
                  ? 'rounded-br-sm shadow-glow-sm'
                  : 'rounded-bl-sm border'
              }`}
              style={msg.sender === 'user' ? { background: 'var(--accent-gradient)', color: 'white' } : { background: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>FINCLUSION AI</span>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: 'var(--accent-primary)' }} />}
                </div>


              </div>
            </div>
          ))
        )}

        {/* Live voice transcript (interim results) */}
        {isListening && (interimTranscript || transcript) && (
          <div className="flex justify-end">
             <div className="max-w-[85%] md:max-w-[75%] rounded-2xl p-5 border italic rounded-br-sm shadow-glow-sm" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)', color: 'var(--text-main)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">LISTENING</span>
                  </div>
                </div>
                "{interimTranscript || transcript}..."
             </div>
          </div>
        )}
        
        {isProcessing && !isListening && (
          <div className="flex justify-start">
             <div className="border p-5 rounded-2xl rounded-bl-sm flex items-center gap-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Analyzing your query...</span>
             </div>
          </div>
        )}

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="flex justify-start">
            <div className="border rounded-2xl rounded-bl-sm p-4 flex items-center gap-4" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.1)' }}>
              {/* Waveform animation */}
              <div className="flex items-center gap-1 h-6">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1 bg-emerald-400 rounded-full animate-pulse"
                    style={{ 
                      height: `${12 + Math.random() * 12}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`
                    }} 
                  />
                ))}
              </div>
              <span className="text-sm text-emerald-400 font-medium">Speaking...</span>
              <button 
                onClick={stopSpeaking}
                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-full transition-colors"
                title="Stop speaking"
              >
                <Square className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t relative z-10" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-card)' }}>
        <div className="max-w-4xl mx-auto flex items-end gap-3 relative">
          
          <div className="flex-1 border rounded-3xl p-2 pl-4 flex items-center shadow-lg transition-all focus-within:ring-1 focus-within:ring-[var(--accent-primary)] focus-within:border-[var(--accent-primary)]" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
              placeholder="Ask me anything about finance..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm md:text-base py-2"
              style={{ color: 'var(--text-main)' }}
            />
            
            <button 
              onClick={() => sendMsg()}
              disabled={!input.trim()}
              className="p-3 disabled:opacity-30 rounded-full transition-colors ml-2"
              style={{ color: 'var(--accent-primary)', background: 'var(--accent-glow-subtle)' }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Button */}
          <button 
            onClick={isListening ? stopListening : startListening}
            disabled={!hasSpeechRecognition || isProcessing}
            className={`relative p-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
              isListening 
                ? 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)] scale-110' 
                : 'hover:scale-105 shadow-glow disabled:opacity-50 disabled:hover:scale-100'
            }`}
            style={!isListening ? { background: 'var(--accent-gradient)' } : {}}
          >
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-rose-400/50 animate-ping" />
                <span className="absolute inset-[-4px] rounded-full border border-rose-400/20 animate-ping" style={{ animationDuration: '2s' }} />
              </>
            )}
            {isListening ? <MicOff className="w-6 h-6 text-white relative z-10" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
        </div>
        <p className="text-center text-[10px] uppercase font-bold tracking-wider mt-4" style={{ color: 'var(--text-dim)' }}>
          {hasSpeechRecognition ? 'Tap the mic to speak, or type your question' : 'Voice not supported in this browser — type your question below'}
        </p>
      </div>

    </div>
  );
}
