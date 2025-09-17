import { apiClient } from '@/lib/apiClient'
import type {
  AudienciaRequest,
  AudienciaCreada,
  Audiencia,
} from '../../../server/models/casoModels'

export const crearAudiencia = async (expedienteId: number, audienciaData: AudienciaRequest): Promise<AudienciaCreada> => {
  const response = await apiClient.post(`/casos/${expedienteId}/audiencias`, audienciaData)
  return response.data.audiencia
}

export const eliminarAudiencia = async (audienciaId: number): Promise<void> => {
  await apiClient.delete(`/audiencias/${audienciaId}`)
}

export const obtenerAudienciasPorCaso = async (casoId: number): Promise<Audiencia[]> => {
  const response = await apiClient.get(`/casos/${casoId}/audiencias`)
  const { data: responseData } = response.data

  return responseData.audiencias;
}
