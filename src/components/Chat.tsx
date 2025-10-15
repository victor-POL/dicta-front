import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
// import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User } from 'lucide-react'

interface ChatProps {
  readonly hash: string
  readonly audienciaId?: string | undefined
}

export default function Chat({ hash: _hash, audienciaId }: ChatProps) {
  const [input, setInput] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const { messages, sendMessage, isTyping } = useChat()

  const handleSend = () => {
    if (input.trim() === '') return
    sendMessage(input, audienciaId)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (isInitialLoad) {
      // Marcar que ya no es la carga inicial después de un breve delay
      const timer = setTimeout(() => setIsInitialLoad(false), 100)
      return () => clearTimeout(timer)
    } else if (messages.length > 0) {
      // Solo hacer scroll automático si no es la carga inicial y hay mensajes
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isInitialLoad])

  const isChatDisabled = !audienciaId

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Área de mensajes */}
      <div className="border rounded-lg overflow-hidden w-full flex-1 min-h-0 mb-3">
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-4">
            {isChatDisabled ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Bot className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Chat no disponible</p>
                  <p className="text-xs">Esta transcripción debe estar vinculada a una audiencia para usar el asistente legal</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Bot className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No hay mensajes aún</p>
                  <p className="text-xs">Escribe algo para comenzar</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, messageIndex) => (
                  <div
                    key={`message-${messageIndex}`}
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
                        className={`rounded-lg px-3 py-2 text-sm break-words overflow-wrap-anywhere hyphens-auto markdown-body ${
                          msg.sender === 'user' ? 'bg-primary text-white' : 'bg-muted text-black'
                        }`}
                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                      >
                        <div className="whitespace-pre-wrap">
                          {msg.text}
                        </div>
                      </div>
                      {msg.sender === 'bot' && msg.relevantDocuments && msg.relevantDocuments.length > 0 && (
                        <div className="mt-2 w-full text-xs text-muted-foreground space-y-1">
                          <p className="font-semibold">Fragmentos relevantes:</p>
                          <ul className="list-decimal pl-4 space-y-1">
                            {msg.relevantDocuments.map((doc, idx) => (
                              <li key={idx}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Emitir evento personalizado para que el panel de transcripción haga scroll y destaque
                                    window.dispatchEvent(new CustomEvent('scroll-to-transcription-fragment', {
                                      detail: { contentPreview: doc.content_preview }
                                    }));
                                  }}
                                  className="text-blue-600 hover:underline text-left"
                                >
                                  #{doc.rank} ({doc.source}) – {doc.content_preview.slice(0, 80)}{doc.content_preview.length > 80 ? '…' : ''}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Indicador de typing */}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-muted">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <div className="rounded-lg px-3 py-2 bg-muted">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Área de entrada */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={isChatDisabled ? "Chat no disponible sin vinculación a audiencia" : "Escribe un mensaje..."}
          className="min-h-[44px] max-h-32 resize-none flex-1"
          rows={1}
          autoFocus={false}
          disabled={isChatDisabled}
        />
        <Button onClick={handleSend} size="icon" disabled={isChatDisabled || !input.trim()} className="h-11 w-11 flex-shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
