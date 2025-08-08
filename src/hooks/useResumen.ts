import { useCallback, useEffect, useState } from 'react'
import { getSocket } from '@/services/socket/ioClient'

export function useResumen(hash: string) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestResumen = useCallback(() => {
    if (!hash) return
    const socket = getSocket()
    setLoading(true)
    setError(null)

    const onSuccess = (payload: unknown) => {
      try {
        let text = ''
        if (typeof payload === 'string') text = payload
        else if (payload && typeof payload === 'object') {
          const p: any = payload
          text = p.summary || p.text || p.data || ''
        }
        setContent(text)
      } catch (e) {
        setError('Error al procesar el resumen')
      } finally {
        setLoading(false)
      }
    }

    const onError = () => {
      setError('Error en el resumen')
      setLoading(false)
    }

    socket.once('audio_summarize_success', onSuccess)
    socket.once('error', onError)

    const emit = () => socket.emit('audio_summarize', { audio_hash: hash, hash })
    if (socket.connected) emit()
    else socket.once('connect', emit)
  }, [hash])

  useEffect(() => {
    const socket = getSocket()
    return () => {
      socket.off('audio_summarize_success')
      socket.off('error')
    }
  }, [])

  return { content, loading, error, requestResumen }
}
