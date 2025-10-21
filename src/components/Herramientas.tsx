import { useEffect, useRef, useState } from 'react'
import { useHerramientas } from '../hooks/useHerramientas'
import Sugerencias from './Sugerencias'
import Contradicciones from './Contradicciones'
import Emociones from './Emociones'

import mermaid from 'mermaid'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Button } from '@/components/ui/button'
import {
  IconExclamationCircleFilled,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from '@tabler/icons-react'

import './estilos/Herramientas.css'

interface HerramientasProps {
  readonly hash: string
  readonly activeTab?: string
}

export default function Herramientas({ hash, activeTab: externalActiveTab = 'timeline' }: HerramientasProps) {
  // Hook para obtener los datos de las herramientas
  const { timelineData, mindMapData, error } = useHerramientas(hash)

  const [timelineSvg, setTimelineSvg] = useState<string | null>(null)
  const [mindMapSvg, setMindMapSvg] = useState<string | null>(null)
  const [timelineRendering, setTimelineRendering] = useState(false)
  const [mindMapRendering, setMindMapRendering] = useState(false)

  const timelineRenderCount = useRef(0)
  const mindMapRenderCount = useRef(0)

  // Inicializar Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      fontSize: 14,
    })
  }, [])

  // Renderizar timeline al recibir datos
  useEffect(() => {
    if (!timelineData) {
      setTimelineSvg(null)
      return
    }

    let isCancelled = false
    const renderId = `timeline-diagram-${hash}-${timelineRenderCount.current++}`

    setTimelineRendering(true)
    mermaid
      .render(renderId, timelineData)
      .then(({ svg }) => {
        if (!isCancelled) {
          setTimelineSvg(svg)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Error rendering timeline diagram:', err)
          setTimelineSvg(null)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setTimelineRendering(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [hash, timelineData])

  // Renderizar mindmap al recibir datos
  useEffect(() => {
    if (!mindMapData) {
      setMindMapSvg(null)
      return
    }

    let isCancelled = false
    const renderId = `mindmap-diagram-${hash}-${mindMapRenderCount.current++}`

    setMindMapRendering(true)
    mermaid
      .render(renderId, mindMapData)
      .then(({ svg }) => {
        if (!isCancelled) {
          setMindMapSvg(svg)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Error rendering mindmap diagram:', err)
          setMindMapSvg(null)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setMindMapRendering(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [hash, mindMapData])

  const renderDiagramContent = (svg: string | null, isRendering: boolean, diagramType: string) => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <IconExclamationCircleFilled />
          Error al obtener los datos para el {diagramType}
        </div>
      )
    }

    if (!svg) {
      return (
        <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando {diagramType}...</span>
        </div>
      </div>
      )
    }

    return (
      <div className="w-full h-full relative">
        {isRendering && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Spinner variant="circle" />
            Actualizando {diagramType}...
          </div>
        )}
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={3}
          wheel={{ step: 0.1 }}
          panning={{
            excluded: ['input', 'textarea', 'button', 'select'],
          }}
          doubleClick={{
            disabled: false,
            mode: 'zoomIn',
            animationTime: 200,
            animationType: 'easeInQuad',
          }}
          centerOnInit={true}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Controles de zoom */}
              <div className="absolute top-4 right-4 z-10 flex flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => zoomIn()}
                  className="bg-white/90 hover:bg-white shadow-md"
                  title="Acercar"
                >
                  <IconZoomIn size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => zoomOut()}
                  className="bg-white/90 hover:bg-white shadow-md"
                  title="Alejar"
                >
                  <IconZoomOut size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetTransform()}
                  className="bg-white/90 hover:bg-white shadow-md"
                  title="Restaurar vista"
                >
                  <IconZoomReset size={16} />
                </Button>
              </div>

              <TransformComponent wrapperClass="w-full h-full flex items-center justify-center">
                <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {externalActiveTab === 'timeline' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            {renderDiagramContent(timelineSvg, timelineRendering, 'línea de tiempo')}
          </div>
        </div>
      )}

      {externalActiveTab === 'mindmap' && (
        <div className="overflow-hidden flex-1">
          <div className="border rounded-lg overflow-hidden w-full h-full">
            {renderDiagramContent(mindMapSvg, mindMapRendering, 'mapa mental')}
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
