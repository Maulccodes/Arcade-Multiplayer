export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  mentions?: string[];
}

export interface GameSession {
  id: string;
  players: string[];
  isActive: boolean;
}

export enum ModerationType {
  SPAM,
  PROFANITY,
  HARASSMENT,
  INAPPROPRIATE
}

export interface EmojiPicker {
  select(emoji: string): void;
  getRecent(): string[];
}

export interface MessageTranslator {
  translate(message: string, targetLang: string): Promise<string>;
  detectLanguage(message: string): Promise<string>;
}

export interface ModerationSystem {
  checkMessage(message: ChatMessage): boolean;
  handleViolation(type: ModerationType): void;
}

export interface ProfanityFilter {
  check(text: string): boolean;
  replace(text: string): string;
}

export interface SpamDetector {
  analyze(message: ChatMessage): boolean;
  getRisk(): number;
}