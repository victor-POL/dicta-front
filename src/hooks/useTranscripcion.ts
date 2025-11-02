import { useEffect, useRef, useState } from 'react';
import { getAudioMetadata, getTranscripcionMessages, subscribeToRabbitMQueue, unSubscribeToRabbitMQueue } from '../services/api/transcripcionService';
import { getResumenData } from '../services/api/resumenService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import { MediaService } from '../services/mediaService';
import type { AudioTranscribeSuccessPayload, Segment, TranscriptionStreamPayload } from '../models/transcripcionModels';
import { useTranscripcionContext } from '@/contexts/TranscripcionContext';

interface UseTranscripcionOptions {
  readonly isRecording?: boolean
}

export function useTranscripcion(hash: string, options: UseTranscripcionOptions = {}) {
  const { isRecording = false } = options
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaServiceRef = useRef<MediaService | null>(null)
  const { setLatestHash } = useTranscripcionContext()
  
  // Suscripción a actualizaciones de transcripción en tiempo real. Esto por el momento NO SE USA
  useSocketSubscription<Segment>('transcription_update', (newSegment: Segment) => {
    setSegments(prev => [...prev, newSegment]);
  }, []);

  // Suscripción a stream completo de transcripción SOLO TIEMPO REAL
  useSocketSubscription<TranscriptionStreamPayload>("transcription_result", (data: any) => {
    console.log(data);
    setSegments(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const newOnes = data.segments.filter((s: Segment) => !existingIds.has(s.id));
      const newHash = data.hash; // Cuando generamos la transcripcion en tiempo real, el hash cambia constantemente.
      if (newHash !== hash) {
        console.log(`Hash cambiado de ${hash} a ${newHash} en stream de transcripción`);
        // Update the latest hash in the context
        setLatestHash(newHash);
      }
      return [...prev, ...newOnes];
    });

    // Update los otros datos asociados
    getResumenData(data.hash);
  }, [hash, setLatestHash]);

  useSocketSubscription<any>("result", (data) => {
    console.log(data);
  }, []);

    useSocketSubscription<any>("heartbeat", (data) => {
    console.log(data);
  }, []);

  // Suscripción a metadata de audio
  useSocketSubscription<any>('audio_metadata_success', (data) => {
    console.log('📝 Evento audio_metadata_success recibido:', data);
    if (data.metadata.video_url != null) {
      console.log("Adding source links to segments");
      setSegments(prevSegments => {
        return prevSegments.map(segment => {
          // Convert "00:00:02,632" to seconds
          const [hms, ms] = segment.start.split(',');
          const [hours, minutes, seconds] = hms.split(':').map(Number);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds + (ms ? parseInt(ms, 10) / 1000 : 0);

          return {
            ...segment,
            link_to_source: data.metadata.video_url + "&t=" + Math.floor(totalSeconds)
          };
        });
      });
    }
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

    console.log('Pidiendo metadata de audio para hash:', hash);
    getAudioMetadata(hash);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(hash);
        console.log(isRecording);
        if (hash.startsWith("live_")) {
          if (isRecording) {
            subscribeToRabbitMQueue(hash);

            console.log(mediaServiceRef.current);
            if (!mediaServiceRef.current) {
              mediaServiceRef.current = new MediaService();
            }
            const recorder = mediaServiceRef.current.getMediaRecorder();
            console.log(recorder, recorder?.state);
            if (!recorder || recorder.state === 'inactive') {
              await mediaServiceRef.current.initializeMediaRecorder(hash);
            }
          } else {
            getTranscripcionMessages(hash);
          }
        } else {
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
  }, [hash, isRecording]);

  useEffect(() => {
    if (!isRecording && mediaServiceRef.current) {
      console.log("Stopping live recording for hash:", hash);
      unSubscribeToRabbitMQueue(hash);
      mediaServiceRef.current.stopRecording(hash);
      mediaServiceRef.current = null;
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (mediaServiceRef.current) {
        mediaServiceRef.current.stopRecording(hash);
        mediaServiceRef.current = null;
      }
    };
  }, []);

  return { segments, loading, error };
}