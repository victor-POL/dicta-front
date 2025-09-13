import type { ChatResponse } from '../../models/chatModels';
import { socketService } from '../socketService';

export async function sendChatMessage(text: string, hash: string): Promise<ChatResponse> {
  try {
    return await socketService.sendChatMessage(text, hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en el chat');
  }
}
