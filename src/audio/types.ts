export interface AudioConfig {
  sampleRate: number;
  channels: number;
  latency: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface AudioSource {
  id: string;
  position: Vector3;
  buffer: AudioBuffer;
}