import { useEffect, useState } from 'react';
import { getTranscripcionMessages } from '../services/api/transcripcionService';
import type { Segment } from '../models/transcripcionModels';

export function useTranscripcion(mode: 'api' | 'socket') {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'api') {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getTranscripcionMessages();
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
    }
  }, [mode]);

  return { segments, loading, error };
}