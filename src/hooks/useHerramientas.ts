import { useMapa } from './useMapa'
import { useCronologia } from './useCronologia'

export interface DiagramData {
  // Nuevo: SVGs provistos por el backend
  timelineSvg: string
  mindMapSvg: string
  // Compatibilidad (deprecado): mermaid code si aún se necesitara en otra parte
  timelineData?: string
  mindMapData?: string
  loading: boolean
  error: string | null
}

export function useHerramientas(hash: string) {
  const { data: mapaData, loading: mapaLoading, error: mapaError } = useMapa(hash)
  const { data: cronologiaData, loading: cronologiaLoading, error: cronologiaError } = useCronologia(hash)

  const loading = mapaLoading || cronologiaLoading
  const error = mapaError || cronologiaError

  const diagramData: DiagramData = {
    timelineSvg: cronologiaData?.mermaid_timeline?.svg_code || '',
    mindMapSvg: mapaData?.mermaid_mindmap?.svg_code || '',
    // Deprecado: mantener por compatibilidad si alguien lo usa todavía
    timelineData: cronologiaData?.mermaid_timeline?.mermaid_code || '',
    mindMapData: mapaData?.mermaid_mindmap?.mermaid_code || '',
    loading,
    error,
  }

  return diagramData
}
