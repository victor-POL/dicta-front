import { useState } from 'react';
import { sendChatMessage as sendApiMessage } from '../services/api/chatService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { Message } from '../models/chatModels';

interface ChatSocketMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: string;
}

export function useChat(hash: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Suscripción a mensajes de chat en tiempo real
  useSocketSubscription<ChatSocketMessage>('chat_message', (data: ChatSocketMessage) => {
    const botMsg: Message = { text: data.text, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
  }, []);

  // Suscripción a nuevos mensajes desde Postman/API externa
  useSocketSubscription<{sessionId: string, message: {contenido: string, remitente: string}}>('nuevo_mensaje_chat', (data) => {
    if (data.message) {
      const newMessage: Message = { 
        text: data.message.contenido, 
        sender: data.message.remitente === 'user' ? 'user' : 'bot' 
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, []);

  const sendMessage = async (text: string) => {
    const userMsg: Message = { text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Siempre usar Socket.IO ahora
      const data = await sendApiMessage(text, hash);
      const botMsg: Message = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: Message = { text: 'Error en el chat', sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return { messages, sendMessage };
}
