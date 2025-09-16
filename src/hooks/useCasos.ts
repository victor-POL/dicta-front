import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crearCaso, obtenerCasos, eliminarCaso } from '@/services/api/casosService'
import type { CasoRequest } from '../../server/models/casoModels'

export const casosKeys = {
  all: ['casos'] as const,
  lists: () => [...casosKeys.all, 'list'] as const,
} as const

export const useCrearCaso = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ estudioId, casoData }: { estudioId: number; casoData: CasoRequest }) =>
      crearCaso(estudioId, casoData),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: casosKeys.lists() })
    }
  })
}

export const useCasos = () => {
  return useQuery({
    queryKey: casosKeys.lists(),
    queryFn: () => obtenerCasos(),
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
    }
  })
}
