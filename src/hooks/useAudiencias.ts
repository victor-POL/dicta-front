import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crearAudiencia, eliminarAudiencia, obtenerAudienciasPorCaso } from '@/services/api/audienciasService'
import type { AudienciaRequest } from '../../server/models/casoModels'
import { casosKeys } from '@/hooks/useCasos'

export const audienciasKeys = {
  all: ['audiencias'] as const,
  lists: () => [...audienciasKeys.all, 'list'] as const,
  byCaso: (casoId: number) => [...audienciasKeys.all, 'caso', casoId] as const,
} as const

export const useCrearAudiencia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ expedienteId, audienciaData }: { expedienteId: number; audienciaData: AudienciaRequest }) =>
      crearAudiencia(expedienteId, audienciaData),
    onSuccess: () => {
      // Invalidar la lista de casos para actualizar las audiencias anidadas
      queryClient.invalidateQueries({ queryKey: casosKeys.lists() })
      // Invalidar todas las audiencias
      queryClient.invalidateQueries({ queryKey: audienciasKeys.all })
    }
  })
}


export const useEliminarAudiencia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (audienciaId: number) => eliminarAudiencia(audienciaId),
    onError: (error: Error) => {
      console.error('Error eliminando audiencia:', error);
    },
    onSuccess: () => {
      // Invalidar la lista de casos para actualizar las audiencias anidadas
      queryClient.invalidateQueries({ queryKey: casosKeys.lists() })
      // Invalidar todas las audiencias
      queryClient.invalidateQueries({ queryKey: audienciasKeys.all })
    }
  })
}

export const useAudienciasPorCaso = (casoId?: number) => {
  return useQuery({
    queryKey: audienciasKeys.byCaso(casoId ?? 0),
    queryFn: () => obtenerAudienciasPorCaso(casoId ?? 0),
    enabled: !!casoId && casoId > 0,
  })
}
