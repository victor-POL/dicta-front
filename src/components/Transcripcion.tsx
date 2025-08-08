import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranscripcion } from '../hooks/useTranscripcion'
import Resumen from './Resumen'
import { useResumen } from '@/hooks/useResumen'
import './estilos/Transcripcion.css'

interface TranscripcionProps {
  readonly mode?: 'api' | 'socket'
  readonly hash: string
}

export default function Transcripcion({ mode = 'api', hash }: TranscripcionProps) {
  const { segments, loading, error } = useTranscripcion(mode, hash)
  const resumen = useResumen(hash)

  return (
    <Tabs defaultValue="transcripcion" className="w-full h-full flex flex-col min-h-0">
      <TabsList className="flex-shrink-0">
        <TabsTrigger value="transcripcion">Transcripción</TabsTrigger>
        <TabsTrigger value="resumen" onClick={() => resumen.requestResumen()}>Resumen</TabsTrigger>
      </TabsList>

      <TabsContent value="transcripcion" className="flex-1 min-h-0 overflow-hidden">
        <div className="border rounded-lg overflow-hidden w-full h-full flex flex-col min-h-0">
          <div className="transcripcion-scroll flex-1 min-h-0 overflow-y-auto p-3">
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

      <TabsContent value="resumen" className="flex-1 min-h-0 overflow-hidden">
        <div className="border rounded-lg overflow-hidden w-full flex-1 flex flex-col min-h-0">
          <div className="h-full min-h-0 overflow-y-auto p-3">
            <Resumen content={resumen.content} loading={resumen.loading} error={resumen.error} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
