import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User } from 'lucide-react'

interface ChatProps {
  readonly mode: 'api' | 'socket'
  readonly hash: string
}

export default function Chat({ mode, hash }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const { messages, sendMessage } = useChat(mode, hash)

  const handleSend = () => {
    if (input.trim() === '') return
    sendMessage(input)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full w-full">
      {/* Área de mensajes */}
      <Card className="flex-1 min-h-0 mb-4">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <Bot className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No hay mensajes aún</p>
                    <p className="text-xs">Escribe algo para comenzar</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, messageIndex) => (
                  <div
                    key={`message-${messageIndex}-${msg.text.slice(0, 10)}`}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback
                        className={`${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      >
                        {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>

                    {/* Mensaje */}
                    <div className={`flex flex-col max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-lg px-3 py-2 text-sm break-words overflow-wrap-anywhere hyphens-auto ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                      >
                        {msg.text}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Área de entrada */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="min-h-[44px] max-h-32 resize-none flex-1"
              rows={1}
            />
            <Button onClick={handleSend} size="icon" disabled={!input.trim()} className="h-11 w-11 flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
