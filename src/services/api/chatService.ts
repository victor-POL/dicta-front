import { socketService } from '../socketService';

export async function sendChatMessage(text: string, case_id: string) {
  try {
    socketService.sendChatMessage(text, case_id);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en el chat');
  }
}
