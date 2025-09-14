import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { estudiosService } from '@/services/api/estudiosService';
import type { EstudioRequest, EquipoRequest } from '../../server/models/estudioModels'


export const estudiosKeys = {
  all: ['estudios'] as const,
  lists: () => [...estudiosKeys.all, 'list'] as const,
  list: (filters: string) => [...estudiosKeys.lists(), { filters }] as const,
  details: () => [...estudiosKeys.all, 'detail'] as const,
  detail: (id: number) => [...estudiosKeys.details(), id] as const,
} as const;

export const useEstudios = () => {
  return useQuery({
    queryKey: estudiosKeys.lists(),
    queryFn: async () => {
      const result = await estudiosService.obtenerEstudios();
      return result;
    }
  });
};

export const useCrearEstudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EstudioRequest) => estudiosService.crearEstudio(data),
    onSuccess: () => {
      // Invalidar y refrescar la lista de estudios
      queryClient.invalidateQueries({ queryKey: estudiosKeys.lists() });
    },
  });
};

export const useCrearEquipo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ estudioId, equipo }: { estudioId: number; equipo: EquipoRequest }) =>
      estudiosService.crearEquipo(estudioId, equipo),
    onSuccess: () => {
      // Invalidar la lista de estudios para refrescar con el nuevo equipo
      queryClient.invalidateQueries({ queryKey: estudiosKeys.lists() });
    },
  });
};

export const useEliminarEstudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (estudioId: number) => estudiosService.eliminarEstudio(estudioId),
    onError: (error: Error) => {
      console.error('Error eliminando estudio:', error);
    },
    onSuccess: () => {
      // Solo invalidar cuando la eliminación sea exitosa
      queryClient.invalidateQueries({ queryKey: estudiosKeys.lists() });
    }
  });
};

export const useEliminarEquipo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ estudioId, equipoId }: { estudioId: number; equipoId: number }) =>
      estudiosService.eliminarEquipo(estudioId, equipoId),
    onSuccess: () => {
      // Invalidar la lista de estudios para refrescar sin el equipo eliminado
      queryClient.invalidateQueries({ queryKey: estudiosKeys.lists() });

    },

  });
};

export const useInvitarMiembro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipoId, correo }: { equipoId: number; correo: string }) =>
      estudiosService.invitarMiembro(equipoId, correo),
    onSuccess: () => {
      // Opcional: Invalidar para refrescar la lista con nuevos miembros
      queryClient.invalidateQueries({ queryKey: estudiosKeys.lists() });
    },
  });
};

// Hook para eliminar miembro
export const useEliminarMiembro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipoId, usuarioId }: { equipoId: number; usuarioId: number }) => 
      estudiosService.eliminarMiembro(equipoId, usuarioId),
    onSuccess: () => {
      // Solo invalidar cuando la eliminación sea exitosa
      queryClient.invalidateQueries({ queryKey: estudiosKeys.lists() });
    }
  });
};