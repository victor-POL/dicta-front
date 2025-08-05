import { useState } from 'react'
import Transcripcion from './Transcripcion'
import Herramientas from './Herramientas'
import Chat from './Chat'
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function Paneles() {
  const [minTranscripcion, setMinTranscripcion] = useState(false)
  const [minHerramientas, setMinHerramientas] = useState(false)
  const [minChat, setMinChat] = useState(false)

  // Hash que se puede generar o recibir de algún lado
  const [sessionHash] = useState('dona')
  const [sessionMode] = useState<'socket' | 'api'>('socket') // o 'api', dependiendo del modo de conexión deseado

  const renderPanel = (titulo: string, minimizado: boolean, onMinToggle: () => void, contenido: React.ReactNode) => (
    <Card
      className={`${minimizado ? 'w-16 lg:w-16 h-auto flex-shrink-0' : 'flex-1'} transition-all duration-300 min-w-0 flex flex-col overflow-hidden`}
    >
      <CardHeader
        className={`${minimizado ? 'p-2 flex justify-center' : 'flex flex-row items-center justify-between space-y-0 pb-2 min-w-0'} flex-shrink-0`}
      >
        {!minimizado && <h3 className="font-bold truncate pr-2 min-w-0">{titulo}</h3>}
        <button
          type="button"
          className="p-1 hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors flex-shrink-0"
          onClick={onMinToggle}
          aria-label={minimizado ? 'Maximizar panel' : 'Minimizar panel'}
        >
          {minimizado ? <IconArrowsMaximize size={16} /> : <IconArrowsMinimize size={16} />}
        </button>
      </CardHeader>
      {!minimizado && <CardContent className="flex-1 overflow-auto min-h-0">{contenido}</CardContent>}
    </Card>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 h-full overflow-hidden">
      {renderPanel(
        'Grabación',
        minTranscripcion,
        () => setMinTranscripcion(!minTranscripcion),
        <Transcripcion mode={sessionMode} hash={sessionHash} />
      )}
      {renderPanel('Herramientas', minHerramientas, () => setMinHerramientas(!minHerramientas), <Herramientas />)}
      {renderPanel('Chat', minChat, () => setMinChat(!minChat), <Chat mode={sessionMode} hash={sessionHash} />)}
    </div>
  )
}

export default Paneles
