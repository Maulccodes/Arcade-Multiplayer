/**
 * Unit tests for the game engine
 */
describe('GameEngine', () => {
  let gameEngine: GameEngine;
  let mockEmulator: MockEmulator;

  beforeEach(() => {
    mockEmulator = new MockEmulator();
    gameEngine = new GameEngine(mockEmulator);
  });

  test('should initialize game state correctly', async () => {
    const romData = getMockROMData();
    await gameEngine.loadROM(romData);
    expect(gameEngine.isInitialized()).toBe(true);
  });

  test('should handle frame execution', () => {
    const input = getMockInput();
    const frameData = gameEngine.executeFrame(input);
    expect(frameData).toBeDefined();
    expect(frameData.video).toBeDefined();
    expect(frameData.audio).toBeDefined();
  });
});