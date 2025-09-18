import type { EmocionesResponse } from "@/models/emocionesModels";
import { socketService } from '../socketService';

export async function getEmocionesData(hash: string): Promise<EmocionesResponse> {
  try {
    // Usar Socket.IO en lugar de fetch
    const response = await socketService.getEmociones(hash);
    
    // Normalizar la respuesta manteniendo la misma estructura
    const payload = response?.data ?? response;
    const topCached = response?.cached ?? payload?.cached ?? false;

    const normalizedResponse = {
      success: true,
      data: {
        id: payload?.id ?? hash,
        orador_detectado: payload?.orador_detectado ?? 'Desconocido',
        precision: payload?.precision ?? 0,
        emociones: payload?.emociones ?? [],
        fecha_analisis: payload?.fecha_analisis ?? new Date().toISOString(),
        duracion_audio: payload?.duracion_audio ?? undefined,
        confianza_general: payload?.confianza_general ?? undefined,
        cached: payload?.cached ?? false
      },
      message: response?.message ?? 'Análisis de emociones completado',
      cached: topCached
    };

    return normalizedResponse;
  } catch (error) {
    const errorResponse = {
      success: false,
      data: {
        id: hash,
        orador_detectado: 'Desconocido',
        precision: 0,
        emociones: [],
        fecha_analisis: new Date().toISOString(),
        cached: false
      },
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
    return errorResponse;
  }
}