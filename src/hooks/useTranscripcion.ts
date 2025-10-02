import { useEffect, useRef, useState } from 'react';
import { getTranscripcionMessages, subscribeToRabbitMQueue } from '../services/api/transcripcionService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import { MediaService } from '../services/mediaService';
import type { AudioTranscribeSuccessPayload, Segment, TranscriptionStreamPayload } from '../models/transcripcionModels';

export function useTranscripcion(hash: string) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaServiceRef = useRef<MediaService | null>(null)
  
  // Suscripción a actualizaciones de transcripción en tiempo real
  useSocketSubscription<Segment>('transcription_update', (newSegment: Segment) => {
    setSegments(prev => [...prev, newSegment]);
  }, []);

  useSocketSubscription<TranscriptionStreamPayload>("transcription_result", (data: TranscriptionStreamPayload) => {
    console.log(data);
    setSegments(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const newOnes = data.segments.filter(s => !existingIds.has(s.id));
      return [...prev, ...newOnes];
    });
  }, []);

  useSocketSubscription<any>("result", (data) => {
    console.log(data);
  }, []);

    useSocketSubscription<any>("heartbeat", (data) => {
    console.log(data);
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
        console.log(hash);
        if (hash.startsWith("live_")) {
          subscribeToRabbitMQueue(hash);
          
          // Initialize MediaService
          mediaServiceRef.current = new MediaService();
          await mediaServiceRef.current.initializeMediaRecorder(hash);
        }
        else {
          getTranscripcionMessages(hash);
        }
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