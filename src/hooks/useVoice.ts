'use client';

import { useState, useRef, useCallback } from 'react';

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
  const [isSupported, setIsSupported] = useState(() => {
    // Verificação lazy - só quando realmente usado
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createRecognitionInstance = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    
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
      // Tratar diferentes tipos de erro de forma silenciosa
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
      
      // Apenas definir o erro interno para tratamento pela UI
      // NÃO fazer console.error para evitar spam no console
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (!isSupported) {
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
      
      // Criar instância apenas quando necessário
      if (!recognitionRef.current) {
        recognitionRef.current = createRecognitionInstance();
      }
      
      if (!recognitionRef.current) {
        setError('Erro ao criar instância de reconhecimento de voz');
        return;
      }
      
      recognitionRef.current.start();
      
      // Auto-stop após 10 segundos
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    } catch (err) {
      // Tratamento silencioso de erros - apenas definir mensagem para UI
      setError('Erro ao iniciar reconhecimento de voz. Tente novamente.');
    }
  }, [isSupported, isListening, createRecognitionInstance]);

  const stopListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignorar erros ao parar - tratamento silencioso
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