import { useState, useCallback, useEffect } from 'react';

// Interfaces for Web Speech API (often not fully typed in TS by default)
interface SpeechRecognitionEvent {
  results: { [key: number]: { [key: number]: { transcript: string } } };
}

export function useSpeech(languageCode: string = 'en-IN') {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Setup Recognition (Voice to Text)
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        
        rec.onresult = (event: SpeechRecognitionEvent) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
        };
        
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        
        setRecognition(rec);
      }
    }
  }, []);

  // Update language dynamically
  useEffect(() => {
    if (recognition) {
      recognition.lang = languageCode;
    }
  }, [languageCode, recognition]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setTranscript('');
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition already started");
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  // Setup Synthesis (Text to Voice)
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, [languageCode]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    hasSpeechRecognition: !!recognition
  };
}
