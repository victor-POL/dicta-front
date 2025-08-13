export interface SugerenciaItem {
  question: string;
  reasoning: string;
}

export interface SugerenciasData {
  questions: SugerenciaItem[];
  cached: boolean;
  audio_hash: string;
}

export interface SugerenciasResponse {
  data: SugerenciasData;
  status: 'success' | 'error' | 'processing';
  message?: string;
}

// Estructura para organizar las sugerencias por categorías
export interface SugerenciaCategoria {
  title: string;
  questions: SugerenciaItem[];
  icon?: string;
}

// Para el análisis de las sugerencias
export interface ParsedSugerencias {
  title: string;
  totalQuestions: number;
  categories: SugerenciaCategoria[];
}
