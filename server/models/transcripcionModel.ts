import { EstadoCaso, TipoTranscripcion, EstadoTranscripcion } from "./casoModels";

export interface CasoHistorial {
  id: number;
  numero_expediente: string;
  cliente: string;
  fecha_inicio: string;
  descripcion?: string | null;
  estudio_id: number;
  estudio_nombre: string;
  estado: EstadoCaso;
}

export interface AudienciaHistorial {
  id: number;
  titulo: string;
  fecha_hora: string;
  lugar?: string | null;
  descripcion?: string | null;
  expediente_id: number;
}

export interface TranscripcionHistorial {
  id: number;
  hash: string;
  nombre?: string | null;
  tipo: TipoTranscripcion;
  estado: EstadoTranscripcion;
  duracion?: string | null;
  url?: string | null;
  archivo?: string | null;
  fecha_creacion: string;
  audiencia_vinculada?: AudienciaHistorial[];
  expediente_vinculado?: CasoHistorial[];
}