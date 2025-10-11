import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface TranscripcionEnProgreso {
  id: string
  nombre: string
  tipo: 'audio' | 'youtube' | 'en_vivo'
  hash?: string
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

  const agregarTranscripcionEnProgreso = useCallback((transcripcion: Omit<TranscripcionEnProgreso, 'timestamp'>) => {
    const nuevaTranscripcion: TranscripcionEnProgreso = {
      ...transcripcion,
      timestamp: Date.now()
    }
    
    setTranscripcionesEnProgreso(prev => [...prev, nuevaTranscripcion])
  }, [])

  const actualizarProgresoTranscripcion = useCallback((id: string, progreso: number) => {
    setTranscripcionesEnProgreso(prev => 
      prev.map(t => t.id === id ? { ...t, progreso } : t)
    )
  }, [])

  const completarTranscripcion = useCallback((id: string) => {
    setTranscripcionesEnProgreso(prev => prev.filter(t => t.id !== id))
  }, [])

  const removerTranscripcion = useCallback((id: string) => {
    setTranscripcionesEnProgreso(prev => prev.filter(t => t.id !== id))
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