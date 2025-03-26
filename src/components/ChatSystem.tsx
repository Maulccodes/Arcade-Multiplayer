import { ChatMessage, GameSession, ModerationType } from '../types/chat';
import { EmojiPicker } from '../chat/EmojiPicker';
import { MessageTranslator } from '../chat/MessageTranslator';
import { ModerationSystem } from '../chat/ModerationSystem';
import { ProfanityFilter } from '../chat/ProfanityFilter';
import { SpamDetector } from '../chat/SpamDetector';

export class ChatSystem {
  private messageHistory: ChatMessage[] = [];
  private emojiPicker: EmojiPicker;
  private translator: MessageTranslator;
  private moderator: ModerationSystem;
  private profanityFilter: ProfanityFilter;
  private spamDetector: SpamDetector;

  constructor(session: GameSession) {
    this.setupMessageHandlers();
    this.emojiPicker = new EmojiPicker();
    this.translator = new MessageTranslator();
    this.setupRealtimeHandlers();
    this.moderator = new ModerationSystem();
    this.profanityFilter = new ProfanityFilter();
    this.spamDetector = new SpamDetector();
  }

  private setupMessageHandlers(): void {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'chat') {
        this.handleIncomingMessage(event.data.message);
      }
    });
  }

  private setupRealtimeHandlers(): void {
    setInterval(() => {
      this.cleanupOldMessages();
    }, 60000);
  }

  // Change from private to public
  public handleIncomingMessage(message: ChatMessage): void {
    if (this.spamDetector.analyze(message)) {
      this.moderator.handleViolation(ModerationType.SPAM);
      return;
    }

    message.content = this.profanityFilter.replace(message.content);
    this.updateMessageHistory(message);
  }

  private updateTypingIndicator(isTyping: boolean): void {
    // Broadcast typing status to other users
    window.postMessage({
      type: 'typing',
      isTyping,
      user: this.session.id
    }, '*');
  }

  private cleanupOldMessages(): void {
    const oneHourAgo = Date.now() - 3600000;
    this.messageHistory = this.messageHistory.filter(msg => msg.timestamp > oneHourAgo);
  }

  private detectMentions(message: string): string[] {
    return message.match(/@\w+/g) || [];
  }

  private updateMessageHistory(message: ChatMessage): void {
    this.messageHistory.push(message);
  }
}