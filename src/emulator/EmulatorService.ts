import { EmulatorConfig, EmulatorState, InputState } from '../common/types';
import LibretroCore from './LibretroCore';

class EmulatorService {
  private config: EmulatorConfig;
  private state: EmulatorState;
  private canvas: HTMLCanvasElement | null = null;
  private audioContext: AudioContext | null = null;

  constructor(config: EmulatorConfig) {
    this.config = config;
    this.state = {
      isRunning: false,
      currentFrame: 0,
      players: {}
    };
  }

  async initialize(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;
    this.audioContext = new AudioContext();
    
    // Initialize emulator core
    try {
      await this.loadCore();
      await this.loadROM();
      this.setupAudio();
      this.setupVideo();
    } catch (error) {
      console.error('Failed to initialize emulator:', error);
      throw error;
    }
  }

  private async loadCore(): Promise<void> {
    this.core = new LibretroCore();
    await this.core.loadCore(this.config.corePath);
  }

  private async loadROM(): Promise<void> {
    try {
      const response = await fetch(this.config.romPath);
      const romBuffer = await response.arrayBuffer();
      
      // Validate ROM file
      if (!this.isValidROM(romBuffer)) {
        throw new Error('Invalid ROM file');
      }

      // Load ROM into core
      await this.core.loadROM(romBuffer);
    } catch (error) {
      console.error('Failed to load ROM:', error);
      throw error;
    }
  }

  private isValidROM(buffer: ArrayBuffer): boolean {
    // Basic ROM validation
    if (buffer.byteLength === 0) return false;
    
    // Check for common ROM headers based on game type
    const header = new Uint8Array(buffer, 0, 16);
    
    switch (this.config.gameType) {
      case 'arcade':
        // Check for MAME ROM header
        return this.validateArcadeROM(header);
      case 'nes':
        // Check for iNES header magic number
        return header[0] === 0x4E && header[1] === 0x45 && 
               header[2] === 0x53 && header[3] === 0x1A;
      case 'snes':
        // Check for SNES header
        return this.validateSNESROM(header);
      default:
        return true;
    }
  }

  private validateArcadeROM(header: Uint8Array): boolean {
    // Basic MAME ROM validation
    // This can be expanded based on specific arcade system requirements
    return header.length >= 16;
  }

  private validateSNESROM(header: Uint8Array): boolean {
    // Check for common SNES header locations
    const headerAt0x7FB0 = header.slice(0x7FB0, 0x7FC0);
    const headerAt0xFFB0 = header.slice(0xFFB0, 0xFFC0);
    
    return headerAt0x7FB0.some(byte => byte !== 0) || 
           headerAt0xFFB0.some(byte => byte !== 0);
  }

  public async changeROM(romPath: string): Promise<void> {
    this.pause();
    this.config.romPath = romPath;
    await this.loadROM();
    this.start();
  }

  private setupAudio(): void {
    // Audio setup implementation
  }

  private setupVideo(): void {
    // Video setup implementation
  }

  public updatePlayerInput(playerId: string, input: InputState): void {
    if (!this.state.players[playerId]) {
      this.state.players[playerId] = {
        inputs: [],
        latency: 0
      };
    }
    
    // Convert input state to binary format for network transmission
    const inputBinary = this.serializeInput(input);
    this.state.players[playerId].inputs.push(inputBinary);
  }

  private serializeInput(input: InputState): number {
    let result = 0;
    if (input.up) result |= 0x01;
    if (input.down) result |= 0x02;
    if (input.left) result |= 0x04;
    if (input.right) result |= 0x08;
    if (input.button1) result |= 0x10;
    if (input.button2) result |= 0x20;
    if (input.button3) result |= 0x40;
    if (input.button4) result |= 0x80;
    if (input.start) result |= 0x100;
    if (input.select) result |= 0x200;
    return result;
  }

  public start(): void {
    this.state.isRunning = true;
    this.runFrame();
  }

  public pause(): void {
    this.state.isRunning = false;
  }

  private runFrame(): void {
    if (!this.state.isRunning) return;

    // Process one frame of emulation
    this.processFrame();
    
    // Schedule next frame
    requestAnimationFrame(() => this.runFrame());
  }

  private processFrame(): void {
    this.core.runFrame();
    this.renderFrame();
    this.processAudio();
    this.state.currentFrame++;
  }

