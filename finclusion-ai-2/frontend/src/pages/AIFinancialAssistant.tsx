import React, { useState, useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { Mic, MicOff, Send, Globe2, Loader2, Volume2, ShieldCheck } from 'lucide-react';

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
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN' | 'ta-IN'>('en-IN');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking, hasSpeechRecognition } = useSpeech(language);

  // Auto-greeting on load
  useEffect(() => {
    if (!hasGreeted) {
      let greeting = "Hello, tap the microphone to ask a financial question.";
      if (language === 'hi-IN') greeting = "नमस्ते, अपना वित्तीय प्रश्न पूछने के लिए माइक्रोफ़ोन पर टैप करें।";
      if (language === 'ta-IN') greeting = "வணக்கம், உங்கள் நிதிக் கேள்வியைக் கேட்க மைக்ரோஃபோனைத் தட்டவும்.";
      
      speak(greeting);
      setHasGreeted(true);
    }
  }, [language, hasGreeted, speak]);

  // Initialize WebSocket connection
  useEffect(() => {
    const clientId = Math.random().toString(36).substring(7);
    const socket = new WebSocket(`ws://localhost:8000/chat/ws/${clientId}`);
    
    socket.onopen = () => console.log("Connected to LangGraph WebSocket");
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'text' || data.type === 'citation') {
        setIsProcessing(false);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          
          if (lastMsg && lastMsg.sender === 'ai' && lastMsg.isStreaming) {
            lastMsg.text = data.content;
            lastMsg.citations = data.citations || lastMsg.citations;
            
            // Citation means generation is finished
            if (data.type === 'citation') {
              lastMsg.isStreaming = false;
              // Auto-speak the final response
              speak(lastMsg.text);
            }
          } else {
            newMessages.push({
              id: Math.random().toString(),
              sender: 'ai',
              text: data.content,
              isStreaming: true
            });
          }
          return newMessages;
        });
      }
    };
    
    setWs(socket);
    return () => socket.close();
  }, [speak]);

  // Handle voice transcript updates
  useEffect(() => {
    if (transcript && !isListening) {
      sendMessage(transcript);
    }
  }, [transcript, isListening]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (textToSent?: string) => {
    const text = textToSent || input;
    if (!text.trim() || !ws) return;

    // Stop speaking if currently reading previous answer
    stopSpeaking();

    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text }]);
    setInput('');
    setIsProcessing(true);
    
    ws.send(JSON.stringify({
      message: text,
      language: language.split('-')[0] // 'en', 'hi', 'ta'
    }));
  };

  const getSystemStatus = () => {
    if (isListening) return "Listening to you...";
    if (isProcessing) return "Thinking...";
    if (isSpeaking) return "Speaking...";
    return "Tap the microphone to speak";
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-4 md:p-8 max-w-4xl mx-auto w-full text-white">
      
      {/* Top Header - Language Toggle */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 p-1 rounded-lg">
          <Globe2 className="w-5 h-5 text-white/50 ml-2" />
          <select 
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as any);
              setHasGreeted(false);
            }}
            className="bg-transparent border-none focus:ring-0 text-sm md:text-base font-medium py-2 pr-8 cursor-pointer text-white [&>option]:text-black"
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="ta-IN">தமிழ்</option>
          </select>
        </div>
      </div>

      {/* Main Voice Interface */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
        
        {/* Status Indicator */}
        <div className="absolute top-8 text-center">
          <p className={`text-xl font-medium transition-colors ${
            isListening ? 'text-red-500' : 
            isProcessing ? 'text-amber-500' : 
            isSpeaking ? 'text-emerald-500' : 'text-zinc-400'
          }`}>
            {getSystemStatus()}
          </p>
        </div>

        {/* The Massive Walkie-Talkie Button */}
        <div className="relative mt-8">
          {/* Pulsing background rings when active */}
          {(isListening || isSpeaking) && (
            <>
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping scale-150" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping scale-110" style={{ animationDuration: '2s' }} />
            </>
          )}

          <button 
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || !hasSpeechRecognition}
            className={`relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isListening ? 'bg-red-500' : 
              isProcessing ? 'bg-amber-500' : 
              'bg-gradient-to-br from-emerald-400 to-emerald-600'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-20 h-20 md:w-24 md:h-24 text-white animate-spin" />
            ) : isSpeaking ? (
              <Volume2 className="w-20 h-20 md:w-24 md:h-24 text-white animate-pulse" />
            ) : (
              <Mic className="w-20 h-20 md:w-24 md:h-24 text-white" />
            )}
          </button>
        </div>
        
        {/* Real-time Transcript Preview */}
        {isListening && transcript && (
          <div className="mt-12 text-center max-w-lg">
            <p className="text-xl text-white/80 italic">"{transcript}..."</p>
          </div>
        )}
      </div>

      {/* Latest AI Response Box (Simplified Chat View) */}
      {messages.length > 0 && (
        <div className="mt-6 bg-purple-500/10 p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <div className="whitespace-pre-wrap text-lg md:text-xl text-white/90 leading-relaxed">
            {messages[messages.length - 1].sender === 'user' 
              ? "..." 
              : messages[messages.length - 1].text}
          </div>
          
          {messages[messages.length - 1].citations && (
            <div className="mt-4 pt-4 border-t border-purple-500/20 text-xs text-purple-400/80 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Information provided for educational purposes based on verified sources.
            </div>
          )}
        </div>
      )}

      {/* Fallback Text Input */}
      <div className="mt-6 flex items-center gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Or type your question here..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-white/30 text-lg"
        />
        
        <button 
          onClick={() => sendMessage()}
          disabled={!input.trim()}
          className="p-4 bg-gradient-to-r from-purple-600 to-blue-500 disabled:opacity-50 text-white rounded-full transition-colors shadow-sm"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
