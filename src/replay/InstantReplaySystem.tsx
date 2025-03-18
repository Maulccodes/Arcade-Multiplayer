class InstantReplaySystem {
  private replayBuffer: CircularBuffer<GameState>;
  private isRecording: boolean = true;
  private currentReplay: ReplaySegment | null = null;

  constructor(private bufferSize: number = 600) {
    this.replayBuffer = new CircularBuffer(bufferSize);
    this.startRecording();
  }

  captureState(state: GameState): void {
    if (this.isRecording) {
      this.replayBuffer.push({
        state,
        timestamp: Date.now()
      });
    }
  }

  createInstantReplay(duration: number = 10): ReplaySegment {
    const endTime = Date.now();
    const startTime = endTime - (duration * 1000);
    
    return {
      states: this.replayBuffer.getRange(startTime, endTime),
      metadata: this.generateReplayMetadata()
    };
  }

  playReplay(replay: ReplaySegment, speed: number = 1): void {
    this.currentReplay = replay;
    this.startPlayback(speed);
  }
}