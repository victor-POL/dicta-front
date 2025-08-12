import type { ResumenData } from "@/models/resumenModels";

interface WebSocketResumenMessage {
  type: 'summary_update' | 'summary_complete' | 'summary_error';
  data: ResumenData | string;
  timestamp: string;
}

let socket: WebSocket | null = null;

export function connectResumenSocket(
  onUpdate: (data: ResumenData) => void, 
  onError: (error: string) => void,
  hash: string
) {
  if (socket) return; // ya está conectado

  socket = new WebSocket(`ws://localhost:5001/summary/${hash}`);

  socket.onmessage = (event) => {
    const message: WebSocketResumenMessage = JSON.parse(event.data);
    
    switch (message.type) {
      case 'summary_update':
      case 'summary_complete':
        if (typeof message.data === 'object') {
          onUpdate(message.data as ResumenData);
        }
        break;
      case 'summary_error':
        onError(typeof message.data === 'string' ? message.data : 'Error en el resumen');
        break;
    }
  };

  socket.onopen = () => {
    console.log('Socket de resumen conectado');
    socket?.send(JSON.stringify({ type: 'auth', hash }));
  };

  socket.onerror = (error) => {
    console.error('Error en socket de resumen:', error);
    onError('Error de conexión con el servidor');
  };

  socket.onclose = () => {
    console.log('Socket de resumen desconectado');
    socket = null;
  };
}

export function closeResumenSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function sendResumenRequest(hash: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ 
      type: 'request_summary', 
      hash 
    }));
  }
}
