import { useEffect, useState } from 'react';
import { getMapaData } from '../services/api/mapaService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { MapaResponse } from '../models/mapaModels';
import { useTranscripcionContext } from '@/contexts/TranscripcionContext';

export function useMapa(hash: string, isRecording: boolean = false) {
  const { latestHash } = useTranscripcionContext();
  const [data, setData] = useState<MapaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones en tiempo real
  useSocketSubscription<MapaResponse>('audio_mindmap_success', (newData) => {
    setData(newData);
    console.log(newData);
    setLoading(false);
    setError(null);
  }, []);

  // Ya no parseamos Mermaid; el front muestra directamente el SVG provisto por el backend

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const hashToUse = isRecording ? (latestHash || hash) : hash;
        console.log("Fetching mapa for hash:", hashToUse);
        getMapaData(hashToUse);
      } catch (err) {
        setError('Error al cargar mapa');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { 
    data, 
    loading, 
    error, 
    isReady: !!data
  };
}
