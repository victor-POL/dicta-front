import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearAudiencia } from '@/services/api/audienciasService'
import type { AudienciaRequest } from '../../server/models/casoModels'

export const audienciasKeys = {
  all: ['audiencias'] as const,
  lists: () => [...audienciasKeys.all, 'list'] as const,
} as const

export const useCrearAudiencia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ expedienteId, audienciaData }: { expedienteId: number; audienciaData: AudienciaRequest }) =>
      crearAudiencia(expedienteId, audienciaData),
    onSuccess: () => {
      // Invalidar la lista de casos para actualizar las audiencias anidadas
      queryClient.invalidateQueries({ queryKey: ['casos', 'list'] })
    }
  })
}
