export interface MermaidMindmapMetadata {
  node_count: number;
  generation_method: string;
}

export interface MermaidMindmap {
  mermaid_code: string;
  analysis_metadata: MermaidMindmapMetadata;
}

export interface MapaResponse {
  mermaid_mindmap: MermaidMindmap;
  cached: boolean;
  audio_hash: string;
}

// Para el parsing y display del mindmap
export interface ParsedMindmapNode {
  id: string;
  title: string;
  level: number;
  children: ParsedMindmapNode[];
  parent?: string;
}

export interface ParsedMindmap {
  rootNode: ParsedMindmapNode;
  totalNodes: number;
  maxDepth: number;
  mermaidCode: string;
}
