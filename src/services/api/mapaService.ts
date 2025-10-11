import type { MapaResponse } from '../../models/mapaModels';
import { socketService } from '../socketService';

export async function getMapaData(hash: string): Promise<void> {
  try {
    await socketService.getMapa(hash);
  } catch (error) {
    console.error('Error fetching mapa:', error);
    throw error;
  }
}
