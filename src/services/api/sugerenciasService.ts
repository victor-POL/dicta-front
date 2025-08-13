import type { SugerenciasResponse } from '../../models/sugerenciasModels';

export async function getSugerenciasData(hash: string): Promise<SugerenciasResponse> {
  try {
    const res = await fetch('http://localhost:4000/api/suggestions', {
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
        questions: data.questions || [],
        cached: data.cached || false,
        audio_hash: data.audio_hash || hash
      },
      status: 'success'
    };
  } catch (error) {
    console.error('Error fetching sugerencias:', error);
    return {
      data: {
        questions: [],
        cached: false,
        audio_hash: hash
      },
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
