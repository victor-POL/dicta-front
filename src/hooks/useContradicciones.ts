import { useEffect, useState } from 'react';
import { getContradiccionesData } from '../services/api/contradiccionesService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { ContradiccionesData, ParsedContradicciones, ContradiccionCategoria } from '../models/contradiccionesModels';
import { useTranscripcionContext } from '@/contexts/TranscripcionContext';

// Payload del evento audio_contradictions_success
interface AudioContradictionsSuccessPayload {
  contradictions: { frase1: string; frase2: string; descripcion: string }[];
  cached: boolean;
  audio_hash: string;
}

// Función para procesar las contradicciones sin categorización
function processContradicciones(contradiccionesData: ContradiccionesData): ParsedContradicciones {
  console.log('🔄 Procesando contradicciones:', contradiccionesData);
  
  // Crear una sola categoría con todas las contradicciones
  const allContradictions: ContradiccionCategoria = {
    title: 'Contradicciones',
    contradictions: contradiccionesData.contradictions || [],
    icon: '⚠️'
  };

  const result = {
    title: 'Contradicciones',
    totalContradicciones: (contradiccionesData.contradictions || []).length,
    categories: [allContradictions]
  };
  
  console.log('✅ Contradicciones procesadas:', result);
  return result;
}

export function useContradicciones(hash: string, isRecording: boolean = false) {
  const [contradiccionesData, setContradiccionesData] = useState<ContradiccionesData | null>(null);
  const [parsedContradicciones, setParsedContradicciones] = useState<ParsedContradicciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latestHash } = useTranscripcionContext();

  // Suscripción a actualizaciones de contradicciones en tiempo real
  useSocketSubscription<ContradiccionesData>('contradicciones_update', (data: ContradiccionesData) => {
    console.log('🔄 Evento contradicciones_update recibido:', data);
    setContradiccionesData(data);
    setLoading(false);
    setError(null);
  }, []);

  // Suscripción a nuevas contradicciones (batch completo) desde Postman/API externa
  useSocketSubscription<AudioContradictionsSuccessPayload>('audio_contradictions_success', (data) => {
    console.log('⚠️ Evento audio_contradictions_success recibido:', data);
    if (Array.isArray(data.contradictions)) {
      const updated: ContradiccionesData = {
        contradictions: data.contradictions,
        cached: data.cached,
        audio_hash: data.audio_hash
      };
      setContradiccionesData(updated);
      setLoading(false);
      setError(null);
    }
  }, []);

  // Parsear las contradicciones cuando cambien
  useEffect(() => {
    if (contradiccionesData?.contradictions && contradiccionesData.contradictions.length > 0) {
      const parsed = processContradicciones(contradiccionesData);
      setParsedContradicciones(parsed);
    } else {
      setParsedContradicciones(null);
    }
  }, [contradiccionesData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const hashToUse = isRecording ? (latestHash || hash) : hash;
        console.log('🔍 Solicitando contradicciones para hash:', hashToUse);
        getContradiccionesData(hashToUse);
      } catch (err) {
        console.error('💥 Error en fetch:', err);
        setError('Error al cargar las contradicciones');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { 
    contradiccionesData, 
    parsedContradicciones, 
    loading, 
    error,
    isReady: !!parsedContradicciones 
  };
}
