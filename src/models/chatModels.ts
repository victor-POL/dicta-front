export interface RelevantDocument {
  rank: number;
  case_name: string;
  chunk_id: number;
  source: string;
  content_preview: string;
  content_length: number;
}

export type Message = {
  text: string;
  sender: 'user' | 'bot';
  relevantDocuments?: RelevantDocument[]; // Optional list of relevant documents attached to bot answer
};

export interface ChatResponse {
  reply: string;
}