import Sugerencias from './Sugerencias'
import Contradicciones from './Contradicciones'
import Emociones from './Emociones'
import Cronologia from './Cronologia'
import Mapa from './Mapa'

import './estilos/Herramientas.css'

interface HerramientasProps {
  readonly hash: string
  readonly activeTab?: string
}

export default function Herramientas({ hash, activeTab: externalActiveTab = 'timeline' }: HerramientasProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {externalActiveTab === 'timeline' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <Cronologia hash={hash} />
          </div>
        </div>
      )}

      {externalActiveTab === 'mindmap' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <Mapa hash={hash} />
          </div>
        </div>
      )}

      {externalActiveTab === 'sugerencias' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Sugerencias hash={hash} />
            </div>
          </div>
        </div>
      )}

      {externalActiveTab === 'contradicciones' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Contradicciones hash={hash} />
            </div>
          </div>
        </div>
      )}

      {externalActiveTab === 'emociones' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Emociones hash={hash} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
