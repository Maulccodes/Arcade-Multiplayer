/**
 * Provides macro editing and management capabilities
 */
class MacroEditor {
  private activeMacro: InputMacro | null = null;
  private undoStack: MacroEdit[] = [];
  private redoStack: MacroEdit[] = [];

  /**
   * Load a macro for editing
   */
  loadMacro(macro: InputMacro): void {
    this.activeMacro = { ...macro };
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Edit timing of macro inputs
   */
  editTiming(sequenceIndex: number, newTiming: number): void {
    if (!this.activeMacro) return;
    
    const oldTiming = this.activeMacro.sequences[sequenceIndex].timing;
    this.undoStack.push({
      type: 'timing',
      sequenceIndex,
      oldValue: oldTiming,
      newValue: newTiming
    });
    
    this.activeMacro.sequences[sequenceIndex].timing = newTiming;
  }

  /**
   * Insert new input sequence
   */
  insertSequence(sequence: InputSequence, index: number): void {
    if (!this.activeMacro) return;
    
    this.undoStack.push({
      type: 'insert',
      sequenceIndex: index,
      newValue: sequence
    });
    
    this.activeMacro.sequences.splice(index, 0, sequence);
  }
}