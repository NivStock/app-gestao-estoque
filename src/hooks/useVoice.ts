'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string | null;
}

// Tipos para TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Proteger contra SSR - só executar no client
    if (typeof window === 'undefined') return;
    
    // Verificar se o navegador suporta Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        const result = event.results[0];
        if (result.isFinal) {
          const transcriptText = result[0].transcript;
          setTranscript(transcriptText);
          
          // Auto-stop após receber resultado
          setTimeout(() => {
            setIsListening(false);
            setTranscript('');
          }, 3000);
        }
      };

      recognition.onerror = (event) => {
        // Tratar diferentes tipos de erro de forma mais silenciosa
        let errorMessage = '';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Permissão de microfone negada. Verifique as configurações do navegador.';
            break;
          case 'no-speech':
            errorMessage = 'Nenhuma fala detectada. Tente novamente.';
            break;
          case 'audio-capture':
            errorMessage = 'Erro ao capturar áudio. Verifique se o microfone está funcionando.';
            break;
          case 'network':
            errorMessage = 'Erro de rede. Verifique sua conexão.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Serviço de reconhecimento de voz não permitido.';
            break;
          default:
            errorMessage = `Erro no reconhecimento de voz: ${event.error}`;
        }
        
        // Log apenas para debug, não mostrar no console em produção
        if (process.env.NODE_ENV === 'development') {
          console.warn('Speech recognition error:', event.error);
        }
        
        setError(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Reconhecimento de voz não suportado neste navegador');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (!isSupported || !recognitionRef.current) {
      setError('Reconhecimento de voz não disponível');
      return;
    }

    // Verificar se já está ouvindo
    if (isListening) {
      return;
    }

    try {
      setError(null);
      
      // Verificar se o contexto é seguro (HTTPS ou localhost)
      if (!window.isSecureContext && window.location.protocol !== 'http:') {
        setError('Reconhecimento de voz requer contexto seguro (HTTPS)');
        return;
      }
      
      recognitionRef.current.start();
      
      // Auto-stop após 10 segundos
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erro ao iniciar reconhecimento:', err);
      }
      setError('Erro ao iniciar reconhecimento de voz. Tente novamente.');
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignorar erros ao parar
        if (process.env.NODE_ENV === 'development') {
          console.warn('Erro ao parar reconhecimento:', err);
        }
      }
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsListening(false);
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error
  };
}