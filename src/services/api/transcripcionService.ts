import type { TranscripcionResponse } from '../../models/transcripcionModels';
import { socketService } from '../socketService';
import { apiClient } from '../../lib/apiClient';
import type { TranscripcionHistorial, VinculacionTranscripcionRequest } from 'server/models/transcripcionModel';

export async function getTranscripcionMessages(hash: string): Promise<TranscripcionResponse> {
  try {
    return socketService.getTranscripcion(hash);
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

export async function vincularTranscripcion(vinculacionData: VinculacionTranscripcionRequest): Promise<any> {
  const response = await apiClient.patch(
    `/transcripciones/${vinculacionData.transcripcionId}`,
    { audienciaId: vinculacionData.audienciaId }
  )
  return response.data
}

export async function crearTranscripcionYoutube(urlYoutube: string): Promise<any> {
  try {
    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const duracion = "00:05:00";

    const response = await apiClient.post('/transcripciones/youtube', {
      url: urlYoutube,
      hash: hash,
      duracion: duracion,
    });

    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al crear transcripción de YouTube');
  }
}

export async function crearTranscripcionAudio(nombreaArchivo: string): Promise<any> {
  try {
    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const duracion = "00:05:00";

    const response = await apiClient.post('/transcripciones/audio', {
      archivo: nombreaArchivo,
      hash: hash,
      duracion: duracion,
    });

    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al crear transcripción de YouTube');
  }
}