export async function sendChatMessage(text: string): Promise<{ reply: string }> {
  const res = await fetch('http://localhost:4000/api/chat', { //ACÁ PONER LA API CORRECTA
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}
