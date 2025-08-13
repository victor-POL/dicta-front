import type { SugerenciasData } from "@/models/sugerenciasModels";

interface WebSocketSugerenciasMessage {
  type: 'suggestions_update' | 'suggestions_complete' | 'suggestions_error';
  data: SugerenciasData | string;
  timestamp: string;
}

let socket: WebSocket | null = null;

export function connectSugerenciasSocket(
  onUpdate: (data: SugerenciasData) => void, 
  onError: (error: string) => void,
  hash: string
) {
  if (socket) return; // ya está conectado

  socket = new WebSocket(`ws://localhost:5000/suggestions/${hash}`);

  socket.onmessage = (event) => {
    try {
      const message: WebSocketSugerenciasMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'suggestions_update':
        case 'suggestions_complete':
          if (typeof message.data === 'object') {
            onUpdate(message.data as SugerenciasData);
          }
          break;
        case 'suggestions_error':
          onError(typeof message.data === 'string' ? message.data : 'Error en las sugerencias');
          break;
      }
    } catch (parseError) {
      console.error('Error parsing WebSocket message:', parseError);
      onError('Error al procesar mensaje del servidor');
    }
  };

  socket.onopen = () => {
    console.log('Socket de sugerencias conectado');
    socket?.send(JSON.stringify({ type: 'auth', hash }));
  };

  socket.onerror = (error) => {
    console.error('Error en socket de sugerencias:', error);
    const errorMessage = socket?.readyState === WebSocket.CONNECTING 
      ? 'No se pudo conectar al servidor de sugerencias' 
      : 'Error de conexión con el servidor';
    onError(errorMessage);
  };

  socket.onclose = (event) => {
    console.log('Socket de sugerencias desconectado', { code: event.code, reason: event.reason });
    socket = null;
    
    // Informar sobre el motivo del cierre si no fue intencional
    if (event.code !== 1000) { // 1000 = cierre normal
      const reason = event.code === 1006 ? 'Conexión perdida' : `Error ${event.code}: ${event.reason}`;
      onError(`Conexión cerrada: ${reason}`);
    }
  };
}

export function closeSugerenciasSocket() {
  if (socket) {
    socket.close(1000, 'Cliente desconectando'); // Cierre normal
    socket = null;
  }
}

export function sendSugerenciasRequest(hash: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ 
      type: 'request_suggestions', 
      hash 
    }));
    return true;
  } else {
    console.warn('Socket no está conectado, no se puede enviar solicitud');
    return false;
  }
}

// Función para verificar si el socket está conectado
export function isSugerenciasSocketConnected(): boolean {
  return socket !== null && socket.readyState === WebSocket.OPEN;
}

// Función para obtener el estado actual del socket
export function getSugerenciasSocketState(): string {
  if (!socket) return 'DISCONNECTED';
  
  switch (socket.readyState) {
    case WebSocket.CONNECTING: return 'CONNECTING';
    case WebSocket.OPEN: return 'OPEN';
    case WebSocket.CLOSING: return 'CLOSING';
    case WebSocket.CLOSED: return 'CLOSED';
    default: return 'UNKNOWN';
  }
}
