import { useEffect, useState } from 'react';
import type { EmocionesResponse } from '../models/emocionesModels';
import { getAnalisisEmocionesData } from '../services/api/analisisEmocionesService';
import { useSocketSubscription } from '@/contexts/SocketContext';

export function useAnalisisEmociones(hash: string) {
  const [data, setData] = useState<EmocionesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones en tiempo real
  useSocketSubscription<EmocionesResponse>('analisis_emociones_update', (newData) => {
    setData(newData);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getAnalisisEmocionesData(hash);
        setData(result);
      } catch (err) {
        setError('Error al cargar análisis de emociones');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { data, loading, error, isReady: !!data };
}
