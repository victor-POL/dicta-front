import { apiClient } from '@/lib/apiClient'
import type {
  AudienciaRequest,
  AudienciaCreada,
} from '../../../server/models/casoModels'

export const crearAudiencia = async (expedienteId: number, audienciaData: AudienciaRequest): Promise<AudienciaCreada> => {
  const response = await apiClient.post(`/casos/${expedienteId}/audiencias`, audienciaData)
  return response.data.audiencia
}

export const eliminarAudiencia = async (audienciaId: number): Promise<void> => {
  await apiClient.delete(`/audiencias/${audienciaId}`)
}
