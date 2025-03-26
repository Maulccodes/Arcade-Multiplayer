import { EmulatorService } from '../../emulator/EmulatorService';
import { GameEngine } from '../../engine/GameEngine';

export class MockEmulator implements EmulatorService {
  loadROM(data: Uint8Array): Promise<boolean> {
    return Promise.resolve(true);
  }

  start(): void {}
  pause(): void {}
  reset(): void {}
  
  getState(slot: number): Uint8Array {
    return new Uint8Array(10);
  }
  
  setState(data: Uint8Array, slot: number): boolean {
    return true;
  }
}

export function getMockROMData(): Uint8Array {
  return new Uint8Array(100);
}

export function getMockInput(): any {
  return {
    buttons: {
      a: true,
      b: false,
      start: false,
      select: false
    },
    dpad: {
      up: false,
      down: false,
      left: false,
      right: true
    }
  };
}

export { GameEngine };