import { GameEngine } from '../engine/GameEngine';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
  });

  test('should start and stop correctly', () => {
    engine.start();
    expect(engine['isRunning']).toBe(true);
    
    engine.stop();
    expect(engine['isRunning']).toBe(false);
  });

  test('should update frame', () => {
    const deltaTime = 16.67; // ~60fps
    engine.updateFrame(deltaTime);
    // Add assertions based on your game logic
  });

  test('should get resources', () => {
    const resources = engine.getResources();
    expect(resources).toBeDefined();
  });
});