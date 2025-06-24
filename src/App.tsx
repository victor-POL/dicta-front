// App.tsx
import { useState, useRef, useEffect } from 'react'
import './App.css'

interface Message {
  id: string
  sender: 'user' | 'bot'
  text: string
}

export default function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: trimmed,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const url = `https://api.funtranslations.com/translate/yoda.json?text=${encodeURIComponent(trimmed)}`

      const res = await fetch(url)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

      const data: {
        contents: { translated: string }
      } = await res.json()

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: data.contents.translated,
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: `⚠️ Problema: ${(err as Error).message}`,
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <h2>Chatbot API</h2>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handleSend()
          }
        }}
        placeholder="Escribe un texto y presiona Ctrl+Enter…"
      />

      <button type="button" onClick={handleSend} disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar'}
      </button>
    </div>
  )
}
