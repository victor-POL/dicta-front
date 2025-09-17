import { eliminarTranscripcion, obtenerTranscripciones } from '@/services/api/transcripcionService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



export const transcripcionesKeys = {
  all: ['transcripciones'] as const,
  lists: () => [...transcripcionesKeys.all, 'list'] as const,
  details: () => [...transcripcionesKeys.all, 'detail'] as const,
  detail: (id: number) => [...transcripcionesKeys.details(), id] as const,
} as const;

// Hook para obtener todas las transcripciones
export const useTranscripciones = () => {
  return useQuery({
    queryKey: transcripcionesKeys.lists(),
    queryFn: () => obtenerTranscripciones(),
  })
}

// Hook para eliminar transcripción
export const useEliminarTranscripcion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transcripcionId: number) => eliminarTranscripcion(transcripcionId),
    onSuccess: () => {
      // Invalidar todas las transcripciones para refrescar la lista
      queryClient.invalidateQueries({ queryKey: transcripcionesKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Error eliminando transcripción:', error);
    }
  });
};