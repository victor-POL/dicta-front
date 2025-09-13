import { useState } from 'react'
import Transcripcion from './Transcripcion'
import Herramientas from './Herramientas'
import Chat from './Chat'
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAutoConnect } from '@/contexts/SocketContext'

function Paneles() {
  const [minTranscripcion, setMinTranscripcion] = useState(false)
  const [minHerramientas, setMinHerramientas] = useState(false)
  const [minChat, setMinChat] = useState(false)
  const [activeTab, setActiveTab] = useState('transcripcion')
  const [activeHerramientasTab, setActiveHerramientasTab] = useState('timeline')

  // Hash que se puede generar o recibir de algún lado
  const [sessionHash] = useState('donadonadonadona')
  
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
                <TabsTrigger value="timeline">Línea</TabsTrigger>
                <TabsTrigger value="mindmap">Mapa</TabsTrigger>
                <TabsTrigger value="sugerencias">Sugerencias</TabsTrigger>
                <TabsTrigger value="emociones">Emociones</TabsTrigger>
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

  return (
 
    <div className="flex flex-wrap gap-2 sm:gap-4 h-full">
      {renderPanel(
        'Grabación',
        minTranscripcion,
        () => setMinTranscripcion(!minTranscripcion),
        <Transcripcion hash={sessionHash} activeTab={activeTab} />
      )}
      {renderPanel('Herramientas', minHerramientas, () => setMinHerramientas(!minHerramientas), <Herramientas hash={sessionHash} activeTab={activeHerramientasTab} />)}
      {renderPanel('Asistente conversacional de IA', minChat, () => setMinChat(!minChat), <Chat hash={sessionHash} />)}
    </div>
  )
}

export default Paneles
