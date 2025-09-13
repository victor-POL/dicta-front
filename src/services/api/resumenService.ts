import type { ResumenResponseOld } from '../../models/resumenModels';
import { socketService } from '../socketService';

export async function getResumenData(hash: string): Promise<ResumenResponseOld> {
  try {
    const response = await socketService.getResumen(hash);
    
    return {
      data: {
        summary: response.summary || '',
        cached: response.cached || false,
        audio_hash: response.audio_hash || hash
      },
      status: 'success'
    };
  } catch (error) {
    console.error('Error fetching resumen:', error);
    return {
      data: {
        summary: '',
        cached: false,
        audio_hash: hash
      },
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
