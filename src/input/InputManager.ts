// Represents a single input action (button press, axis movement, etc.)
interface InputEvent {
  type: 'button' | 'axis';
  code: string;
  value: number;
  timestamp: number;
}

// Input state for network synchronization
interface InputState {
  sequence: number;
  events: InputEvent[];
  timestamp: number;
}

/**
 * Manages input handling, mapping, and synchronization across the network
 */
class InputManager {
  private inputBuffer: InputEvent[] = [];
  private inputMap: Map<string, string> = new Map();
  private sequence: number = 0;
  private latency: number = 0;
  private gamepads: Map<number, Gamepad> = new Map();
  private predictedInputs: InputEvent[] = [];
  private lastFrameTime: number = 0;

  /**
   * Initialize input listeners and mapping
   * @param config - Input configuration including key mappings
   */
  constructor(config: InputConfig) {
    this.setupInputMap(config);
    this.setupEventListeners();
  }

  /**
   * Configure input device mappings
   */
  private setupInputMap(config: InputConfig): void {
    // Map keyboard keys to emulator inputs
    this.inputMap.set('ArrowUp', 'UP');
    this.inputMap.set('ArrowDown', 'DOWN');
    this.inputMap.set('ArrowLeft', 'LEFT');
    this.inputMap.set('ArrowRight', 'RIGHT');
    this.inputMap.set('z', 'A');
    this.inputMap.set('x', 'B');
    // ... additional mappings
  }

  /**
   * Set up event listeners for keyboard and gamepad inputs
   */
  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyboardEvent);
    window.addEventListener('keyup', this.handleKeyboardEvent);
    window.addEventListener('gamepadconnected', this.handleGamepadConnect);
  }

  /**
   * Process and buffer input events for network synchronization
   */
  private processInput(event: InputEvent): void {
    this.inputBuffer.push({
      ...event,
      timestamp: performance.now()
    });
    
    // Trigger input processing if buffer reaches threshold
    if (this.inputBuffer.length >= 4) {
      this.sendInputState();
    }
  }

  /**
   * Create and send input state for network synchronization
   */
  private sendInputState(): void {
    const state: InputState = {
      sequence: this.sequence++,
      events: [...this.inputBuffer],
      timestamp: performance.now()
    };
    
    // Clear buffer after sending
    this.inputBuffer = [];
    
    // Emit state for network transmission
    this.emit('inputState', state);
  }

  /**
   * Handle gamepad connection events
   */
  private handleGamepadConnect = (event: GamepadEvent): void => {
    this.gamepads.set(event.gamepad.index, event.gamepad);
    this.setupGamepadMapping(event.gamepad);
  };

  /**
   * Handle gamepad disconnection
   */
  private handleGamepadDisconnect = (event: GamepadEvent): void => {
    this.gamepads.delete(event.gamepad.index);
  };

  /**
   * Process gamepad inputs each frame
   */
  private processGamepadInputs(): void {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
      if (!gamepad) continue;

      // Process buttons
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed) {
          this.processInput({
            type: 'button',
            code: `PAD_${index}`,
            value: button.value,
            timestamp: performance.now()
          });
        }
      });

      // Process axes
      gamepad.axes.forEach((value, index) => {
        if (Math.abs(value) > 0.1) {
          this.processInput({
            type: 'axis',
            code: `AXIS_${index}`,
            value,
            timestamp: performance.now()
          });
        }
      });
    }
  }

  /**
   * Predict future input states based on current inputs
   */
  private predictInputs(frameTime: number): InputEvent[] {
    const timeDelta = frameTime - this.lastFrameTime;
    const predictions = this.inputBuffer.map(input => ({
      ...input,
      timestamp: input.timestamp + timeDelta
    }));
    
    this.predictedInputs = predictions;
    return predictions;
  }
}