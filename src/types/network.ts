export interface NetworkMetrics {
  latency: number;
  packetLoss: number;
  bandwidth: number;
  connections: number;
  timestamp: number;
}

export interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
  };
  cpu: number;
  timestamp: number;
}