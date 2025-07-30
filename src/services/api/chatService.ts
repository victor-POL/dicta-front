import type { ChatResponse } from '../../models/chatModels';

export async function sendChatMessage(text: string): Promise<ChatResponse> {
  const res = await fetch('http://localhost:4000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
