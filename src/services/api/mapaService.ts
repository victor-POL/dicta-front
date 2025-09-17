import type { MapaResponse } from '../../models/mapaModels';
import { socketService } from '../socketService';

export async function getMapaData(hash: string) {
  try {
    socketService.getMapa(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en mapa');
  }
}
