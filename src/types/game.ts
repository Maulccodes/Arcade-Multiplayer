export interface PlayerStats {
  score: number;
  health: number;
  lives: number;
  powerups: string[];
}

export interface GameOverlay {
  id: string;
  zIndex: number;
  render(): void;
}

export interface MatchTimer {
  currentTime: number;
  isRunning: boolean;
  start(): void;
  pause(): void;
  reset(): void;
}