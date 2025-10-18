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
    oradoresDisponibles: data.oradoresDisponibles,
    todasLasEmociones: emociones.sort((a, b) => b.porcentaje - a.porcentaje),
    fechaAnalisis: data.fecha_analisis,
    duracionAudio: data.duracion_audio,
    confianzaGeneral: data.confianza_general,
    cached: data.cached
  };

  console.log('✅ Datos parseados:', parsedResult);
  return parsedResult;
}

export function useEmociones(hash: string, orador?: string) {
  const [emocionesData, setEmocionesData] = useState<EmocionesData | null>(null);
  const [parsedEmociones, setParsedEmociones] = useState<ParsedEmociones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = parsedEmociones !== null && !loading;

  // Suscripción a nuevas emociones desde Postman/API externa
  useSocketSubscription<any>('audio_emotions_success', (data) => {
    console.log('🎭 Emociones actualizadas desde API externa:', data);
    if (data) {
      // Mapeo de colores por emoción
      console.log("Orador recibido:", orador);
      const emotionTranslations: { [key: string]: string } = {
        Happiness: 'Felicidad',
        Anger: 'Enojo',
        Sadness: 'Tristeza',
        Fear: 'Miedo',
        Neutral: 'Neutral'
      };

      const emotionColors: { [key: string]: string } = {
        Happiness: '#51cf66',
        Anger: '#ff6b6b',
        Sadness: '#845ef7',
        Fear: '#fd7e14',
        Neutral: '#868e96'
      };

      // Convertir formato del API externo al formato interno
      let emocionesArray = Object.entries(data.emotions).map(([_, value]) => {
        const sentiment = (value as any).sentiment;

        if (sentiment === "unknown") {
          return {
            tipo: 'Desconocido',
            porcentaje: 0,
            color: '#868e96'
          };
        }
        const ret = {
          speaker: (value as any).speaker || 'Desconocido',
          tipo: emotionTranslations[sentiment?.emotion] || 'Desconocido',
          porcentaje: Math.round((sentiment?.probabilities[sentiment.emotion] ?? 0) * 100),
          color: emotionColors[sentiment?.emotion] || '#868e96'
        };

        return ret;
      });

      // Si se pasa un orador, filtrar las emociones únicamente de ese orador
      if (orador) {
        emocionesArray = emocionesArray.filter(e => (e as any).speaker === orador);
      }

      const oradoresDisponibles = Array.from(
        new Set(
          emocionesArray
            .filter(e => 'speaker' in e)
            .map(e => (e as { speaker: any }).speaker)
        )
      ).filter(s => s !== 'Desconocido');
      const emotionsData: EmocionesData = {
        id: data.id || 'external-api-' + Date.now(),
        orador_detectado: 'API Externa',
        precision: 85,
        emociones: emocionesArray,
        oradoresDisponibles,
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
        getEmocionesData(hash);
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
