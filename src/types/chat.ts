export interface ChatMessage {
  id: string;
  userId: string;
  senderName: string;
  content: string;
  timestamp: number;
  isPrivate: boolean;
  attachment?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  reactions: Map<string, string[]>;
}