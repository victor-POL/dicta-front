import { useMapa } from './useMapa'
import { useCronologia } from './useCronologia'

export interface DiagramData {
  timelineData: string
  mindMapData: string
  loading: boolean
  error: string | null
}

export function useHerramientas(hash: string) {
  const { data: mapaData, loading: mapaLoading, error: mapaError } = useMapa(hash)
  const { data: cronologiaData, loading: cronologiaLoading, error: cronologiaError } = useCronologia(hash)

  const loading = mapaLoading || cronologiaLoading
  const error = mapaError || cronologiaError

  const diagramData: DiagramData = {
    timelineData: cronologiaData?.mermaid_timeline?.mermaid_code || '',
    mindMapData: mapaData?.mermaid_mindmap?.mermaid_code || '',
    loading,
    error,
  }

  return diagramData
}
