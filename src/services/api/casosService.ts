import { apiClient } from '@/lib/apiClient'
import type { 
  CasoRequest, 
  Caso, 
} from '../../../server/models/casoModels'

export const crearCaso = async (estudioId: number, casoData: CasoRequest): Promise<Caso> => {
  const response = await apiClient.post(`/estudios/${estudioId}/casos`, casoData)
  return response.data.caso
}

export const obtenerCasos = async (): Promise<Caso[]> => {
  const response = await apiClient.get('/casos')
  return response.data
}