// Este archivo ahora usa Socket.IO a través del servicio centralizado
// Mantenido para compatibilidad pero deprecated - usar SocketContext y socketService directamente

import type { EmocionesData } from "@/models/emocionesModels";
import { socketService } from '../socketService';

// Interfaz mantenida para referencia histórica - ahora se maneja en Socket.IO
// interface WebSocketEmocionesMessage {
//   type: 'emotions_update' | 'emotions_complete' | 'emotions_error';
//   data: EmocionesData | string;
//   timestamp: string;
// }

/**
 * @deprecated Usar useSocketSubscription('emotions_update', callback) del SocketContext
 */
export function connectEmocionesSocket(
  onUpdate: (data: EmocionesData) => void, 
  onError: (error: string) => void,
  _hash: string
) {
  console.warn('connectEmocionesSocket está deprecated. Usar SocketContext y useSocketSubscription');

  try {
    // Suscribirse a actualizaciones de emociones usando Socket.IO
    const unsubscribeUpdate = socketService.subscribe('emotions_update', (data: EmocionesData) => {
      onUpdate(data);
    });

    const unsubscribeComplete = socketService.subscribe('emotions_complete', (data: EmocionesData) => {
      onUpdate(data);
    });

    const unsubscribeError = socketService.subscribe('emotions_error', (error: string) => {
      onError(error);
    });

    // Retornar función para limpiar todas las suscripciones
    return () => {
      unsubscribeUpdate();
      unsubscribeComplete();
      unsubscribeError();
    };
  } catch (error) {
    console.error('Error al suscribirse a emociones:', error);
    onError('No se pudo conectar al servidor de emociones');
  }
}

/**
 * @deprecated Las conexiones ahora se manejan globalmente através del SocketContext
 */
export function closeEmocionesSocket() {
  console.warn('closeEmocionesSocket está deprecated. Las conexiones se manejan globalmente');
  // No hacer nada, la conexión se maneja globalmente
}

/**
 * @deprecated Usar socketService directamente o través del servicio API
 */
export function sendEmocionesRequest(request: any) {
  console.warn('sendEmocionesRequest está deprecated. Usar socketService o servicios API');
  console.log('Mensaje que debería enviarse:', request);
}

/**
 * @deprecated Usar socketService.isSocketConnected() o el contexto de Socket
 */
export function isEmocionesSocketConnected(): boolean {
  console.warn('isEmocionesSocketConnected está deprecated. Usar SocketContext');
  return socketService.isSocketConnected();
}

/**
 * @deprecated Usar socketService.isSocketConnected() o el contexto de Socket
 */
export function getEmocionesSocketState(): number | null {
  console.warn('getEmocionesSocketState está deprecated. Usar SocketContext');
  return socketService.isSocketConnected() ? 1 : 0; // 1 = OPEN, 0 = CLOSED
}