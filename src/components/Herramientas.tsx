import { useEffect, useRef, useState } from 'react'
import { useHerramientas } from '../hooks/useHerramientas'

import mermaid from 'mermaid'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  IconAlertTriangleFilled,
  IconExclamationCircleFilled,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from '@tabler/icons-react'

import './estilos/Herramientas.css'

interface HerramientasProps {
  readonly hash: string
}

export default function Herramientas({ hash }: HerramientasProps) {
  // Hook para obtener los datos de las herramientas
  const { timelineData, mindMapData, loading, error } = useHerramientas(hash)

  // Refs para los contenedores de los diagramas
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const mindMapRef = useRef<HTMLDivElement | null>(null)

  // Tabs
  const [activeTab, setActiveTab] = useState('timeline')

  // Zoom

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

  // Renderizar diagramas cuando los datos cambien
  useEffect(() => {
    const renderDiagram = async (data: string, element: HTMLDivElement | null, id: string) => {
      if (!data || !element) return

      try {
        element.innerHTML = ''
        const { svg } = await mermaid.render(id, data)
        element.innerHTML = svg
        element.classList.add('loaded')
      } catch (err) {
        console.error('Error rendering diagram:', err)
        element.innerHTML = '<div>Error al renderizar el diagrama</div>'
      }
    }

    if (activeTab === 'timeline' && timelineData && timelineRef.current) {
      renderDiagram(timelineData, timelineRef.current, 'timeline-diagram')
    } else if (activeTab === 'mindmap' && mindMapData && mindMapRef.current) {
      renderDiagram(mindMapData, mindMapRef.current, 'mindmap-diagram')
    }
  }, [timelineData, mindMapData, activeTab])

  const renderDiagramContent = (data: string, ref: React.RefObject<HTMLDivElement | null>, diagramType: string) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner variant="circle" />
          Obteniendo datos para el {diagramType}...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <IconExclamationCircleFilled />
          Error al obtener los datos para el {diagramType}
        </div>
      )
    }

    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <IconAlertTriangleFilled />
          No hay datos disponibles para el {diagramType}
        </div>
      )
    }

    return (
      <div className="w-full h-full relative">
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
                <div className="mermaid-diagram" ref={ref} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    )
  }

  return (
    <Tabs defaultValue="timeline" className="w-full h-full flex flex-col" onValueChange={setActiveTab}>
      <TabsList className="flex-shrink-0">
        <TabsTrigger value="timeline">Línea de tiempo</TabsTrigger>
        <TabsTrigger value="mindmap">Mapa mental</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="overflow-hidden">
        {renderDiagramContent(timelineData, timelineRef, 'línea de tiempo')}
      </TabsContent>

      <TabsContent value="mindmap" className="overflow-hidden">
        {renderDiagramContent(mindMapData, mindMapRef, 'mapa mental')}
      </TabsContent>
    </Tabs>
  )
}
