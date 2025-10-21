import { useEffect, useState } from 'react';
import { getCronologiaData } from '../services/api/cronologiaService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { CronologiaResponse } from '../models/cronologiaModels';

export function useCronologia(hash: string) {
  const [data, setData] = useState<CronologiaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones en tiempo real
  useSocketSubscription<CronologiaResponse>('audio_timeline_success', (newData) => {
    console.log(newData);
    setData(newData);
    setLoading(false);
    setError(null);
  }, []);

  // Ya no parseamos Mermaid; el front muestra directamente el SVG provisto por el backend

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        getCronologiaData(hash);
      } catch (err) {
        setError('Error al cargar cronología');
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
