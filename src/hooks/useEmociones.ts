import { useState, useEffect } from 'react';
import type { EmocionesData, ParsedEmociones } from '@/models/emocionesModels';
import { getEmocionesData } from '@/services/api/emocionesService';
import { useSocketSubscription } from '@/contexts/SocketContext';

// Función para parsear los datos de emociones
function parseEmocionesData(data: EmocionesData): ParsedEmociones {
  console.log('📊 Parseando datos de emociones:', data);
  
  // Verificar que el array de emociones no esté vacío
  const emociones = data.emociones || [];
  console.log('🎭 Emociones recibidas:', emociones);
  
  // Si no hay emociones, crear una estructura por defecto
  if (emociones.length === 0) {
    console.log('⚠️ No hay emociones en los datos, usando valores por defecto');
    return {
      oradorDetectado: data.orador_detectado || 'Desconocido',
      precision: data.precision || 0,
      emocionPrincipal: {
        tipo: 'Sin datos',
        porcentaje: 0,
        color: '#gray'
      },
      todasLasEmociones: [],
      fechaAnalisis: data.fecha_analisis || new Date().toISOString(),
      duracionAudio: data.duracion_audio,
      confianzaGeneral: data.confianza_general,
      cached: data.cached
    };
  }

  // Encontrar la emoción principal (mayor porcentaje) con valor inicial
  const emocionPrincipal = emociones.reduce((prev, current) => 
    prev.porcentaje > current.porcentaje ? prev : current,
    emociones[0] // Valor inicial para evitar el error
  );

  const parsedResult = {
    oradorDetectado: data.orador_detectado,
    precision: data.precision,
    emocionPrincipal,
    todasLasEmociones: emociones.sort((a, b) => b.porcentaje - a.porcentaje),
    fechaAnalisis: data.fecha_analisis,
    duracionAudio: data.duracion_audio,
    confianzaGeneral: data.confianza_general,
    cached: data.cached
  };

  console.log('✅ Datos parseados:', parsedResult);
  return parsedResult;
}

export function useEmociones(hash: string) {
  const [emocionesData, setEmocionesData] = useState<EmocionesData | null>(null);
  const [parsedEmociones, setParsedEmociones] = useState<ParsedEmociones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = parsedEmociones !== null && !loading;

  console.log('🔄 Hook useEmociones - Estado actual:', {
    hash,
    loading,
    error,
    hasData: !!emocionesData,
    hasParsed: !!parsedEmociones,
    isReady
  });

  // Suscripción a nuevas emociones desde Postman/API externa
  useSocketSubscription<{
    sessionId: string, 
    emociones: {[key: string]: number},
    orador_detectado?: string,
    confianza_general?: number
  }>('emociones_actualizadas', (data) => {
    console.log('🎭 Emociones actualizadas desde API externa:', data);
    if (data.emociones) {
      // Mapeo de colores por emoción
      const emotionColors: {[key: string]: string} = {
        nerviosismo: '#ff6b6b',
        confianza: '#51cf66',
        ansiedad: '#ffd43b',
        determinacion: '#74c0fc',
        confusion: '#ff8cc8',
        alegria: '#51cf66',
        preocupacion: '#ffd43b',
        sorpresa: '#74c0fc',
        enojo: '#ff6b6b',
        tristeza: '#845ef7',
        miedo: '#fd7e14',
        neutral: '#868e96'
      };

      // Convertir formato del API externo al formato interno
      const emocionesArray = Object.entries(data.emociones).map(([emotion, value]) => ({
        tipo: emotion,
        porcentaje: typeof value === 'number' ? value : 0,
        color: emotionColors[emotion] || '#868e96'
      }));

      const emotionsData: EmocionesData = {
        id: 'external-api-' + Date.now(),
        orador_detectado: data.orador_detectado || 'API Externa',
        precision: 85,
        emociones: emocionesArray,
        fecha_analisis: new Date().toISOString(),
        duracion_audio: 120,
        confianza_general: data.confianza_general || 0.85,
        cached: false
      };

      setEmocionesData(emotionsData);
      setParsedEmociones(parseEmocionesData(emotionsData));
      setLoading(false);
      setError(null);
    }
  }, []);

  useEffect(() => {
    console.log(`🚀 Iniciando carga de emociones para hash: ${hash}`);
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getEmocionesData(hash);
        console.log('📥 Respuesta de API recibida:', response);
        if (response.success && response.data) {
          console.log('✅ Datos válidos recibidos, parseando...');
          setEmocionesData(response.data);
          setParsedEmociones(parseEmocionesData(response.data));
          setError(null);
        } else {
          console.error('❌ Respuesta de API inválida:', response);
          setError('Respuesta de API inválida');
        }
      } catch (err) {
        console.error('❌ Error al obtener emociones:', err);
        setError('Error al cargar emociones');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { emocionesData, parsedEmociones, loading, error, isReady };
}
