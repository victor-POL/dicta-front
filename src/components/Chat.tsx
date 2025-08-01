import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import './estilos/Chat.css';

export default function Chat({ mode, hash }: { mode: 'api' | 'socket'; hash: string }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage } = useChat(mode, hash);

  const handleSend = () => {
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Escribe un mensaje..."
        />
        <button className="chat-send-btn" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
}
