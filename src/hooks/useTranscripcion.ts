import { useEffect, useState } from 'react';
import { getTranscripcionMessages } from '../services/api/transcripcionService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { Segment } from '../models/transcripcionModels';

export function useTranscripcion(hash: string) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payload del evento audio_transcribe_success
  interface AudioTranscribeSuccessPayload {
    segments: Segment[]; // Los segmentos ya vienen en el formato esperado
    final_transcription_path: string;
    ai_case: {
      case_id: string;
      case_name: string;
      upload_success: boolean;
      transcription_length: number;
    };
    cached: boolean;
    audio_hash: string;
  }

  // Suscripción a actualizaciones de transcripción en tiempo real
  useSocketSubscription<Segment>('transcription_update', (newSegment: Segment) => {
    setSegments(prev => [...prev, newSegment]);
  }, []);

  // Suscripción a resultado de transcripción completa / batch de segmentos
  useSocketSubscription<AudioTranscribeSuccessPayload>('audio_transcribe_success', (data) => {
    console.log('📝 Evento audio_transcribe_success recibido:', data);
    if (Array.isArray(data.segments) && data.segments.length) {
      // Evitar duplicados simples por id
      setSegments(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const newOnes = data.segments.filter(s => !existingIds.has(s.id));
        return [...prev, ...newOnes];
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        getTranscripcionMessages(hash);
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