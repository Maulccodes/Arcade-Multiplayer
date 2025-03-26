export interface Animation {
  id: string;
  duration: number;
  element: HTMLElement;
  play(): void;
  pause(): void;
  reset(): void;
  isPlaying(): boolean;
}