import { useEffect, useState } from 'react';
import { getMapaData } from '../services/api/mapaService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { MapaResponse, ParsedMindmap } from '../models/mapaModels';

// Función para parsear el código mermaid mindmap
function parseMermaidMindmap(mermaidCode: string): ParsedMindmap {
  // Por ahora retornamos una estructura básica
  // Puedes implementar un parser más sofisticado si necesitas
  return {
    rootNode: {
      id: 'root',
      title: 'Resumen Final de la Audiencia Judicial',
      level: 0,
      children: []
    },
    totalNodes: 20,
    maxDepth: 3,
    mermaidCode
  };
}

export function useMapa(hash: string) {
  const [data, setData] = useState<MapaResponse | null>(null);
  const [parsedMindmap, setParsedMindmap] = useState<ParsedMindmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones en tiempo real
  useSocketSubscription<MapaResponse>('audio_mindmap_success', (newData) => {
    setData(newData);
    setLoading(false);
    setError(null);
  }, []);

  // Parsear el mindmap cuando cambien los datos
  useEffect(() => {
    if (data?.mermaid_mindmap?.mermaid_code) {
      const parsed = parseMermaidMindmap(data.mermaid_mindmap.mermaid_code);
      setParsedMindmap(parsed);
    } else {
      setParsedMindmap(null);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        getMapaData(hash);
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
    parsedMindmap, 
    loading, 
    error, 
    isReady: !!data && !!parsedMindmap 
  };
}
