import type { EmocionesResponse } from '../../models/emocionesModels';
import { socketService } from '../socketService';

export async function getAnalisisEmocionesData(hash: string): Promise<EmocionesResponse> {
  try {
    return await socketService.getAnalisisEmociones(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en análisis de emociones');
  }
}
