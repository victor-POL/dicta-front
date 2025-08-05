import { useEffect, useState } from 'react';
import { getTranscripcionMessages } from '../services/api/transcripcionService';
import { connectTranscripcionSocket, closeTranscripcionSocket } from '../services/socket/transcripcionSocket';
import type { Segment } from '../models/transcripcionModels';

export function useTranscripcion(mode: 'api' | 'socket', hash: string) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'api') {
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
    } else if (mode === 'socket') {
      connectTranscripcionSocket((newSegment: Segment) => {
        setSegments(prev => [...prev, newSegment]);
      }, hash);
    }
  }, [mode, hash]);

  return { segments, loading, error };
}