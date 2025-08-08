import type { ChatResponse } from '../../models/chatModels';

export async function sendChatMessage(text: string, hash: string): Promise<ChatResponse> {
  const res = await fetch('http://localhost:4000/api/chat', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Session-Hash': hash // O como header
    },
  body: JSON.stringify({ text, hash, case_name: hash }), // O en el body
  });
  return res.json();
}
