import type { CronologiaResponse } from '../../models/cronologiaModels';
import { socketService } from '../socketService';

export async function getCronologiaData(hash: string) {
  try {
    socketService.getCronologia(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en cronología');
  }
}
