export interface UIState {
  isVisible: boolean;
  opacity: number;
  position: { x: number; y: number };
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface AnimationSequence {
  steps: AnimationConfig[];
  loop?: boolean;
  onComplete?: () => void;
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