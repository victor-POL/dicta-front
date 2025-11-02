import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import Transcripcion from './Transcripcion'
import Herramientas from './Herramientas'
import Chat from './Chat'
import { 
  IconArrowsMaximize, 
  IconArrowsMinimize,
  IconTimeline,
  IconSitemap,
  IconMessageQuestion,
  IconAlertTriangle,
  IconMoodSmile,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAutoConnect } from '@/contexts/SocketContext'
import { useTranscripcionContext } from '@/contexts/TranscripcionContext'
import { Button } from '@/components/ui/button'
import { useCrearTranscripcionAudio } from '@/hooks/useTranscripciones'

function Paneles() {
  const [minTranscripcion, setMinTranscripcion] = useState(false)
  const [minHerramientas, setMinHerramientas] = useState(false)
  const [minChat, setMinChat] = useState(false)
  const [activeTab, setActiveTab] = useState('transcripcion')
  const [activeHerramientasTab, setActiveHerramientasTab] = useState('timeline')

  // Recuperar el objeto transcripcion pasado vía estado de la ruta
  const location = useLocation()
  const transcripcion = location.state?.transcripcion
  // Fallbacks para hash y audienciaId si no hay objeto
  const sessionHash = transcripcion?.hash || location.state?.hash || ''
  const audienciaId = transcripcion?.audiencia_vinculada?.[0]?.id || location.state?.audienciaId
  const isRecording = Boolean(location.state?.isRecording)
  const isLiveSession = sessionHash.startsWith('live')
  const crearTranscripcionAudioMutation = useCrearTranscripcionAudio()
  const recordingStartRef = useRef<number | null>(null)
  const [recordingStopped, setRecordingStopped] = useState(() => !isRecording)

  // Actualizar el contexto global si hay transcripcion o si es una sesión en vivo
  const { setTranscripcion, latestHash } = useTranscripcionContext()
  console.log(transcripcion)
  useEffect(() => {
    if (transcripcion) {
      setTranscripcion(transcripcion)
    } else if (sessionHash.startsWith('live_')) {
      setTranscripcion({
        id: -1,
        hash: sessionHash,
        tipo: 'en_vivo',
        estado: 'pendiente',
        nombre: 'Transcripción en Vivo',
        duracion: null,
        url: null,
        archivo: null,
        fecha_creacion: new Date().toISOString(),
        audiencia_vinculada: [],
        expediente_vinculado: [],
      })
    }
    return () => setTranscripcion(undefined)
  }, [transcripcion, setTranscripcion, sessionHash])

  // Track when a live session starts to estimate duration on stop.
  useEffect(() => {
    if (isLiveSession) {
      if (isRecording) {
        recordingStartRef.current = recordingStartRef.current ?? Date.now()
        setRecordingStopped(false)
      } else {
        recordingStartRef.current = null
        setRecordingStopped(true)
      }
    } else {
      recordingStartRef.current = null
      setRecordingStopped(true)
    }
  }, [isLiveSession, isRecording])

  const handleStopRecording = () => {
    if (!isLiveSession || crearTranscripcionAudioMutation.isPending) {
      return
    }

    const startedAt = recordingStartRef.current ?? Date.now()
    const durationSeconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000))
    const timeStamp = new Date().toISOString().replace(/[:.]/g, '-')
    const nombreArchivo = `live-session-${timeStamp}.mp3`
    
    // Use the latest hash if available, otherwise fall back to sessionHash
    const hashToUse = latestHash || sessionHash

    crearTranscripcionAudioMutation.mutate(
      { nombreaArchivo: nombreArchivo, hash: hashToUse, duracion: durationSeconds },
      {
        onSuccess: () => {
          setRecordingStopped(true)
          window.location.href = '/transcripciones'
        },
        onError: (error) => {
          console.error('Error registrando transcripción en vivo:', error)
        }
      }
    )
  
  }



  // Conectar automáticamente al socket
  useAutoConnect(sessionHash)

  const renderPanel = (titulo: string, minimizado: boolean, onMinToggle: () => void, contenido: React.ReactNode) => (
    <Card
      className={`${
        minimizado 
          ? 'w-16 h-auto flex-shrink-0' 
          : 'flex-1 min-w-0 min-w-[300px] h-full'
      } transition-all duration-300 flex flex-col overflow-hidden`}
    >
      <CardHeader
        className={`${minimizado ? 'p-2 flex justify-center' : 'flex flex-row items-center justify-between space-y-0 min-w-0'} flex-shrink-0`}
      >
        {!minimizado && titulo !== 'Grabación' && titulo !== 'Herramientas' && <h3 className="font-bold truncate pr-2 min-w-0 texto-azul">{titulo}</h3>}
        {!minimizado && titulo === 'Grabación' && (
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex-shrink-0">
                <TabsTrigger value="transcripcion">Transcripción</TabsTrigger>
                <TabsTrigger value="resumen">Resumen</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        {!minimizado && titulo === 'Herramientas' && (
          <div className="flex-1">
            <Tabs value={activeHerramientasTab} onValueChange={setActiveHerramientasTab} className="w-full">
              <TabsList className="flex-shrink-0">
                <TabsTrigger value="timeline" title="Línea de tiempo" className="group relative">
                  <IconTimeline size={18} />
                  
                </TabsTrigger>
                <TabsTrigger value="mindmap" title="Mapa conceptual" className="group relative">
                  <IconSitemap size={18} />
                  
                </TabsTrigger>
                <TabsTrigger value="sugerencias" title="Sugerencias" className="group relative">
                  <IconMessageQuestion size={18} />
                  
                </TabsTrigger>
                <TabsTrigger value="contradicciones" title="Contradicciones" className="group relative">
                  <IconAlertTriangle size={18} />
                  
                </TabsTrigger>
                <TabsTrigger value="emociones" title="Análisis de emociones" className="group relative">
                  <IconMoodSmile size={18} />
                  
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        <button
          type="button"
          className="p-1 hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors flex-shrink-0 texto-azul"
          onClick={onMinToggle}
          aria-label={minimizado ? 'Maximizar panel' : 'Minimizar panel'}
        >
          {minimizado ? <IconArrowsMaximize size={16} /> : <IconArrowsMinimize size={16} />}
        </button>
      </CardHeader>
      {/* Keep content mounted but hide when minimized */}
      <CardContent className={`flex-1 overflow-hidden min-h-0 pt-6 ${minimizado ? 'hidden' : ''}`}>
        {contenido}
      </CardContent>
    </Card>
  )

  const todosMinimizados = minTranscripcion && minHerramientas && minChat

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 h-full relative">
      {/* Logo y mensaje cuando todos los paneles están cerrados */}
      {todosMinimizados && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <img 
            src="/logos/logo_mejorado_4x_negro.png" 
            alt="DICTA Logo" 
            className="w-64 h-auto mb-4 opacity-50"
          />
          <p className="text-muted-foreground text-center text-lg">
            Para interactuar, expanda los paneles
          </p>
        </div>
      )}
      
      {renderPanel(
        'Grabación',
        minTranscripcion,
        () => setMinTranscripcion(!minTranscripcion),
        (
          <div className="flex h-full flex-col gap-4">
            {isLiveSession && !recordingStopped && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleStopRecording}
                  disabled={crearTranscripcionAudioMutation.isPending}
                >
                  {crearTranscripcionAudioMutation.isPending ? 'Stopping...' : 'Stop Recording'}
                </Button>
              </div>
            )}
            <div className="min-h-0 flex-1">
              <Transcripcion
                hash={sessionHash}
                activeTab={activeTab}
                isRecording={isLiveSession && !recordingStopped}
              />
            </div>
          </div>
        )
      )}
      {renderPanel('Herramientas', minHerramientas, () => setMinHerramientas(!minHerramientas), <Herramientas hash={sessionHash} activeTab={activeHerramientasTab} />)}
      {renderPanel('Asistente conversacional de IA', minChat, () => setMinChat(!minChat), <Chat hash={sessionHash} audienciaId={transcripcion?.url ?? audienciaId} />)}
    </div>
  )
}

export default Paneles
