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

  // Auto-scroll to bottom on new segments
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [segments])

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {activeTab === 'transcripcion' && (
        <div className="flex-1 overflow-hidden min-h-0">
          {/* Usar el alto del panel (no fijo) y hacer scroll interno */}
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div
              ref={scrollRef}
              className="transcripcion-scroll h-full overflow-y-auto p-3"
            >
              {error && <div className="transcripcion-error">{error}</div>}
              {loading && <div className="transcripcion-loading">Cargando...</div>}
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
        </div>
      )}

      {activeTab === 'resumen' && (
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Resumen />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
