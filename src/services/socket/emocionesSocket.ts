import type { EmocionesData } from "@/models/emocionesModels";

interface WebSocketEmocionesMessage {
  type: 'emotions_update' | 'emotions_complete' | 'emotions_error';
  data: EmocionesData | string;
  timestamp: string;
}

let socket: WebSocket | null = null;

export function connectEmocionesSocket(
  onUpdate: (data: EmocionesData) => void, 
  onError: (error: string) => void,
  hash: string
) {
  if (socket) return;

  try {
    socket = new WebSocket(`ws://localhost:5000/emotions/${hash}`);

    socket.onmessage = (event) => {
      try {
        const message: WebSocketEmocionesMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'emotions_update':
          case 'emotions_complete':
            if (typeof message.data !== 'string') {
              onUpdate(message.data);
            }
            break;
          case 'emotions_error':
            onError(typeof message.data === 'string' ? message.data : 'Error en el análisis de emociones');
            break;
        }
      } catch (parseError) {
        console.error('Error al parsear mensaje de emociones:', parseError);
        onError('Error al procesar datos de emociones');
      }
    };

    socket.onerror = (error) => {
      console.error('Error en socket de emociones:', error);
      onError('Error de conexión con el servidor de emociones. Verifica que el servidor esté ejecutándose.');
    };

    socket.onclose = (event) => {
      console.log('Socket de emociones cerrado:', event.code, event.reason);
      socket = null;
    };

  } catch (error) {
    console.error('Error al crear socket de emociones:', error);
    onError('No se pudo establecer conexión WebSocket');
  }
}

export function closeEmocionesSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function sendEmocionesRequest(request: any) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(request));
  }
}

export function isEmocionesSocketConnected(): boolean {
  return socket !== null && socket.readyState === WebSocket.OPEN;
}

export function getEmocionesSocketState(): number | null {
  return socket?.readyState ?? null;
}