// ============================================
// Interfaces para consulta completa de casos
// ============================================

// Type aliases para valores enumerados
export type EstadoCaso = 'activo' | 'cerrado' | 'suspendido';
export type TipoTranscripcion = 'audio' | 'youtube' | 'realtime' | 'en_vivo';
export type EstadoTranscripcion = 'pendiente' | 'procesado' | 'error';

export interface CasoRequest {
  numero: string;
  cliente: string;
  fecha_inicio: string; // YYYY-MM-DD format
  descripcion?: string | null;
}

export interface CasoCreado {
  id: number;
  numero: string;
  cliente: string;
  fecha_inicio: string; // YYYY-MM-DD format
  descripcion?: string | null;
  estado: EstadoCaso;
  estudio_id: number;
}

export interface Caso {
  id: number;
  numero_expediente: string;
  cliente: string;
  fecha_inicio: string;
  descripcion?: string | null;
  estudio_id: number;
  estudio_nombre: string;
  estado: EstadoCaso;
  audiencias: Audiencia[];
}

export interface Audiencia {
  id: number;
  titulo: string;
  fecha_hora: string;
  lugar?: string | null;
  descripcion?: string | null;
  expediente_id: number;
  transcripciones: Transcripcion[];
}

export interface Transcripcion {
  id: number;
  hash: string;
  nombre?: string | null;
  tipo: TipoTranscripcion;
  estado: EstadoTranscripcion;
  duracion?: string | null;
  url?: string | null;
  archivo?: string | null;
  fecha_creacion: string;
  audiencia_id: number;
  expediente_id?: number | null;
}

// ============================================
// Validaciones
export const isValidCaso = (data: CasoRequest): boolean => {
  return Boolean(
    data.numero &&
    data.numero.trim().length > 0 &&
    data.numero.trim().length <= 50 &&
    data.cliente &&
    data.cliente.trim().length > 0 &&
    data.cliente.trim().length <= 200 &&
    data.fecha_inicio &&
    isValidDate(data.fecha_inicio)
  );
};

export const isValidEquipoForCase = (equipo: string): boolean => {
  return Boolean(
    equipo &&
    equipo.trim().length > 0
  );
};

// Helper para validar formato de fecha
const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date.getTime());
};