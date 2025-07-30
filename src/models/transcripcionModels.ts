export interface Segment {
  id: number;
  start: string;
  end: string;
  speaker: string;
  text: string;
}

export interface TranscripcionResponse {
  segments: Segment[];
  final_transcription_path: string;
  cached: boolean;
  audio_hash: string;
}