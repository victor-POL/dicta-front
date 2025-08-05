import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranscripcion } from '../hooks/useTranscripcion'
import Resumen from './Resumen'
import './estilos/Transcripcion.css'

interface TranscripcionProps {
  readonly mode?: 'api' | 'socket'
  readonly hash: string
}

export default function Transcripcion({ mode = 'api', hash }: TranscripcionProps) {
  const { segments, loading, error } = useTranscripcion(mode, hash)

  return (
    <Tabs defaultValue="transcripcion" className="w-full h-full flex flex-col">
      <TabsList className="flex-shrink-0">
        <TabsTrigger value="transcripcion">Transcripción</TabsTrigger>
        <TabsTrigger value="resumen">Resumen</TabsTrigger>
      </TabsList>
      <TabsContent value="transcripcion" className="overflow-hidden">
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <div className="transcripcion-scroll h-full overflow-y-auto p-3">
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
      </TabsContent>
      <TabsContent value="resumen" className="overflow-hidden">
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <div className="h-full overflow-y-auto p-3">
            <Resumen />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
