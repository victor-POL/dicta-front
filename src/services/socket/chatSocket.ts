// Este archivo ahora usa Socket.IO a través del servicio centralizado
// Mantenido para compatibilidad pero deprecated - usar SocketContext y socketService directamente

import { socketService } from '../socketService';

/**
 * @deprecated Usar useSocketSubscription('chat_message', callback) del SocketContext
 */
export function connectChatSocket(onMessage: (text: string) => void, _hash: string) {
  console.warn('connectChatSocket está deprecated. Usar SocketContext y useSocketSubscription');
  
  // Suscribirse a mensajes de chat usando Socket.IO
  return socketService.subscribe('chat_message', (data: any) => {
    onMessage(data.reply || data.text);
  });
}

/**
 * @deprecated Usar socketService.sendChatMessage o el servicio de API directamente
 */
export function sendChatMessage(text: string, hash: string) {
  console.warn('sendChatMessage está deprecated. Usar el servicio de API chatService');
  
  // No hacer nada aquí, el envío se maneja ahora através del servicio API
  console.log('Mensaje debería enviarse através del servicio API:', { text, hash });
}
