class StateDiffer {
  private previousState: GameState | null = null;
  private diffHistory: StateDiff[] = [];

  compareDiff(currentState: GameState): StateDiff {
    if (!this.previousState) {
      this.previousState = currentState;
      return { changes: [], timestamp: Date.now() };
    }

    const diff = this.generateDiff(this.previousState, currentState);
    this.previousState = currentState;
    this.diffHistory.push(diff);

    return diff;
  }

  private generateDiff(oldState: GameState, newState: GameState): StateDiff {
    const changes = [];
    const visited = new Set<string>();

    for (const [path, value] of this.walkState(newState)) {
      visited.add(path);
      const oldValue = this.getValueByPath(oldState, path);

      if (!this.isEqual(value, oldValue)) {
        changes.push({
          path,
          oldValue,
          newValue: value,
          type: this.getChangeType(oldValue, value)
        });
      }
    }

    return {
      changes,
      timestamp: Date.now()
    };
  }
}