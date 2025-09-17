import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crearCaso, obtenerCasos, obtenerCasosPorEstudio, eliminarCaso } from '@/services/api/casosService'
import type { CasoRequest } from '../../server/models/casoModels'

export const casosKeys = {
  all: ['casos'] as const,
  lists: () => [...casosKeys.all, 'list'] as const,
  byEstudio: (estudioId: number) => [...casosKeys.all, 'estudio', estudioId] as const,
} as const

export const useCrearCaso = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ estudioId, casoData }: { estudioId: number; casoData: CasoRequest }) =>
      crearCaso(estudioId, casoData),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: casosKeys.lists() })
      queryClient.invalidateQueries({ queryKey: casosKeys.byEstudio(variables.estudioId) })
    }
  })
}

export const useCasos = () => {
  return useQuery({
    queryKey: casosKeys.lists(),
    queryFn: () => obtenerCasos(),
  })
}

export const useCasosPorEstudio = (estudioId?: number) => {
  return useQuery({
    queryKey: casosKeys.byEstudio(estudioId ?? 0),
    queryFn: () => obtenerCasosPorEstudio(estudioId ?? 0),
    enabled: !!estudioId && estudioId > 0,
  })
}

export const useEliminarCaso = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (casoId: number) => eliminarCaso(casoId),
    onError: (error: Error) => {
      console.error('Error eliminando caso:', error);
    },
    onSuccess: () => {
      // Solo invalidar cuando la eliminación sea exitosa
      queryClient.invalidateQueries({ queryKey: casosKeys.lists() })
      // Invalidar todos los queries de casos por estudio
      queryClient.invalidateQueries({ queryKey: casosKeys.all })
    }
  })
}

/*
Ejemplo de uso del hook useCasosPorEstudio:

import { useCasosPorEstudio } from '@/hooks/useCasos'

const MiComponente = () => {
  const estudioId = 1 // ID del estudio seleccionado
  const { data: casos, isFetching: cargandoCasos, error } = useCasosPorEstudio(estudioId)

  if (cargandoCasos) return <div>Cargando casos...</div>
  if (error) return <div>Error al cargar casos</div>
  if (!casos || casos.length === 0) return <div>No hay casos en este estudio</div>

  return (
    <div>
      {casos.map(caso => (
        <div key={caso.id}>
          <h3>{caso.numero_expediente}</h3>
          <p>Cliente: {caso.cliente}</p>
          <p>Estado: {caso.estado}</p>
          <p>Audiencias: {caso.audiencias.length}</p>
        </div>
      ))}
    </div>
  )
}

// El hook se deshabilitará automáticamente si estudioId es undefined o 0
// y se volverá a ejecutar automáticamente cuando estudioId cambie
*/
