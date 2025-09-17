import { socketService } from '../socketService';

export async function getSugerenciasData(hash: string) {
  try {
    socketService.getSugerencias(hash);
  } catch (error) {
    console.error('Error fetching sugerencias:', error);
    return {
      data: {
        questions: [],
        cached: false,
        audio_hash: hash
      },
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
