/**
 * Handles recording and playback of input macros
 */
class MacroRecorder {
  private macros: Map<string, InputMacro> = new Map();
  private currentRecording: InputSequence[] = [];
  private isRecording: boolean = false;

  /**
   * Start recording a new macro
   * @param macroName Name of the macro to record
   */
  startMacroRecording(macroName: string): void {
    if (this.isRecording) {
      throw new Error('Already recording a macro');
    }

    this.isRecording = true;
    this.currentRecording = [];
    this.emit('macroRecordingStarted', macroName);
  }

  /**
   * Add input to current macro recording
   * @param input Input event to record
   */
  recordInput(input: InputEvent): void {
    if (!this.isRecording) return;

    this.currentRecording.push({
      input: { ...input },
      timestamp: performance.now(),
      duration: this.calculateInputDuration(input)
    });
  }

  /**
   * Play a recorded macro
   * @param macroName Name of the macro to play
   */
  async playMacro(macroName: string): Promise<void> {
    const macro = this.macros.get(macroName);
    if (!macro) throw new Error('Macro not found');

    for (const sequence of macro.sequences) {
      await this.playInputSequence(sequence);
    }
  }
}