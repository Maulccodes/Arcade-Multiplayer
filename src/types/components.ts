export interface GameOverlay {
  id: string;
  isVisible: boolean;
  render(): JSX.Element;
}

export interface PlayerStats {
  score: number;
  health: number;
  level: number;
}

export interface MatchTimer {
  currentTime: number;
  isRunning: boolean;
  start(): void;
  stop(): void;
}