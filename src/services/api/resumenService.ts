import type { ResumenResponseOld } from '../../models/resumenModels';
import { socketService } from '../socketService';

export async function getResumenData(hash: string) {
  try {
    socketService.getResumen(hash);
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
