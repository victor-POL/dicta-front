import { useEffect, useState } from 'react';
import { getMapaData } from '../services/api/mapaService';
import { useSocketSubscription } from '@/contexts/SocketContext';

export function useMapa(hash: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones en tiempo real
  useSocketSubscription<any>('mapa_update', (newData) => {
    setData(newData);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getMapaData(hash);
        setData(result);
      } catch (err) {
        setError('Error al cargar mapa');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { data, loading, error, isReady: !!data };
}
