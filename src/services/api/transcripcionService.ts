import type { TranscripcionResponse } from '../../models/transcripcionModels';

export async function getTranscripcionMessages(): Promise<TranscripcionResponse> {
  const res = await fetch('http://localhost:4000/api/transcription', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}