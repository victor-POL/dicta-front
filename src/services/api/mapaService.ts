import { socketService } from '../socketService';

export async function getMapaData(hash: string): Promise<any> {
  try {
    return await socketService.getMapa(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en mapa');
  }
}
