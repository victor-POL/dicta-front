import { EstadoCaso, TipoTranscripcion, EstadoTranscripcion } from "./casoModels";

export interface VinculacionTranscripcionRequest {
  transcripcionId: number
  audienciaId: number
}


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

const hardcodedNames: Record<string, string> = {
  "https://www.youtube.com/watch?v=s1xTNqNCm9c": "Alegato Querella CFK",
  "https://www.youtube.com/watch?v=G29eRY_xuW0": "Alegato Fiscalía",
  "https://www.youtube.com/watch?v=y3jkKQirDjU": "Alegato Defensa Sabag Montiel",
  "https://www.youtube.com/watch?v=LuvUKJUtb5o": "Alegato Defensa Carrizo y Defensa Brenda Uliarte",
  "https://www.youtube.com/watch?v=alwL5ZxFnC4": "TOCF N°6 - Causa Sabag Montiel",
  "https://www.youtube.com/watch?v=alwL5ZxFnC4&list=PLOBlyC5cDroE_fNXbg2GiLUN8yn76_or5": "TOCF N°6 - Causa Sabag Montiel",
  "https://www.youtube.com/watch?v=f15Xu0d_6Lw": "Testimonio Cristina Fernández de Kirchner"
}

export function obtenerNombreHardcodead(transcripcionHistorial: TranscripcionHistorial): string {
  const url = transcripcionHistorial.url ?? undefined;
  console.log(url);
  return (url && hardcodedNames[url]) || transcripcionHistorial.nombre || "";
}
