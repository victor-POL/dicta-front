import { createContext, useContext, useState, type ReactNode } from 'react'
import type { TranscripcionHistorial } from 'server/models/transcripcionModel'

interface TranscripcionContextType {
  transcripcion: TranscripcionHistorial | undefined
  setTranscripcion: (t: TranscripcionHistorial | undefined) => void
}

const TranscripcionContext = createContext<TranscripcionContextType | undefined>(undefined)

export function useTranscripcionContext() {
  const ctx = useContext(TranscripcionContext)
  if (!ctx) throw new Error('useTranscripcionContext debe usarse dentro de TranscripcionProvider')
  return ctx
}

export function TranscripcionProvider({ children }: { children: ReactNode }) {
  const [transcripcion, setTranscripcion] = useState<TranscripcionHistorial | undefined>(undefined)
  return (
    <TranscripcionContext.Provider value={{ transcripcion, setTranscripcion }}>
      {children}
    </TranscripcionContext.Provider>
  )
}
