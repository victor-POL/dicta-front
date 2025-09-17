export interface ResumenResponse {
  summary: string;
  cached: boolean;
  audio_hash: string;
}

// Deprecated: Mantener por compatibilidad con código existente
export interface ResumenData {
  summary: string;
  cached: boolean;
  audio_hash: string;
}

// Deprecated: Mantener por compatibilidad con código existente
export interface ResumenResponseOld {
  data: ResumenData;
  status: 'success' | 'error' | 'processing';
  message?: string;
}

// Estructura para organizar el contenido del resumen
export interface ResumenSection {
  title: string;
  content: string[];
  subsections?: ResumenSubsection[];
}

export interface ResumenSubsection {
  title: string;
  content: string[];
}

// Para parsear el markdown del resumen
export interface ParsedResumen {
  title: string;
  sections: ResumenSection[];
}
