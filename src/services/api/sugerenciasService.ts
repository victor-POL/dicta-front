import type { SugerenciasResponse } from '../../models/sugerenciasModels';
import { socketService } from '../socketService';

export async function getSugerenciasData(hash: string): Promise<SugerenciasResponse> {
  try {
    const response = await socketService.getSugerencias(hash);
    
    return {
      data: {
        questions: response.data?.questions || [],
        cached: response.data?.cached || false,
        audio_hash: response.data?.audio_hash || hash
      },
      status: 'success'
    };
  } catch (error) {
    console.error('Error fetching sugerencias:', error);
    return {
      data: {
        questions: [],
        cached: false,
        audio_hash: hash
      },
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
