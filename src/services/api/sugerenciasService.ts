import { socketService } from '../socketService';

export async function getSugerenciasData(hash: string): Promise<void> {
  try {
    await socketService.getSugerencias(hash);
  } catch (error) {
    console.error('Error fetching sugerencias:', error);
    throw error;
  }
}
