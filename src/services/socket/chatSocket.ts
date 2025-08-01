let socket: WebSocket | null = null;

export function connectChatSocket(onMessage: (text: string) => void, hash: string) {
  if (socket) return; // ya está conectado

  socket = new WebSocket(`ws://localhost:4000/chat/${hash}`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data.reply);
  };

  socket.onopen = () => {
    console.log('Socket conectado');
  };

  socket.onerror = () => {
    console.error('Error en el socket');
  };
}

export function sendChatMessage(text: string, hash: string) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('Socket no conectado');
    return;
  }
  socket.send(JSON.stringify({ text, hash }));
}
