import { useEffect, useState } from 'react';
import { sendChatMessage as sendApiMessage } from '../services/api/chatService';
import type { Message as BaseMessage } from '../models/chatModels';

type Message = BaseMessage & { streaming?: boolean }
import { getSocket } from '@/services/socket/ioClient';
import { getCaseId } from '@/services/sessionStore';

export function useChat(mode: 'api' | 'socket', hash: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (mode === 'socket') {
      const socket = getSocket()

      const onChunk = (data: any) => {
        const chunk = typeof data === 'string' ? data : data?.text || data?.chunk || ''
        if (!chunk) return
        setMessages((prev) => {
          const copy = [...prev]
          const last = copy[copy.length - 1]
          if (last && last.sender === 'bot' && last.streaming) {
            last.text += chunk
            return [...copy]
          }
          return [...copy, { text: chunk, sender: 'bot', streaming: true } as any]
        })
      }

      const onDone = () => {
        setMessages((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)))
      }

      socket.on('ai_question_chunk', onChunk)
      socket.on('ai_question_done', onDone)

      return () => {
        socket.off('ai_question_chunk', onChunk)
        socket.off('ai_question_done', onDone)
      }
    }
  }, [mode])

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
  const socket = getSocket()
  const case_id = getCaseId(hash) || hash
  const emit = () => socket.emit('ai_ask_question', { case_id, question: text })
      if (socket.connected) emit()
      else socket.once('connect', emit)
    }
  };

  return { messages, sendMessage };
}
