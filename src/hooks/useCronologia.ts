import { useEffect, useState } from 'react';
import { getCronologiaData } from '../services/api/cronologiaService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { CronologiaResponse, ParsedTimeline } from '../models/cronologiaModels';

// Función para parsear el código mermaid timeline
function parseMermaidTimeline(mermaidCode: string): ParsedTimeline {
  // Por ahora retornamos una estructura básica
  // Puedes implementar un parser más sofisticado si necesitas
  return {
    title: 'Audiencia Judicial del Tribunal Oral Federal Nº 6',
    sections: [],
    totalEvents: 0,
    mermaidCode
  };
}

export function useCronologia(hash: string) {
  const [data, setData] = useState<CronologiaResponse | null>(null);
  const [parsedTimeline, setParsedTimeline] = useState<ParsedTimeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones en tiempo real
  useSocketSubscription<CronologiaResponse>('audio_timeline_success', (newData) => {
    console.log(newData);
    setData(newData);
    setLoading(false);
    setError(null);
  }, []);

  // Parsear el timeline cuando cambien los datos
  useEffect(() => {
    if (data?.mermaid_timeline?.mermaid_code) {
      const parsed = parseMermaidTimeline(data.mermaid_timeline.mermaid_code);
      setParsedTimeline(parsed);
    } else {
      setParsedTimeline(null);
    }
  }, [data]);

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
    parsedTimeline, 
    loading, 
    error, 
    isReady: !!data && !!parsedTimeline 
  };
}
