/**
 * Handles input recording and replay functionality
 */
class InputRecorder {
  private recording: InputRecord[] = [];
  private isRecording: boolean = false;
  private playbackIndex: number = 0;

  /**
   * Start recording input events
   */
  startRecording(): void {
    this.recording = [];
    this.isRecording = true;
    this.emit('recordingStarted');
  }

  /**
   * Record an input event
   * @param input Input event to record
   */
  recordInput(input: InputEvent): void {
    if (!this.isRecording) return;

    this.recording.push({
      timestamp: performance.now(),
      input: { ...input }
    });
  }

  /**
   * Start input playback
   */
  startPlayback(): void {
    this.playbackIndex = 0;
    this.playNextInput();
  }

  /**
   * Play next recorded input
   */
  private playNextInput(): void {
    if (this.playbackIndex >= this.recording.length) {
      this.emit('playbackComplete');
      return;
    }

    const record = this.recording[this.playbackIndex++];
    this.emit('inputPlayback', record.input);
    
    // Schedule next input
    this.scheduleNextInput();
  }
}