import { mindMapExample, timelineExample } from '@/data/mermaid.data'
import { useEffect, useState } from 'react'

export interface DiagramData {
  timelineData: string
  mindMapData: string
  loading: boolean
  error: string | null
}

export function useHerramientas(hash: string) {
  const [diagramData, setDiagramData] = useState<DiagramData>({
    timelineData: '',
    mindMapData: '',
    loading: false,
    error: null,
  })

  useEffect(() => {
    const fetchDiagramData = async () => {
      setDiagramData((prev) => ({ ...prev, loading: true, error: null }))

      try {
        // Simular fetching tiempo de carga
        await new Promise((resolve) => setTimeout(resolve, 800))

        setDiagramData({
          timelineData: timelineExample,
          mindMapData: mindMapExample,
          loading: false,
          error: null,
        })
      } catch (err) {
        setDiagramData((prev) => ({
          ...prev,
          loading: false,
          error: 'Error al cargar los diagramas',
        }))
        console.error('Error:', err)
      }
    }

    if (hash) {
      fetchDiagramData()
    }
  }, [hash])

  return diagramData
}
