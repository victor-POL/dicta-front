import type { EmocionesResponse } from "@/models/emocionesModels";

export async function getEmocionesData(hash: string): Promise<EmocionesResponse> {
  try {
    const requestBody = { hash };

    const res = await fetch('http://localhost:4000/api/emotions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Session-Hash': hash
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const payload = data?.data ?? data;
    const topCached = data?.cached ?? payload?.cached ?? false;

    const response = {
      success: true,
      data: {
        id: payload?.id ?? hash,
        orador_detectado: payload?.orador_detectado ?? payload?.speaker_detected ?? 'Desconocido',
        precision: payload?.precision ?? 0,
        emociones: payload?.emociones ?? payload?.emotions ?? [],
        fecha_analisis: payload?.fecha_analisis ?? payload?.analysis_date ?? new Date().toISOString(),
        duracion_audio: payload?.duracion_audio ?? payload?.audio_duration ?? undefined,
        confianza_general: payload?.confianza_general ?? payload?.general_confidence ?? undefined,
        cached: payload?.cached ?? false
      },
      message: data?.message ?? 'Análisis de emociones completado',
      cached: topCached
    };

    return response;
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