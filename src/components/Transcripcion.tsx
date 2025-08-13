import { useTranscripcion } from '../hooks/useTranscripcion'
import Resumen from './Resumen'
import './estilos/Transcripcion.css'
import { useEffect, useRef } from 'react'

interface TranscripcionProps {
  readonly mode?: 'api' | 'socket'
  readonly hash: string
  readonly activeTab?: string
}

export default function Transcripcion({ mode = 'api', hash, activeTab = 'transcripcion' }: TranscripcionProps) {
  const { segments, loading, error } = useTranscripcion(mode, hash)

  // Auto-scroll to bottom on new segments with smooth animation
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current && segments.length > 0) {
      const element = scrollRef.current
      // Usar scrollTo con behavior smooth para animación suave
      requestAnimationFrame(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'smooth'
        })
      })
    }
  }, [segments])

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {activeTab === 'transcripcion' && (
        <div className="flex-1 overflow-hidden min-h-0 animate-in fade-in-0 duration-300">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">
                  {mode === 'socket' ? 'Conectando al servidor...' : 'Cargando transcripción...'}
                </span>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden w-full h-full">
              <div
                ref={scrollRef}
                className="transcripcion-scroll h-full overflow-y-auto p-3"
              >
                {error && <div className="transcripcion-error">{error}</div>}
                {segments.length === 0 && !loading ? (
                  <div className="no-segments">No hay transcripciones disponibles</div>
                ) : (
                  segments.map((segment) => (
                    <div key={segment.id} className="transcripcion-msg">
                      <div>
                        <span className="transcripcion-time">[{segment.start}]</span>{' '}
                        <span className="transcripcion-speaker">{segment.speaker}</span>
                      </div>
                      <div className="transcripcion-text">{segment.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'resumen' && (
        <div className="flex-1 overflow-hidden min-h-0 animate-in fade-in-0 duration-300">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Resumen mode={mode} hash={hash} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
