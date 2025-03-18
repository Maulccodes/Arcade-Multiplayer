/**
 * Manages game state and synchronization between players
 */
class GameStateManager {
  private currentState: GameState;
  private stateHistory: GameState[] = [];
  private syncInterval: number = 16; // 60fps

  /**
   * Initialize game state manager
   * @param initialState Initial game state
   */
  constructor(initialState: GameState) {
    this.currentState = initialState;
    this.startStateSync();
  }

  /**
   * Update current game state
   * @param update State update to apply
   */
  updateState(update: Partial<GameState>): void {
    // Store previous state in history
    this.stateHistory.push({ ...this.currentState });

    // Apply update
    this.currentState = {
      ...this.currentState,
      ...update,
      timestamp: Date.now()
    };

    // Emit state update event
    this.emit('stateUpdate', this.currentState);
  }

  /**
   * Start state synchronization
   */
  private startStateSync(): void {
    setInterval(() => {
      this.synchronizeState();
    }, this.syncInterval);
  }
}