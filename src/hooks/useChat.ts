import { useState } from 'react';
import { sendChatMessage as sendApiMessage } from '../services/api/chatService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { Message, RelevantDocument } from '../models/chatModels';

interface ChatSocketMessage {
  answer: string;
  question: string;
  case_id: string;
  session_id: string;
  room_id: string;
  relevant_documents: string; // JSON string array
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Suscripción a mensajes de chat en tiempo real
  useSocketSubscription<ChatSocketMessage>('ai_question_complete', (data: ChatSocketMessage) => {
    console.log('💬 Mensaje de chat recibido:', data);

    let parsedDocs: RelevantDocument[] | undefined = undefined;
    if (data.relevant_documents) {
      try {
        // The string might come wrapped in triple backticks and json label; strip them
        const cleaned = data.relevant_documents
          .replace(/^```json\n?/i, '')
          .replace(/```$/i, '')
          .trim();
        const json = JSON.parse(cleaned);
        if (Array.isArray(json)) {
          parsedDocs = json as RelevantDocument[];
        }
      } catch (err) {
        console.warn('No se pudo parsear relevant_documents:', err);
      }
    }

    const botMsg: Message = { text: data.answer, sender: 'bot', relevantDocuments: parsedDocs };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
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

  const sendMessage = async (text: string, audienciaId?: string) => {
    const userMsg: Message = { text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Siempre usar Socket.IO ahora
      if (!audienciaId) {
        console.warn("No se proporcionó audienciaId al enviar el mensaje de chat.");
      }
      else {
        setIsTyping(true);
        sendApiMessage(text, audienciaId);
      }
    } catch (e) {
      const errorMsg: Message = { text: 'Error en el chat', sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
    }
  };

  return { messages, sendMessage, isTyping };
}
