import { useEffect, useState } from 'react';
import { getContradiccionesData } from '../services/api/contradiccionesService';
import { useSocketSubscription } from '@/contexts/SocketContext';

export function useContradicciones(hash: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones en tiempo real
  useSocketSubscription<any>('audio_contradictions_success', (newData) => {
    setData(newData);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getContradiccionesData(hash);
        setData(result);
      } catch (err) {
        setError('Error al cargar contradicciones');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { data, loading, error, isReady: !!data };
}
