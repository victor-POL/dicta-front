import { useMutation, useQueryClient } from '@tanstack/react-query';
import { casosService } from '@/services/api/casosService';
import type { CasoRequest } from '../../server/models/casoModels';

export const casosKeys = {
  all: ['casos'] as const,
  lists: () => [...casosKeys.all, 'list'] as const,
  list: (filters: string) => [...casosKeys.lists(), { filters }] as const,
  details: () => [...casosKeys.all, 'detail'] as const,
  detail: (id: number) => [...casosKeys.details(), id] as const,
} as const;

export const useCrearCaso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ estudioId, caso }: { estudioId: number; caso: CasoRequest }) =>
      casosService.crearCaso(estudioId, caso),
    onSuccess: () => {
      // Invalidar la lista de casos para refrescar con el nuevo caso
      queryClient.invalidateQueries({ queryKey: casosKeys.lists() });
    },
  });
};