import { PerformanceMetrics } from '../performance/PerformanceMetrics';

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    cpuUsage: 0
  };
  
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateInterval: number = 1000; // 1 second
  private lastFpsUpdate: number = 0;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    this.lastFrameTime = performance.now();
    this.lastFpsUpdate = this.lastFrameTime;
    requestAnimationFrame(() => this.update());
  }

  private update(): void {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    
    // Update frame time
    this.metrics.frameTime = deltaTime;
    
    // Update FPS counter
    this.frameCount++;
    if (now - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
    
    // Update memory usage if available
    if (performance.memory) {
      this.metrics.memoryUsage = (performance.memory as any).usedJSHeapSize / (1024 * 1024);
    }
    
    // Continue monitoring
    requestAnimationFrame(() => this.update());
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  setNetworkLatency(latency: number): void {
    this.metrics.networkLatency = latency;
  }

  setCpuUsage(usage: number): void {
    this.metrics.cpuUsage = usage;
  }
}