import type { TranscripcionResponse } from '../../models/transcripcionModels';
import { socketService } from '../socketService';

export async function getTranscripcionMessages(hash: string): Promise<TranscripcionResponse> {
  try {
    return await socketService.getTranscripcion(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en la transcripción');
  }
}