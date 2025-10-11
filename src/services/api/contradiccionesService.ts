import { socketService } from '../socketService';

export async function getContradiccionesData(hash: string): Promise<void> {
  try {
    console.log('📤 Emitiendo audio_contradictions para hash:', hash);
    await socketService.getContradicciones(hash);
  } catch (error) {
    console.error('Error fetching contradicciones:', error);
    throw error;
  }
}
