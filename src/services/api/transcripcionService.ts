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

export async function subscribeToRabbitMQueue(hash: string): Promise<TranscripcionResponse> {
  try {
    return socketService.subscribeToRabbitMQueue(hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error sub queue');
  }
}

export async function sendDataStream(data: any, hash: string) {
  try{
    return socketService.sendDataStream(data, hash);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error en enviar data stream');
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

export async function crearTranscripcionYoutube(urlYoutube: string, hash: string, duracion: number): Promise<any> {
  try {
    const duracionStr = formatDuration(duracion);
    console.log("Llamando a crearTranscripcionYoutube con:", { urlYoutube, hash, duracionStr });
    const response = await apiClient.post('/transcripciones/youtube', {
      url: urlYoutube,
      hash: hash,
      duracion: duracionStr,
    });

    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al crear transcripción de YouTube');
  }
}

export async function crearTranscripcionAudio(nombreaArchivo: string, hash: string, duracion: number): Promise<any> {
  try {
    const duracionStr = formatDuration(duracion);
    const response = await apiClient.post('/transcripciones/audio', {
      archivo: nombreaArchivo,
      hash: hash,
      duracion: duracionStr,
    });

    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al crear transcripción de YouTube');
  }
}

function formatDuration(duracion: number) {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const hours = Math.floor(duracion / 3600);
  const minutes = Math.floor((duracion % 3600) / 60);
  const seconds = duracion % 60;
  const duracionStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds).substring(0, 2)}`; // Formato HH:MM:SS
  console.log('⏱️ Duración formateada:', duracionStr);
  return duracionStr;
}

export async function actualizarEstadoTranscripcion(hash: string, estado: 'pendiente' | 'procesado' | 'error'): Promise<any> {
  try {
    const response = await apiClient.patch(`/transcripciones/estado/${hash}`, { estado });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error al actualizar estado de transcripción');
  }
}
