export interface Segment {
  id: number;
  start: string;
  end: string;
  speaker: string;
  text: string;
}

export interface AiCase {
  case_id: string;
  case_name: string;
  upload_success: boolean;
  transcription_length: number;
}

export interface TranscripcionResponse {
  segments: Segment[];
  final_transcription_path: string;
  ai_case: AiCase;
  cached: boolean;
  audio_hash: string;
}

export interface AudioTranscribeSuccessPayload {
  segments: Segment[]; // Los segmentos ya vienen en el formato esperado
  final_transcription_path: string;
  ai_case: {
    case_id: string;
    case_name: string;
    upload_success: boolean;
    transcription_length: number;
  };
  cached: boolean;
  audio_hash: string;
}

export interface YoutubeTranscribeCompletePayload {
  audio_hash: string;
  success: boolean;
  url: string;
  duration: number;
}