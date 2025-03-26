export interface UIState {
  isVisible: boolean;
  isActive: boolean;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
}

export interface AnimationSequence {
  steps: AnimationConfig[];
  onComplete?: () => void;
}

export interface GameOverlay {
  render(): JSX.Element;
  update(state: any): void;
}

export interface PlayerStats {
  score: number;
  health: number;
}

export interface MatchTimer {
  current: number;
  total: number;
}

export interface TransitionManager {
  start(config: AnimationConfig): void;
  stop(): void;
}

export interface EffectEngine {
  apply(effect: string): void;
  remove(effect: string): void;
}

export interface NotificationCenter {
  show(message: string, type: 'info' | 'warning' | 'error'): void;
  hide(): void;
  isVisible: boolean;
}

export interface AnimationManager {
  play(animation: string): void;
  stop(animation: string): void;
  reset(): void;
}

export interface OverlaySystem {
  add(overlay: GameOverlay): void;
  remove(id: string): void;
  update(): void;
}