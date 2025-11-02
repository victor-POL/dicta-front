import { useEffect, useState } from 'react';
import { getResumenData } from '../services/api/resumenService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { ResumenData } from '../models/resumenModels';
import { useTranscripcionContext } from '@/contexts/TranscripcionContext';

export function useResumen(hash: string, isRecording: boolean = false) {
  const [resumenData, setResumenData] = useState<ResumenData | null>(null);
  const [parsedResumen, setParsedResumen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latestHash } = useTranscripcionContext();
  

  // Suscripción a actualizaciones de resumen en tiempo real
  useSocketSubscription<ResumenData>('audio_summarize_success', (data: ResumenData) => {
    console.log(data);
    setResumenData(data);
    setLoading(false);
    setError(null);
  }, [latestHash, hash, isRecording]);

  // Set the markdown content directly when resumen data changes
  useEffect(() => {
    if (resumenData?.summary) {
      console.log('Resumen recibido:', resumenData.summary);
      setParsedResumen(resumenData.summary);
    } else {
      setParsedResumen(null);
    }
  }, [resumenData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (isRecording){
          const hashToUse = latestHash || hash;
          console.log("Fetching resumen for hash:", hashToUse);
          getResumenData(hashToUse);
        }
        else {
          console.log("Fetching resumen for hash:", hash);
          getResumenData(hash);
        }
      } catch (err) {
        setError('Error al cargar el resumen');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { 
    resumenData, 
    parsedResumen, 
    loading, 
    error,
    isReady: !!parsedResumen 
  };
}