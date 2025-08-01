import { useEffect, useState } from 'react';
import { sendChatMessage as sendApiMessage } from '../services/api/chatService';
import { connectChatSocket, sendChatMessage as sendSocketMessage } from '../services/socket/chatSocket';
import type { Message } from '../models/chatModels';

export function useChat(mode: 'api' | 'socket', hash: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (mode === 'socket') {
      connectChatSocket((replyText) => {
        setMessages(prev => [...prev, { text: replyText, sender: 'bot' }]);
      }, hash);
    }
  }, [mode, hash]);

  const sendMessage = async (text: string) => {
    const userMsg: Message = { text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    if (mode === 'api') {
      try {
        const data = await sendApiMessage(text, hash);
        const botMsg: Message = { text: data.reply, sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
      } catch (e) {
        const errorMsg: Message = { text: 'Error en la API', sender: 'bot' };
        setMessages(prev => [...prev, errorMsg]);
      }
    } else {
      sendSocketMessage(text, hash);
    }
  };

  return { messages, sendMessage };
}
