import { useState } from 'react';
import { sendChatMessage as sendApiMessage } from '../services/api/chatService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { Message } from '../models/chatModels';

interface ChatSocketMessage {
  answer: string;
  question: string;
  case_id: string;
  session_id: string;
  room_id: string;
}

export function useChat(hash: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Suscripción a mensajes de chat en tiempo real
  useSocketSubscription<ChatSocketMessage>('ai_question_complete', (data: ChatSocketMessage) => {
    console.log('💬 Mensaje de chat recibido:', data);
    const botMsg: Message = { text: data.answer, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
  }, []);

  // // Suscripción a nuevos mensajes desde Postman/API externa
  // useSocketSubscription<{sessionId: string, message: {contenido: string, remitente: string}}>('nuevo_mensaje_chat', (data) => {
  //   if (data.message) {
  //     const newMessage: Message = { 
  //       text: data.message.contenido, 
  //       sender: data.message.remitente === 'user' ? 'user' : 'bot' 
  //     };
  //     setMessages(prev => [...prev, newMessage]);
  //   }
  // }, []);

  const sendMessage = async (text: string) => {
    const userMsg: Message = { text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Siempre usar Socket.IO ahora
      sendApiMessage(text, "01111194-b5b4-44b5-9056-bd3dc5d23256");
    } catch (e) {
      const errorMsg: Message = { text: 'Error en el chat', sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return { messages, sendMessage };
}
