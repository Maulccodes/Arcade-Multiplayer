import { EmulatorService } from '../emulator/EmulatorService';

export class GameEngine {
  private emulator: EmulatorService;
  private isRunning: boolean = false;
  private lastFrameTime: number = 0;
  private frameRate: number = 60;
  private frameInterval: number = 1000 / 60; // 60 FPS by default
  
  constructor(emulator: EmulatorService) {
    this.emulator = emulator;
  }
  
  async loadGame(romData: Uint8Array): Promise<boolean> {
    try {
      return await this.emulator.loadROM(romData);
    } catch (error) {
      console.error('Failed to load ROM:', error);
      return false;
    }
  }
  
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.gameLoop();
  }
  
  stop(): void {
    this.isRunning = false;
  }
  
  setFrameRate(fps: number): void {
    this.frameRate = fps;
    this.frameInterval = 1000 / fps;
  }
  
  processInput(input: any): void {
    // Process input logic would go here
    // This would typically map user input to emulator controls
  }
  
  update(): void {
    // Update game state
    // This would be called each frame to advance the game state
  }
  
  private gameLoop(): void {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    
    if (deltaTime >= this.frameInterval) {
      this.lastFrameTime = now - (deltaTime % this.frameInterval);
      this.update();
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }
}