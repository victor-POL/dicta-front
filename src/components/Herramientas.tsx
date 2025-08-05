import { useEffect, useRef, useState } from 'react'
import { useHerramientas } from '../hooks/useHerramientas'

import mermaid from 'mermaid'

import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconAlertTriangleFilled, IconExclamationCircleFilled } from '@tabler/icons-react'

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

    return <div className="mermaid-diagram" ref={ref} />
  }

  return (
    <Tabs defaultValue="timeline" className="w-full h-full flex flex-col" onValueChange={setActiveTab}>
      <TabsList className="flex-shrink-0">
        <TabsTrigger value="timeline">Línea de tiempo</TabsTrigger>
        <TabsTrigger value="mindmap">Mapa mental</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="flex-1 overflow-hidden">
        <div className="diagram-container">
          <div className="diagram-content">{renderDiagramContent(timelineData, timelineRef, 'línea de tiempo')}</div>
        </div>
      </TabsContent>

      <TabsContent value="mindmap" className="flex-1 overflow-hidden">
        <div className="diagram-container">
          <div className="diagram-content">{renderDiagramContent(mindMapData, mindMapRef, 'mapa mental')}</div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
