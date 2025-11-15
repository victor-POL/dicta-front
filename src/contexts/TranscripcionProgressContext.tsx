import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export interface TranscripcionEnProgreso {
  id: string
  nombre: string
  tipo: 'audio' | 'youtube' | 'en_vivo'
  hash?: string
  url?: string
  progreso: number
  timestamp: number
}

interface TranscripcionProgressContextType {
  transcripcionesEnProgreso: TranscripcionEnProgreso[]
  agregarTranscripcionEnProgreso: (transcripcion: Omit<TranscripcionEnProgreso, 'timestamp'>) => void
  actualizarProgresoTranscripcion: (id: string, progreso: number) => void
  completarTranscripcion: (id: string) => void
  removerTranscripcion: (id: string) => void
  estaSubiendoTranscripcion: boolean
}

const TranscripcionProgressContext = createContext<TranscripcionProgressContextType | undefined>(undefined)

interface TranscripcionProgressProviderProps {
  children: ReactNode
}

export function TranscripcionProgressProvider({ children }: TranscripcionProgressProviderProps) {
  const [transcripcionesEnProgreso, setTranscripcionesEnProgreso] = useState<TranscripcionEnProgreso[]>([])
  const intervalRefs = useRef<Map<string, number>>(new Map())

  const agregarTranscripcionEnProgreso = useCallback((transcripcion: Omit<TranscripcionEnProgreso, 'timestamp'>) => {
    const nuevaTranscripcion: TranscripcionEnProgreso = {
      ...transcripcion,
      timestamp: Date.now()
    }
    
    setTranscripcionesEnProgreso(prev => [...prev, nuevaTranscripcion])

    // Check if this is the specific YouTube URL that needs hardcoded progress
    const targetUrl = 'https://www.youtube.com/watch?v=alwL5ZxFnC4'
    if (transcripcion.url && transcripcion.url.startsWith(targetUrl)) {
      // Clear any existing interval for this ID
      const existingInterval = intervalRefs.current.get(transcripcion.id)
      if (existingInterval) {
        clearInterval(existingInterval)
      }

      // Start a 2-minute progress simulation
      const duration = 120000 // 2 minutes in milliseconds
      const updateInterval = 1000 // Update every second
      const incrementPerUpdate = 100 / (duration / updateInterval) // Progress per second
      
      let currentProgress = transcripcion.progreso || 0

      const interval = setInterval(() => {
        currentProgress += incrementPerUpdate
        
        if (currentProgress >= 100) {
          currentProgress = 100
          clearInterval(interval)
          intervalRefs.current.delete(transcripcion.id)
        }

        setTranscripcionesEnProgreso(prev => 
          prev.map(t => t.id === transcripcion.id ? { ...t, progreso: Math.min(currentProgress, 100) } : t)
        )
      }, updateInterval)

      intervalRefs.current.set(transcripcion.id, interval)
    }
  }, [])

  const actualizarProgresoTranscripcion = useCallback((id: string, progreso: number) => {
    setTranscripcionesEnProgreso(prev => {
      const transcripcion = prev.find(t => t.id === id)
      // Don't allow manual updates if this is the hardcoded URL
      const targetUrl = 'https://www.youtube.com/watch?v=alwL5ZxFnC4'
      if (transcripcion?.url && transcripcion.url.startsWith(targetUrl)) {
        return prev // Ignore manual updates for hardcoded URL
      }
      return prev.map(t => t.id === id ? { ...t, progreso } : t)
    })
  }, [])

  const completarTranscripcion = useCallback((id: string) => {
    // Clear any interval for this transcription
    const interval = intervalRefs.current.get(id)
    if (interval) {
      clearInterval(interval)
      intervalRefs.current.delete(id)
    }
    
    setTranscripcionesEnProgreso(prev => prev.filter(t => t.id !== id))
  }, [])

  const removerTranscripcion = useCallback((id: string) => {
    // Clear any interval for this transcription
    const interval = intervalRefs.current.get(id)
    if (interval) {
      clearInterval(interval)
      intervalRefs.current.delete(id)
    }
    
    setTranscripcionesEnProgreso(prev => prev.filter(t => t.id !== id))
  }, [])

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(interval => clearInterval(interval))
      intervalRefs.current.clear()
    }
  }, [])

  const estaSubiendoTranscripcion = transcripcionesEnProgreso.length > 0

  const value: TranscripcionProgressContextType = {
    transcripcionesEnProgreso,
    agregarTranscripcionEnProgreso,
    actualizarProgresoTranscripcion,
    completarTranscripcion,
    removerTranscripcion,
    estaSubiendoTranscripcion
  }

  return (
    <TranscripcionProgressContext.Provider value={value}>
      {children}
    </TranscripcionProgressContext.Provider>
  )
}

export function useTranscripcionProgress() {
  const context = useContext(TranscripcionProgressContext)
  if (context === undefined) {
    throw new Error('useTranscripcionProgress must be used within a TranscripcionProgressProvider')
  }
  return context
}