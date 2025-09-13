import type { ResumenResponse } from '../../models/resumenModels';
import { socketService } from '../socketService';

export async function getResumenData(hash: string): Promise<ResumenResponse> {
  try {
    const response = await socketService.getResumen(hash);
    
    return {
      data: {
        summary: response.data?.summary || '',
        cached: response.data?.cached || false,
        audio_hash: response.data?.audio_hash || hash
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
