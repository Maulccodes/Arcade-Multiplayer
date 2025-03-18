export interface Player {
  id: string;
  username: string;
  isReady: boolean;
  slot: number; // 1-4 for player slots
}

export interface GameRoom {
  id: string;
  name: string;
  game: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
}

export interface EmulatorState {
  isRunning: boolean;
  currentFrame: number;
  players: {
    [key: string]: {
      inputs: number[];
      latency: number;
    };
  };
}

export interface EmulatorConfig {
  romPath: string;
  corePath: string;
  gameType: 'arcade' | 'nes' | 'snes';
  maxPlayers: number;
  inputDelay: number;
  sampleRate: number;
  videoScale: number;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  button1: boolean;
  button2: boolean;
  button3: boolean;
  button4: boolean;
  start: boolean;
  select: boolean;
}