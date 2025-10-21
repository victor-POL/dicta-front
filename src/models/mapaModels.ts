export interface MermaidMindmapMetadata {
  node_count: number;
  generation_method: string;
  svg_rendered?: boolean;
}

export interface MermaidMindmap {
  mermaid_code: string;
  analysis_metadata: MermaidMindmapMetadata;
  svg_code?: string;
}

export interface MapaResponse {
  mermaid_mindmap: MermaidMindmap;
  cached: boolean;
  audio_hash: string;
}

// Nota: el front ya no parsea Mermaid; se usa directamente el SVG del backend.
