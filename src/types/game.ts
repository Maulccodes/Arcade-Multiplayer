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

export interface GameEngine {
  start(): void;
  stop(): void;
  update(delta: number): void;
}

export interface MockEmulator {
  loadROM(data: Uint8Array): void;
  processInput(input: any): void;
}

export function getMockROMData(): Uint8Array {
  return new Uint8Array([/* mock data */]);
}

export function getMockInput(): any {
  return {/* mock input data */};
}