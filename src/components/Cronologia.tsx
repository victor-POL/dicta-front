import { useEffect, useState } from 'react'
import { useCronologia } from '../hooks/useCronologia'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

import { Button } from '@/components/ui/button'
import {
  IconExclamationCircleFilled,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from '@tabler/icons-react'

interface CronologiaProps {
  readonly hash: string
}

export default function Cronologia({ hash }: CronologiaProps) {
  const { data, loading, error } = useCronologia(hash)
  
  const [timelineSvg, setTimelineSvg] = useState<string | null>(null)
  // Mostrar directamente el SVG de la línea de tiempo provisto por el backend
  useEffect(() => {
    const svg = data?.mermaid_timeline?.svg_code
    setTimelineSvg(svg ?? null)
  }, [data])

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <IconExclamationCircleFilled />
        <span>Error al obtener los datos para la línea de tiempo</span>
      </div>
    )
  }

  // Loading state
  if (loading || !timelineSvg) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando línea de tiempo...</span>
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
              <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: timelineSvg }} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}
