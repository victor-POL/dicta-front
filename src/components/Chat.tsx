import { useState, useRef, useEffect } from 'react';
import './Chat.css';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (input.trim() === '') return;
    const userMsg = { text: input, sender: 'user' } as const;
    setMessages([...messages, userMsg]);
    setInput('');
    setTimeout(() => {
      const botMsg = { text: input, sender: 'bot' } as const;
      setMessages(msgs => [...msgs, botMsg]);
    }, 600); // comentar para API, 600ms de retardo para simular API

    // llamada a la API --------------------------------------------------------------------
    // try {
    //     const response = await fetch('URL_API_MANU', {
    //     method: 'POST',
    //     body: JSON.stringify({ text: input }),
    //     headers: { 'Content-Type': 'application/json' }
    //     });
    //     const data = await response.json();
    //     const botMsg = { text: data.reply, sender: 'bot' } as const;
    //     setMessages(msgs => [...msgs, botMsg]);
    // } catch (error) {
    //     const botMsg = { text: 'Error en la API', sender: 'bot' } as const;
    //     setMessages(msgs => [...msgs, botMsg]);
    // }
        
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">

      <div className="chat-header">
        Chat
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
           className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
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
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Escribe un mensaje..."
        />
        <button className="chat-send-btn" onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}