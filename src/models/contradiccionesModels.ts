export interface ContradiccionItem {
  frase1: string;
  frase2: string;
  descripcion: string;
}

export interface ContradiccionesResponse {
  contradictions: ContradiccionItem[];
  cached: boolean;
  audio_hash: string;
}

// Deprecated: Mantener por compatibilidad con código existente
export interface ContradiccionesData {
  contradictions: ContradiccionItem[];
  cached: boolean;
  audio_hash: string;
}

// Deprecated: Mantener por compatibilidad con código existente
export interface ContradiccionesResponseOld {
  data: ContradiccionesData;
  status: 'success' | 'error' | 'processing';
  message?: string;
}

// Estructura para organizar las contradicciones por categorías
export interface ContradiccionCategoria {
  title: string;
  contradictions: ContradiccionItem[];
  icon?: string;
}

// Para el análisis de las contradicciones
export interface ParsedContradicciones {
  title: string;
  totalContradicciones: number;
  categories: ContradiccionCategoria[];
}