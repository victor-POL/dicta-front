import type { MapaResponse } from '../../models/mapaModels';
import { socketService } from '../socketService';

export async function getMapaData(hash: string): Promise<MapaResponse> {
  try {
    return await socketService.getMapa(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en mapa');
  }
}
