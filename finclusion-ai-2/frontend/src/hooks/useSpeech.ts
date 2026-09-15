import { useState, useCallback, useEffect, useRef } from 'react';

// Interfaces for Web Speech API (often not fully typed in TS by default)
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export function useSpeech(languageCode: string = 'en-IN') {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  // Setup Recognition (Voice to Text)
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true; // Enable live transcription
        
        rec.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptText = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcriptText;
            } else {
              interim += transcriptText;
            }
          }
          
          if (final) {
            setTranscript(final);
            setInterimTranscript('');
            setIsListening(false);
          } else {
            setInterimTranscript(interim);
          }
        };
        
        rec.onerror = () => {
          setIsListening(false);
          setInterimTranscript('');
        };
        rec.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };
        
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
        setInterimTranscript('');
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
      setInterimTranscript('');
    }
  }, [recognition]);

  // Setup Synthesis (Text to Voice)
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to pick a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith(languageCode.split('-')[0]) && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang.startsWith(languageCode.split('-')[0]))
        || voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
      
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
    interimTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    hasSpeechRecognition: !!recognition
  };
}
