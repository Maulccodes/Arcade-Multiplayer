/**
 * Visualizes state rollbacks and their effects
 */
class StateRollbackVisualizer {
  private stateHistory: GameState[] = [];
  private rollbackPoints: RollbackPoint[] = [];

  /**
   * Records a new game state
   */
  recordState(state: GameState): void {
    this.stateHistory.push({
      ...state,
      timestamp: performance.now()
    });
  }

  /**
   * Records a rollback event
   */
  recordRollback(fromState: number, toState: number): void {
    this.rollbackPoints.push({
      from: fromState,
      to: toState,
      timestamp: performance.now(),
      reason: this.analyzeRollbackReason(fromState, toState)
    });
  }

  /**
   * Renders the rollback visualization
   */
  render(ctx: CanvasRenderingContext2D): void {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw timeline
    this.drawTimeline(ctx);
    
    // Draw state points
    this.drawStatePoints(ctx);
    
    // Draw rollback arrows
    this.drawRollbacks(ctx);
    
    // Draw annotations
    this.drawAnnotations(ctx);
  }
}