import { PerformanceMetrics } from '../performance/PerformanceMetrics';

export interface Graph {
  update(metrics: PerformanceMetrics): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export class LineGraph implements Graph {
  private title: string;
  private color: string;
  private threshold: number;
  
  constructor(config: { title: string, color: string, threshold: number }) {
    this.title = config.title;
    this.color = config.color;
    this.threshold = config.threshold;
  }
  
  update(metrics: PerformanceMetrics): void {
    // Implementation
  }
  
  draw(ctx: CanvasRenderingContext2D): void {
    // Implementation
  }
}

export class LatencyGraph implements Graph {
  private title: string;
  private color: string;
  private warning: number;
  
  constructor(config: { title: string, color: string, warning: number }) {
    this.title = config.title;
    this.color = config.color;
    this.warning = config.warning;
  }
  
  update(metrics: PerformanceMetrics): void {
    // Implementation
  }
  
  draw(ctx: CanvasRenderingContext2D): void {
    // Implementation
  }
}

export class AreaGraph implements Graph {
  private title: string;
  private color: string;
  private stack: boolean;
  
  constructor(config: { title: string, color: string, stack: boolean }) {
    this.title = config.title;
    this.color = config.color;
    this.stack = config.stack;
  }
  
  update(metrics: PerformanceMetrics): void {
    // Implementation
  }
  
  draw(ctx: CanvasRenderingContext2D): void {
    // Implementation
  }
}