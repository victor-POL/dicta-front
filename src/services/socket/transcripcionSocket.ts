import type { Segment } from "@/models/transcripcionModels";

interface WebSocketTranscripcionMessage {
  type: 'segment' | 'segments';
  data: Segment | Segment[];
  timestamp: string;
}

let socket: WebSocket | null = null;

export function connectTranscripcionSocket(onMessage: (segment: Segment) => void, hash: string) {
  if (socket) return; // ya está conectado

  socket = new WebSocket(`ws://localhost:5000/transcription/${hash}`);

  socket.onmessage = (event) => {
    const data: WebSocketTranscripcionMessage = JSON.parse(event.data);
    
    if (data.type === 'segments' && Array.isArray(data.data)) {
      // Múltiples segmentos
      data.data.forEach((segment: Segment) => onMessage(segment));
    } else if (data.type === 'segment' && !Array.isArray(data.data)) {
      // Un solo segmento
      onMessage(data.data);
    }
  };

  socket.onopen = () => {
    console.log('Socket de transcripción conectado');
    socket?.send(JSON.stringify({ type: 'auth', hash }));
  };

  socket.onerror = () => {
    console.error('Error en el socket de transcripción');
  };
}

export function closeTranscripcionSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}