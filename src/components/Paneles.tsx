import { useEffect, useState } from 'react'
import Transcripcion from './Transcripcion'
import Herramientas from './Herramientas'
import Chat from './Chat'
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useLocation } from 'react-router'

interface PanelesProps {
  readonly initialHash?: string
}

function Paneles({ initialHash }: PanelesProps) {
  const [minTranscripcion, setMinTranscripcion] = useState(false)
  const [minHerramientas, setMinHerramientas] = useState(false)
  const [minChat, setMinChat] = useState(false)

  const location = useLocation()
  const [sessionHash, setSessionHash] = useState<string>(initialHash || 'dona')
  const [sessionMode] = useState<'socket' | 'api'>('socket')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const hash = params.get('hash')
    if (hash && hash !== sessionHash) setSessionHash(hash)
  }, [location.search])

  const renderPanel = (titulo: string, minimizado: boolean, onMinToggle: () => void, contenido: React.ReactNode) => (
    <Card
      className={`${
        minimizado 
          ? 'w-16 h-auto flex-shrink-0' 
          : 'flex-1 min-w-0 min-w-[300px] h-full'
      } transition-all duration-300 flex flex-col overflow-hidden min-h-0`}
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
      {!minimizado && <CardContent className="flex-1 overflow-hidden min-h-0">{contenido}</CardContent>}
    </Card>
  )

  return (
    // Al achicar horizontalmente, los paneles se van a apilar verticalmente
    // Los 3 paneles van a ocupar en alto el 100% del contenedor padre, en este caso el espacio debajo del header
  <div className="flex flex-wrap items-stretch gap-2 sm:gap-4 h-full min-h-0">
      {renderPanel(
        'Grabación',
        minTranscripcion,
        () => setMinTranscripcion(!minTranscripcion),
  <Transcripcion mode={sessionMode} hash={sessionHash} />
      )}
      {renderPanel('Herramientas', minHerramientas, () => setMinHerramientas(!minHerramientas), <Herramientas hash={sessionHash} />)}
      {renderPanel('Chat', minChat, () => setMinChat(!minChat), <Chat mode={sessionMode} hash={sessionHash} />)}
    </div>
  )
}

export default Paneles
