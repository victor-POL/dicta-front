import { useState, useEffect } from 'react';
import type { EmocionesData, ParsedEmociones } from '@/models/emocionesModels';
import { getEmocionesData } from '@/services/api/emocionesService';
import { connectEmocionesSocket, closeEmocionesSocket } from '@/services/socket/emocionesSocket';

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

export function useEmociones(mode: 'api' | 'socket', hash: string) {
  const [emocionesData, setEmocionesData] = useState<EmocionesData | null>(null);
  const [parsedEmociones, setParsedEmociones] = useState<ParsedEmociones | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isReady = parsedEmociones !== null && !loading;

  console.log('🔄 Hook useEmociones - Estado actual:', {
    mode,
    hash,
    loading,
    error,
    hasData: !!emocionesData,
    hasParsed: !!parsedEmociones,
    isReady
  });

  useEffect(() => {
    console.log(`🚀 Iniciando carga de emociones en modo ${mode} para hash: ${hash}`);
    
    if (mode === 'api') {
      console.log('📡 Llamando a API de emociones...');
      getEmocionesData(hash)
        .then(response => {
          console.log('📥 Respuesta de API recibida:', response);
          if (response.success && response.data) {
            console.log('✅ Datos válidos recibidos, parseando...');
            setEmocionesData(response.data);
            setParsedEmociones(parseEmocionesData(response.data));
            setError(null);
          } else {
            console.log('❌ Error en respuesta de API:', response.message);
            setError(response.message || 'Error al cargar datos de emociones');
          }
        })
        .catch(err => {
          console.log('💥 Error en llamada a API:', err);
          setError(err.message || 'Error al cargar análisis de emociones');
        })
        .finally(() => {
          console.log('🏁 Finalizando carga de API');
          setLoading(false);
        });
    } else if (mode === 'socket') {
      console.log('🔌 Iniciando conexión WebSocket...');
      const connectionTimeout = setTimeout(() => {
        console.log('⏰ Timeout de conexión WebSocket');
        setError('Timeout: No se pudo conectar al servidor de emociones');
        setLoading(false);
      }, 10000);

      connectEmocionesSocket(
        (data: EmocionesData) => {
          console.log('📨 Datos recibidos por WebSocket:', data);
          clearTimeout(connectionTimeout);
          setEmocionesData(data);
          setParsedEmociones(parseEmocionesData(data));
          setLoading(false);
          setError(null);
        },
        (errorMessage: string) => {
          console.log('❌ Error en WebSocket:', errorMessage);
          clearTimeout(connectionTimeout);
          setError(errorMessage);
          setLoading(false);
        },
        hash
      );

      return () => {
        clearTimeout(connectionTimeout);
        closeEmocionesSocket();
      };
    }
  }, [mode, hash]);

  return { emocionesData, parsedEmociones, loading, error, isReady };
}