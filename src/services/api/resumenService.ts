import type { ResumenResponse } from '../../models/resumenModels';

export async function getResumenData(hash: string): Promise<ResumenResponse> {
  try {
    const res = await fetch('http://localhost:5000/api/summary', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Session-Hash': hash
      },
      body: JSON.stringify({ hash }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return {
      data: {
        summary: data.summary || '',
        cached: data.cached || false,
        audio_hash: data.audio_hash || hash
      },
      status: 'success'
    };
  } catch (error) {
    console.error('Error fetching resumen:', error);
    return {
      data: {
        summary: '',
        cached: false,
        audio_hash: hash
      },
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
