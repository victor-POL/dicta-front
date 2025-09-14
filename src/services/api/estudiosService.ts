import { apiClient } from '../../lib/apiClient';
import type { Estudio, EstudioRequest, EquipoRequest, Equipo } from '../../../server/models/estudioModels'

export const estudiosService = {
  obtenerEstudios: async (): Promise<Estudio[]> => {
    const response = await apiClient.get('/estudios');

    const { data: responseData } = response.data

    return responseData.estudios;

  },

  crearEstudio: async (estudio: EstudioRequest): Promise<Estudio> => {
    const response = await apiClient.post('/estudios', estudio);
    return response.data.estudio;
  },

  crearEquipo: async (estudioId: number, equipo: EquipoRequest): Promise<Equipo> => {
    const response = await apiClient.post(`/estudios/${estudioId}/equipos`, equipo);
    return response.data.equipo;
  },

  eliminarEstudio: async (estudioId: number): Promise<void> => {
    await apiClient.delete(`/estudios/${estudioId}`);
  },

  eliminarEquipo: async (estudioId: number, equipoId: number): Promise<void> => {
    await apiClient.delete(`/estudios/${estudioId}/equipos/${equipoId}`);
  },

  invitarMiembro: async (equipoId: number, correo: string): Promise<void> => {
    await apiClient.post(`/estudios/equipos/${equipoId}/invitaciones`, { correo });
  },

  eliminarMiembro: async (equipoId: number, usuarioId: number): Promise<void> => {
    await apiClient.delete(`/estudios/equipos/${equipoId}/miembros/${usuarioId}`);
  }
};