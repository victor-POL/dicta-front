import { useTranscripcion } from '../hooks/useTranscripcion'
import Resumen from './Resumen'
import './estilos/Transcripcion.css'
import { useEffect, useRef, useCallback } from 'react'

interface TranscripcionProps {
  readonly hash: string
  readonly activeTab?: string
}

export default function Transcripcion({ hash, activeTab = 'transcripcion' }: TranscripcionProps) {
  const { segments, error } = useTranscripcion(hash)

  // Map of segment id to ref for scrolling
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const registerSegmentRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (!el) {
      segmentRefs.current.delete(id)
    } else {
      segmentRefs.current.set(id, el)
    }
  }, [])

  // Auto-scroll to bottom on new segments with smooth animation
  const scrollRef = scrollContainerRef
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

  // Listen for custom events to scroll to a fragment
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ contentPreview: string }>
      const preview = custom.detail?.contentPreview
      if (!preview) return

      // Find first segment whose text appears inside the preview (or vice versa)
      const target = segments.find(seg =>
        preview.includes(seg.text.slice(0, 20)) || seg.text.includes(preview.slice(0, 20))
      )
      if (!target) return
      const el = segmentRefs.current.get(target.id)
      if (el && scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const top = el.offsetTop - 16 // small offset
        container.scrollTo({ top, behavior: 'smooth' })
        // Apply highlight class
        el.classList.add('transcripcion-highlight')
        setTimeout(() => el.classList.remove('transcripcion-highlight'), 4000)
      }
    }
    window.addEventListener('scroll-to-transcription-fragment', handler as EventListener)
    return () => window.removeEventListener('scroll-to-transcription-fragment', handler as EventListener)
  }, [segments])

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {activeTab === 'transcripcion' && (
        <div className="flex-1 overflow-hidden min-h-0 animate-in fade-in-0 duration-300">
          <div className="border rounded-lg overflow-hidden w-full h-full">
              <div
                ref={scrollRef}
                className="transcripcion-scroll h-full overflow-y-auto p-3"
              >
                {error && <div className="transcripcion-error">{error}</div>}
                {segments.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="text-muted-foreground">Esperando transcripción...</span>
                    </div>
                  </div>
                ) : (
                  segments.map((segment) => (
                    <div
                      key={segment.id}
                      ref={(el) => registerSegmentRef(segment.id, el)}
                      className="transcripcion-msg"
                      data-segment-id={segment.id}
                    >
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
        <div className="flex-1 overflow-hidden min-h-0 animate-in fade-in-0 duration-300">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Resumen hash={hash} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
