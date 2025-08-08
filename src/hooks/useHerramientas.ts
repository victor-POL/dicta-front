import { useCallback, useEffect, useState } from 'react'
import { getSocket } from '@/services/socket/ioClient'

export interface DiagramData {
  timelineData: string
  mindMapData: string
  loading: boolean
  error: string | null
}

export function useHerramientas(hash: string) {
  const [diagramData, setDiagramData] = useState<DiagramData>({
    timelineData: '',
    mindMapData: '',
    loading: false,
    error: null,
  })

  // Request timeline; attach one-time success listener
  const requestTimeline = useCallback(() => {
    if (!hash) return
    const socket = getSocket()
    setDiagramData((prev) => ({ ...prev, loading: true, error: null }))

    const onSuccess = (payload: unknown) => {
      try {
        let content = ''
        if (typeof payload === 'string') content = payload
        else if (payload && typeof payload === 'object') {
          const p: any = payload
          // Expected: { mermaid_timeline: { mermaid_code: string }, ... }
          content = p?.mermaid_timeline?.mermaid_code || ''
        }
        setDiagramData((prev) => ({ ...prev, timelineData: content, loading: false }))
      } catch (e) {
        setDiagramData((prev) => ({ ...prev, loading: false, error: 'Error al procesar la línea de tiempo' }))
      }
    }

    socket.once('audio_timeline_success', onSuccess)

    const emit = () => socket.emit('audio_timeline', { audio_hash: hash, hash })
    if (socket.connected) emit()
    else socket.once('connect', emit)
  }, [hash])

  // Request mind map; attach one-time success listener
  const requestMindMap = useCallback(() => {
    if (!hash) return
    const socket = getSocket()
    setDiagramData((prev) => ({ ...prev, loading: true, error: null }))

    const onSuccess = (payload: unknown) => {
      try {
        let content = ''
        if (typeof payload === 'string') content = payload
        else if (payload && typeof payload === 'object') {
          const p: any = payload
          // Expected: { mermaid_mindmap: { mermaid_code: string }, ... }
          content = p?.mermaid_mindmap?.mermaid_code || ''
        }
        setDiagramData((prev) => ({ ...prev, mindMapData: content, loading: false }))
      } catch (e) {
        setDiagramData((prev) => ({ ...prev, loading: false, error: 'Error al procesar el mapa mental' }))
      }
    }

    socket.once('audio_mindmap_success', onSuccess)

    const emit = () => socket.emit('audio_mindmap', { audio_hash: hash, hash })
    if (socket.connected) emit()
    else socket.once('connect', emit)
  }, [hash])

  // Optional: detach on unmount to avoid stray handlers if any were left
  useEffect(() => {
    const socket = getSocket()
    return () => {
      socket.off('audio_timeline_success')
      socket.off('audio_mindmap_success')
    }
  }, [])

  return { ...diagramData, requestTimeline, requestMindMap }
}
