import Sugerencias from './Sugerencias'
import Contradicciones from './Contradicciones'
import Emociones from './Emociones'
import Cronologia from './Cronologia'
import Mapa from './Mapa'

import './estilos/Herramientas.css'

interface HerramientasProps {
  readonly hash: string
  readonly activeTab?: string
  readonly isRecording?: boolean
}

export default function Herramientas({ hash, activeTab: externalActiveTab = 'timeline', isRecording = false }: HerramientasProps) {
  console.log("Rendering Herramientas with tab:", externalActiveTab, "for hash:", hash, "isRecording:", isRecording)
  return (
    <div className="w-full h-full flex flex-col">
      {externalActiveTab === 'timeline' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <Cronologia hash={hash} isRecording={isRecording} />
          </div>
        </div>
      )}

      {externalActiveTab === 'mindmap' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <Mapa hash={hash} isRecording={isRecording} />
          </div>
        </div>
      )}

      {externalActiveTab === 'sugerencias' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Sugerencias hash={hash} isRecording={isRecording} />
            </div>
          </div>
        </div>
      )}

      {externalActiveTab === 'contradicciones' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Contradicciones hash={hash} isRecording={isRecording} />
            </div>
          </div>
        </div>
      )}

      {externalActiveTab === 'emociones' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            <div className="h-full overflow-y-auto p-3">
              <Emociones hash={hash} isRecording={isRecording} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
