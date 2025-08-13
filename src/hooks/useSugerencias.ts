import { useEffect, useState } from 'react';
import { getSugerenciasData } from '../services/api/sugerenciasService';
import { connectSugerenciasSocket, closeSugerenciasSocket } from '../services/socket/sugerenciasSocket';
import type { SugerenciasData, ParsedSugerencias, SugerenciaCategoria } from '../models/sugerenciasModels';

// Función para procesar las sugerencias sin categorización
function processSugerencias(sugerenciasData: SugerenciasData): ParsedSugerencias {
  // Crear una sola categoría con todas las preguntas
  const allQuestions: SugerenciaCategoria = {
    title: 'Sugerencias',
    questions: sugerenciasData.questions,
    icon: '💡'
  };

  return {
    title: 'Sugerencias',
    totalQuestions: sugerenciasData.questions.length,
    categories: [allQuestions]
  };
}

export function useSugerencias(mode: 'api' | 'socket', hash: string) {
  const [sugerenciasData, setSugerenciasData] = useState<SugerenciasData | null>(null);
  const [parsedSugerencias, setParsedSugerencias] = useState<ParsedSugerencias | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (mode === 'api') {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const response = await getSugerenciasData(hash);
          
          if (response.status === 'success') {
            setSugerenciasData(response.data);
          } else {
            setError(response.message || 'Error al cargar las sugerencias');
          }
        } catch (err) {
          setError('Error al cargar las sugerencias');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else if (mode === 'socket') {
      setLoading(true);
      setError(null);
      
      // Timeout para detectar si el servidor no está disponible
      const connectionTimeout = setTimeout(() => {
        setError('Timeout: No se pudo conectar al servidor de sugerencias');
        setLoading(false);
      }, 10000); // 10 segundos

      connectSugerenciasSocket(
        (data: SugerenciasData) => {
          clearTimeout(connectionTimeout);
          setSugerenciasData(data);
          setLoading(false);
          setError(null);
        },
        (errorMessage: string) => {
          clearTimeout(connectionTimeout);
          setError(errorMessage);
          setLoading(false);
        },
        hash
      );

      // Cleanup
      return () => {
        clearTimeout(connectionTimeout);
        closeSugerenciasSocket();
      };
    }
  }, [mode, hash]);

  return { 
    sugerenciasData, 
    parsedSugerencias, 
    loading, 
    error,
    isReady: !!parsedSugerencias 
  };
}