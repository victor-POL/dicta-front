import type { CronologiaResponse } from '../../models/cronologiaModels';
import { socketService } from '../socketService';

export async function getCronologiaData(hash: string): Promise<CronologiaResponse> {
  try {
    return await socketService.getCronologia(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en cronología');
  }
}
