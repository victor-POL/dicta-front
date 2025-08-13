import type { TranscripcionResponse } from '../../models/transcripcionModels';

export async function getTranscripcionMessages(hash: string): Promise<TranscripcionResponse> {
  const res = await fetch('http://localhost:4000/api/transcription', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Session-Hash': hash
    },
    body: JSON.stringify({ hash }),
  });
  return res.json();
}