import type { SugerenciasResponseOld } from '../../models/sugerenciasModels';
import { socketService } from '../socketService';

export async function getSugerenciasData(hash: string): Promise<SugerenciasResponseOld> {
  try {
    const response = await socketService.getSugerencias(hash);
    
    return {
      data: {
        questions: response.questions || [],
        cached: response.cached || false,
        audio_hash: response.audio_hash || hash
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
