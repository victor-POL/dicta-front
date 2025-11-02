import { useEffect, useState } from 'react'
import { useMapa } from '../hooks/useMapa'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

import { Button } from '@/components/ui/button'
import {
  IconExclamationCircleFilled,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from '@tabler/icons-react'

interface MapaProps {
  readonly hash: string,
  readonly isRecording?: boolean
}

export default function Mapa({ hash, isRecording }: MapaProps) {
  const { data, loading, error } = useMapa(hash, isRecording)
  
  const [mindMapSvg, setMindMapSvg] = useState<string | null>(null)
  // Mostrar directamente el SVG provisto por el backend
  useEffect(() => {
    const svg = data?.mermaid_mindmap?.svg_code
    setMindMapSvg(svg ?? null)
  }, [data])

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
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
          maxScale={10}
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
