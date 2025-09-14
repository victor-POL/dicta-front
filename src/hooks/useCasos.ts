import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { crearCaso, obtenerCasos } from '@/services/api/casosService'
import type { CasoRequest } from '../../server/models/casoModels'

export const casosKeys = {
  all: ['casos'] as const,
  lists: () => [...casosKeys.all, 'list'] as const,
  list: (filters: any) => [...casosKeys.lists(), { filters }] as const,
  details: () => [...casosKeys.all, 'detail'] as const,
  detail: (id: number) => [...casosKeys.details(), id] as const,
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
