import { GameEngine } from './engine/GameEngine';
import { NetworkManager } from './network/NetworkManager';
import { config } from './config/environment';

class ArcadeMultiplayer {
  private gameEngine: GameEngine;
  private networkManager: NetworkManager;

  constructor() {
    this.gameEngine = new GameEngine();
    this.networkManager = new NetworkManager();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.networkManager.connect();
      await this.gameEngine.start();
      console.log(`Server running on port ${config.port}`);
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }
}

new ArcadeMultiplayer();