  private renderFrame(): void {
    if (!this.canvas || !this.core) return;
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const frameBuffer = this.core.getFrameBuffer();
    if (!frameBuffer) return;

    const imageData = new ImageData(
      new Uint8ClampedArray(frameBuffer.buffer),
      this.canvas.width,
      this.canvas.height
    );
    ctx.putImageData(imageData, 0, 0);
  }

  private processAudio(): void {
    if (!this.audioContext || !this.core) return;
    
    const audioBuffer = this.core.getAudioBuffer();
    if (!audioBuffer) return;

    const buffer = this.audioContext.createBuffer(2, audioBuffer.length / 2, this.config.sampleRate);
    buffer.getChannelData(0).set(audioBuffer.subarray(0, audioBuffer.length / 2));
    buffer.getChannelData(1).set(audioBuffer.subarray(audioBuffer.length / 2));

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  public async saveState(slot: number): Promise<void> {
    if (!this.core) return;

    try {
      // Get current state from core
      const stateData = await this.core.serializeState();
      
      // Create state metadata
      const stateMetadata = {
        timestamp: Date.now(),
        romPath: this.config.romPath,
        gameType: this.config.gameType,
        frame: this.state.currentFrame
      };

      // Save state to IndexedDB
      await this.saveStateToStorage(slot, stateData, stateMetadata);
    } catch (error) {
      console.error('Failed to save state:', error);
      throw error;
    }
  }

  public async loadState(slot: number): Promise<void> {
    if (!this.core) return;

    try {
      // Load state from IndexedDB
      const { stateData, metadata } = await this.loadStateFromStorage(slot);

      // Verify ROM compatibility
      if (metadata.romPath !== this.config.romPath) {
        throw new Error('State was saved with a different ROM');
      }

      // Load state into core
      await this.core.deserializeState(stateData);
      this.state.currentFrame = metadata.frame;
    } catch (error) {
      console.error('Failed to load state:', error);
      throw error;
    }
  }

  private async saveStateToStorage(
    slot: number, 
    stateData: ArrayBuffer, 
    metadata: any
  ): Promise<void> {
    const db = await this.openStateDatabase();
    const tx = db.transaction('states', 'readwrite');
    const store = tx.objectStore('states');

    await store.put({
      slot,
      stateData,
      metadata
    });
  }

  private async loadStateFromStorage(slot: number): Promise<any> {
    const db = await this.openStateDatabase();
    const tx = db.transaction('states', 'readonly');
    const store = tx.objectStore('states');

    const state = await store.get(slot);
    if (!state) {
      throw new Error('No save state found in slot ' + slot);
    }

    return state;
  }

  private async openStateDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('emulator-states', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('states')) {
          db.createObjectStore('states', { keyPath: 'slot' });
        }
      };
    });
  }

  public async exportStateToNetwork(slot: number): Promise<string> {
    if (!this.core) throw new Error('Emulator core not initialized');

    try {
      const { stateData, metadata } = await this.loadStateFromStorage(slot);
      
      // Create transferable state package
      const statePackage = {
        stateData: Array.from(new Uint8Array(stateData)),
        metadata,
        checksum: await this.calculateStateChecksum(stateData)
      };

      return JSON.stringify(statePackage);
    } catch (error) {
      console.error('Failed to export state:', error);
      throw error;
    }
  }

  public async importStateFromNetwork(statePackageStr: string): Promise<void> {
    if (!this.core) throw new Error('Emulator core not initialized');

    try {
      const statePackage = JSON.parse(statePackageStr);
      
      // Reconstruct ArrayBuffer from array
      const stateData = new Uint8Array(statePackage.stateData).buffer;
      
      // Verify checksum
      const checksum = await this.calculateStateChecksum(stateData);
      if (checksum !== statePackage.checksum) {
        throw new Error('State checksum verification failed');
      }

      // Verify ROM compatibility
      if (statePackage.metadata.romPath !== this.config.romPath) {
        throw new Error('State was saved with a different ROM');
      }

      // Load the state
      await this.core.deserializeState(stateData);
      this.state.currentFrame = statePackage.metadata.frame;
    } catch (error) {
      console.error('Failed to import state:', error);
      throw error;
    }
  }

  private async calculateStateChecksum(data: ArrayBuffer): Promise<string> {
    const buffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export default EmulatorService;