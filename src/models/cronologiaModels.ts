export interface MermaidTimelineMetadata {
  generation_method: string;
  cleaned_response: boolean;
}

export interface MermaidTimeline {
  mermaid_code: string;
  analysis_metadata: MermaidTimelineMetadata;
}

export interface CronologiaResponse {
  mermaid_timeline: MermaidTimeline;
  cached: boolean;
  audio_hash: string;
}

// Para el parsing y display del timeline
export interface TimelineSection {
  id: string;
  title: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  importance?: 'low' | 'medium' | 'high';
}

export interface ParsedTimeline {
  title: string;
  sections: TimelineSection[];
  totalEvents: number;
  mermaidCode: string;
}
