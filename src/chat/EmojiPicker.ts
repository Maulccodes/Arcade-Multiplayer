export class EmojiPicker {
  private recentEmojis: string[] = [];

  select(emoji: string): void {
    this.recentEmojis.unshift(emoji);
    if (this.recentEmojis.length > 30) {
      this.recentEmojis.pop();
    }
  }

  getRecent(): string[] {
    return this.recentEmojis;
  }
}