import { crearTranscripcionAudio, crearTranscripcionYoutube, eliminarTranscripcion, obtenerTranscripciones, vincularTranscripcion } from '@/services/api/transcripcionService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { VinculacionTranscripcionRequest } from 'server/models/transcripcionModel';



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

export const useVincularTranscripcion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vinculacionData }: { vinculacionData: VinculacionTranscripcionRequest }) =>
      vincularTranscripcion(vinculacionData),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: transcripcionesKeys.lists() })
    }
  })
}

export const useCrearTranscripcionYoutube = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ urlYoutube, hash, duracion }: { urlYoutube: string, hash: string, duracion: number }) =>
      crearTranscripcionYoutube(urlYoutube, hash, duracion),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: transcripcionesKeys.lists() })
    }
  })
}

export const useCrearTranscripcionAudio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ nombreaArchivo, hash, duracion }: { nombreaArchivo: string, hash: string, duracion: number }) =>
      crearTranscripcionAudio(nombreaArchivo, hash, duracion),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: transcripcionesKeys.lists() })
    }
  })
}