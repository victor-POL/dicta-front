export interface MermaidTimelineMetadata {
  generation_method: string;
  cleaned_response: boolean;
}

export interface MermaidTimeline {
  mermaid_code: string;
  analysis_metadata: MermaidTimelineMetadata;
  svg_code?: string;
}

export interface CronologiaResponse {
  mermaid_timeline: MermaidTimeline;
  cached: boolean;
  audio_hash: string;
}

// Nota: el front ya no parsea Mermaid; se usa directamente el SVG del backend.
