import { apiClient } from '../../lib/apiClient';
import type { Caso, CasoRequest } from '../../../server/models/casoModels';

export const casosService = {
  crearCaso: async (estudioId: number, caso: CasoRequest): Promise<Caso> => {
    const response = await apiClient.post(`/estudios/${estudioId}/casos`, caso);
    return response.data.caso;
  }
};