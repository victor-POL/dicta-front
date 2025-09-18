export interface EmocionData {
  tipo: string;
  porcentaje: number;
  color: string;
  descripcion?: string;
}

export interface EmocionesData {
  id: string;
  orador_detectado: string;
  precision: number;
  emociones: EmocionData[];
  fecha_analisis: string;
  duracion_audio?: number;
  confianza_general?: number;
  cached?: boolean;
}

export interface EmocionesResponse {
  success: boolean;
  data: EmocionesData;
  message?: string;
  cached?: boolean;
}

export interface ParsedEmociones {
  oradorDetectado: string;
  precision: number;
  emocionPrincipal: EmocionData;
  todasLasEmociones: EmocionData[];
  fechaAnalisis: string;
  duracionAudio?: number;
  confianzaGeneral?: number;
  cached?: boolean;
}