export type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export interface ChatResponse {
  reply: string;
}