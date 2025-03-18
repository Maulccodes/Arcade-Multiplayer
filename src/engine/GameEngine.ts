import { GameEngine } from '../types/engine';

// Change the export to make it available
export class GameEngine implements GameEngine {
  private isRunning: boolean = false;
  private resources: Map<string, any> = new Map();
  private lastFrameTime: number = 0;

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastFrameTime = performance.now();
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  stop(): void {
    this.isRunning = false;
  }

  updateFrame(deltaTime: number): void {
    if (this.isRunning) {
      // Game update logic here
    }
  }

  getResources(): any {
    return Object.fromEntries(this.resources);
  }

  private gameLoop(timestamp: number): void {
    if (!this.isRunning) return;

    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    this.updateFrame(deltaTime);
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}