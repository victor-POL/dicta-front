import { useEffect, useState } from 'react';
import { getTranscripcionMessages } from '../services/api/transcripcionService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { Segment } from '../models/transcripcionModels';

// Función para convertir segundos a formato de tiempo
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

export function useTranscripcion(hash: string) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones de transcripción en tiempo real
  useSocketSubscription<Segment>('transcription_update', (newSegment: Segment) => {
    setSegments(prev => [...prev, newSegment]);
  }, []);

  // Suscripción a nuevos segmentos desde Postman/API externa
  useSocketSubscription<{sessionId: string, segment: any}>('transcripcion_segment', (data) => {
    console.log('📝 Nuevo segmento recibido:', data);
    if (data.segment) {
      // Transformar el formato del servidor al formato esperado
      const transformedSegment: Segment = {
        id: data.segment.id,
        start: formatTime(data.segment.inicio || 0),
        end: formatTime(data.segment.fin || 0),
        speaker: data.segment.hablante || 'Desconocido',
        text: data.segment.texto || ''
      };
      console.log('📝 Segmento transformado:', transformedSegment);
      setSegments(prev => [...prev, transformedSegment]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTranscripcionMessages(hash);
        setSegments(data.segments);
        setError(null);
      } catch (err) {
        setError('Error al cargar la transcripción');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { segments, loading, error };
}