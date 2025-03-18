export interface Graph {
  id: string;
  data: any[];
  render(): void;
  update(newData: any): void;
}

export interface LineGraph extends Graph {
  color: string;
  lineWidth: number;
}

export interface AreaGraph extends Graph {
  fillColor: string;
  opacity: number;
}

export interface LatencyGraph extends Graph {
  threshold: number;
  warningColor: string;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  latency: number;
  memoryUsage: number;
}