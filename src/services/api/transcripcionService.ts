import type { TranscripcionResponse } from '../../models/transcripcionModels';
import { socketService } from '../socketService';
import { apiClient } from '../../lib/apiClient';
import type { TranscripcionHistorial } from 'server/models/transcripcionModel';

export async function getTranscripcionMessages(hash: string): Promise<TranscripcionResponse> {
  try {
    return await socketService.getTranscripcion(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en la transcripción');
  }
}

export async function eliminarTranscripcion(transcripcionId: number): Promise<any> {
  try {
    const response = await apiClient.delete(`/transcripciones/${transcripcionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al eliminar la transcripción');
  }
}

export async function obtenerTranscripciones(): Promise<TranscripcionHistorial[]> {
  const response = await apiClient.get('/transcripciones')
  const { data: responseData } = response.data

  return responseData.transcripciones;
}