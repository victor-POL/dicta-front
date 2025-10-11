import type { CronologiaResponse } from '../../models/cronologiaModels';
import { socketService } from '../socketService';

export async function getCronologiaData(hash: string): Promise<void> {
  try {
    await socketService.getCronologia(hash);
  } catch (error) {
    console.error('Error fetching cronología:', error);
    throw error;
  }
}
