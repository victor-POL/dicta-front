import { createContext, useContext, useState, type ReactNode } from 'react'
import type { TranscripcionHistorial } from 'server/models/transcripcionModel'

interface TranscripcionContextType {
  transcripcion: TranscripcionHistorial | undefined
  setTranscripcion: (t: TranscripcionHistorial | undefined) => void
  latestHash: string | undefined
  setLatestHash: (hash: string | undefined) => void
}

const TranscripcionContext = createContext<TranscripcionContextType | undefined>(undefined)

export function useTranscripcionContext() {
  const ctx = useContext(TranscripcionContext)
  if (!ctx) throw new Error('useTranscripcionContext debe usarse dentro de TranscripcionProvider')
  return ctx
}

export function TranscripcionProvider({ children }: { children: ReactNode }) {
  const [transcripcion, setTranscripcion] = useState<TranscripcionHistorial | undefined>(undefined)
  const [latestHash, setLatestHash] = useState<string | undefined>(undefined)
  return (
    <TranscripcionContext.Provider value={{ transcripcion, setTranscripcion, latestHash, setLatestHash }}>
      {children}
    </TranscripcionContext.Provider>
  )
}
