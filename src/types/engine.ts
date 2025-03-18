export interface GameEngine {
  start(): void;
  stop(): void;
  updateFrame(deltaTime: number): void;
  getResources(): any;
}

export interface MockEmulator {
  loadROM(data: Uint8Array): Promise<void>;
  processInput(input: any): void;
  getState(): any;
}