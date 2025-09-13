import { useEffect, useState } from 'react';
import { getSugerenciasData } from '../services/api/sugerenciasService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { SugerenciasData, ParsedSugerencias, SugerenciaCategoria } from '../models/sugerenciasModels';

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

  // Suscripción a nuevas sugerencias desde Postman/API externa
  useSocketSubscription<{sessionId: string, sugerencia: any}>('nueva_sugerencia', (data) => {
    console.log('💡 Nueva sugerencia recibida:', data);
    if (data.sugerencia) {
      // Crear nueva sugerencia en el formato correcto
      const newSugerenciaItem = {
        question: data.sugerencia.titulo || 'Nueva sugerencia',
        reasoning: data.sugerencia.descripcion || 'Sin descripción'
      };
      
      setSugerenciasData(prev => {
        const currentQuestions = prev?.questions || [];
        
        // Crear estructura completa si no existe
        const updatedData: SugerenciasData = {
          questions: [...currentQuestions, newSugerenciaItem],
          cached: false,
          audio_hash: prev?.audio_hash || 'postman-hash'
        };
        
        console.log('💡 Datos de sugerencias actualizados:', updatedData);
        return updatedData;
      });
    }
  }, []);

  // Parsear las sugerencias cuando cambien
  useEffect(() => {
    console.log('📝 useSugerencias - Datos recibidos:', sugerenciasData);
    
    if (sugerenciasData?.questions && sugerenciasData.questions.length > 0) {
      console.log('✅ Procesando sugerencias con', sugerenciasData.questions.length, 'preguntas');
      const parsed = processSugerencias(sugerenciasData);
      setParsedSugerencias(parsed);
    } else {
      console.log('⚠️ No hay sugerencias válidas:', sugerenciasData);
      setParsedSugerencias(null);
    }
  }, [sugerenciasData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Solicitando sugerencias para hash:', hash);
        const response = await getSugerenciasData(hash);
        console.log('📨 Respuesta del servicio:', response);
        
        if (response.status === 'success') {
          console.log('✅ Datos exitosos:', response.data);
          setSugerenciasData(response.data);
        } else {
          console.log('❌ Error en respuesta:', response.message);
          setError(response.message || 'Error al cargar las sugerencias');
        }
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