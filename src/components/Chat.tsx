import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import ReactMarkdown from 'react-markdown'
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

  const { messages, sendMessage } = useChat()

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

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Área de mensajes */}
      <div className="border rounded-lg overflow-hidden w-full flex-1 min-h-0 mb-3">
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
                        msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                      style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                    >
                      <ReactMarkdown
                        // Evita que react-markdown introduzca <p> con márgenes excesivos
                        components={{
                          p: ({ node, ...props }) => <p className="m-0 mb-2 last:mb-0 leading-snug" {...props} />,
                          ul: ({ node, ...props }) => <ul className="m-0 mb-2 last:mb-0 list-disc list-inside pl-3" {...props} />,
                          ol: ({ node, ...props }) => <ol className="m-0 mb-2 last:mb-0 list-decimal list-inside pl-3" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1 last:mb-0" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          em: ({ node, ...props }) => <em className="italic" {...props} />,
                          code: ({ node, className, children, ...props }) => {
                            const isInline = !(children && String(children).includes('\n'));
                            if (isInline) {
                              return (
                                <code className="px-1 py-0.5 rounded bg-black/10 text-[0.85em]" {...props}>
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <pre className="my-2 p-2 rounded bg-black/80 text-white overflow-x-auto text-[0.75rem] leading-snug">
                                <code className={className} {...props}>{children}</code>
                              </pre>
                            );
                          },
                          a: ({ node, ...props }) => <a className="underline text-blue-600 hover:text-blue-500" target="_blank" rel="noreferrer" {...props} />,
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-blue-400 pl-2 italic opacity-90 m-0 mb-2" {...props} />,
                          hr: () => <hr className="my-2 border-t border-black/10" />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
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
              ))
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
          placeholder="Escribe un mensaje..."
          className="min-h-[44px] max-h-32 resize-none flex-1"
          rows={1}
          autoFocus={false}
        />
        <Button onClick={handleSend} size="icon" disabled={!input.trim()} className="h-11 w-11 flex-shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
