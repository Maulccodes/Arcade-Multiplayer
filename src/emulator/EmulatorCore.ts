/**
 * Core emulator implementation handling ROM execution and state management
 */
class EmulatorCore {
  private memory: Uint8Array;
  private cpu: CPUState;
  private isRunning: boolean = false;
  private frameCallback: (() => void) | null = null;

  /**
   * Initialize emulator with specified memory size
   * @param memorySize Size of emulator memory in bytes
   */
  constructor(memorySize: number = 0x10000) {
    this.memory = new Uint8Array(memorySize);
    this.cpu = this.initializeCPU();
  }

  /**
   * Load ROM data into emulator memory
   * @param romData Binary ROM data
   */
  loadROM(romData: Uint8Array): void {
    // Validate ROM data
    if (!this.validateROM(romData)) {
      throw new Error('Invalid ROM format');
    }

    // Load ROM into memory
    this.memory.set(romData, 0x8000);
    this.resetState();
  }

  /**
   * Start emulator execution
   */
  start(): void {
    this.isRunning = true;
    this.executeFrame();
  }

  /**
   * Execute a single frame of emulation
   */
  private executeFrame(): void {
    if (!this.isRunning) return;

    // Execute CPU cycles for one frame
    const cyclesPerFrame = 29780; // NTSC timing
    for (let i = 0; i < cyclesPerFrame; i++) {
      this.executeCycle();
    }

    // Request next frame
    requestAnimationFrame(() => this.executeFrame());
  }

  /**
   * Create a save state of current emulator state
   * @returns SaveState object containing memory and CPU state
   */
  createSaveState(): SaveState {
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      memory: Array.from(this.memory),
      cpu: { ...this.cpu },
      audioState: this.audioProcessor.getState()
    };
  }

  /**
   * Load a previously created save state
   * @param state SaveState to load
   */
  loadSaveState(state: SaveState): void {
    this.memory = new Uint8Array(state.memory);
    this.cpu = { ...state.cpu };
    this.audioProcessor.setState(state.audioState);
    this.emit('stateLoaded');
  }

  /**
   * Initialize audio processing
   */
  private initializeAudio(): void {
    this.audioProcessor = new AudioProcessor({
      sampleRate: 44100,
      channels: 2,
      bufferSize: 2048
    });
  }
}