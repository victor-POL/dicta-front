import { useEffect, useRef, useState } from 'react'
import { useMapa } from '../hooks/useMapa'
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

interface MapaProps {
  readonly hash: string
}

export default function Mapa({ hash }: MapaProps) {
  const { data, loading, error } = useMapa(hash)
  
  const [mindMapSvg, setMindMapSvg] = useState<string | null>(null)
  const [rendering, setRendering] = useState(false)
  const renderCount = useRef(0)

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

  // Renderizar mindmap al recibir datos
  useEffect(() => {
    const mindMapData = data?.mermaid_mindmap?.mermaid_code
    
    if (!mindMapData) {
      setMindMapSvg(null)
      return
    }

    let isCancelled = false
    const renderId = `mindmap-diagram-${hash}-${renderCount.current++}`

    setRendering(true)
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
          setRendering(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [hash, data])

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <IconExclamationCircleFilled />
        <span>Error al obtener los datos para el mapa mental</span>
      </div>
    )
  }

  // Loading state
  if (loading || !mindMapSvg) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando mapa mental...</span>
        </div>
      </div>
    )
  }

  // Rendered diagram
  return (
    <div className="w-full h-full relative">
      {rendering && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
          <Spinner variant="circle" />
          Actualizando mapa mental...
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
              <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: mindMapSvg }} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}
