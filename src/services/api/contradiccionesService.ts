import { socketService } from '../socketService';

export async function getContradiccionesData(hash: string): Promise<any> {
  try {
    return await socketService.getContradicciones(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en contradicciones');
  }
}
