import { useEffect, useState } from 'react';
import { getSugerenciasData } from '../services/api/sugerenciasService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { SugerenciasData, ParsedSugerencias, SugerenciaCategoria } from '../models/sugerenciasModels';

// Payload del evento audio_questions_success
interface AudioQuestionsSuccessPayload {
  questions: { question: string; reasoning: string }[];
  cached: boolean;
  audio_hash: string;
}

// Función para procesar las sugerencias sin categorización
function processSugerencias(sugerenciasData: SugerenciasData): ParsedSugerencias {
  console.log('🔄 Procesando sugerencias:', sugerenciasData);
  
  // Crear una sola categoría con todas las preguntas
  const allQuestions: SugerenciaCategoria = {
    title: 'Sugerencias',
    questions: sugerenciasData.questions || [],
    icon: '💡'
  };

  const result = {
    title: 'Sugerencias',
    totalQuestions: (sugerenciasData.questions || []).length,
    categories: [allQuestions]
  };
  
  console.log('✅ Sugerencias procesadas:', result);
  return result;
}

export function useSugerencias(hash: string) {
  const [sugerenciasData, setSugerenciasData] = useState<SugerenciasData | null>(null);
  const [parsedSugerencias, setParsedSugerencias] = useState<ParsedSugerencias | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones de sugerencias en tiempo real
  useSocketSubscription<SugerenciasData>('sugerencias_update', (data: SugerenciasData) => {
    setSugerenciasData(data);
    setLoading(false);
    setError(null);
  }, []);

  // Suscripción a nuevas sugerencias (batch completo) desde Postman/API externa
  useSocketSubscription<AudioQuestionsSuccessPayload>('audio_questions_success', (data) => {
    console.log('💡 Evento audio_questions_success recibido:', data);
    if (Array.isArray(data.questions)) {
      setSugerenciasData(prev => {
        const updated: SugerenciasData = {
          questions: data.questions,
          cached: data.cached,
          audio_hash: data.audio_hash
        };
        return updated;
      });
    }
  }, []);

  // Parsear las sugerencias cuando cambien
  useEffect(() => {
    if (sugerenciasData?.questions && sugerenciasData.questions.length > 0) {
      const parsed = processSugerencias(sugerenciasData);
      setParsedSugerencias(parsed);
    } else {
      setParsedSugerencias(null);
    }
  }, [sugerenciasData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Solicitando sugerencias para hash:', hash);
        getSugerenciasData(hash);
      } catch (err) {
        console.error('💥 Error en fetch:', err);
        setError('Error al cargar las sugerencias');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { 
    sugerenciasData, 
    parsedSugerencias, 
    loading, 
    error,
    isReady: !!parsedSugerencias 
  };
}