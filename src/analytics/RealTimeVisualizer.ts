import { MetricSeries } from './types';

export class RealTimeVisualizer {
  private metrics: MetricSeries[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isRunning: boolean = false;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  startVisualization(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.draw();
    }
  }

  /**
   * Update visualization with new metrics
   */
  updateMetrics(newMetrics: MetricSeries): void {
    this.metrics.push(newMetrics);
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
    
    this.draw();
  }

  /**
   * Draw visualization frame
   */
  private draw(): void {
    if (!this.isRunning) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawPerformanceGraph();
    this.drawNetworkStats();
    this.drawAudioWaveform();
    
    requestAnimationFrame(() => this.draw());
  }

  private drawPerformanceGraph(): void {
    if (this.metrics.length === 0) return;

    const height = this.canvas.height * 0.3;
    const width = this.canvas.width;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#2196F3';
    this.ctx.lineWidth = 2;

    this.metrics.forEach((metric, i) => {
      const x = (i / this.metrics.length) * width;
      const y = height - (metric.data[0] / 100 * height);
      i === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
    });

    this.ctx.stroke();
  }

  private drawNetworkStats(): void {
    if (this.metrics.length === 0) return;

    const height = this.canvas.height * 0.3;
    const width = this.canvas.width;
    const y = this.canvas.height * 0.4;

    this.ctx.fillStyle = '#4CAF50';
    this.metrics.forEach((metric, i) => {
      const x = (i / this.metrics.length) * width;
      const barHeight = (metric.data[1] / 100) * height;
      this.ctx.fillRect(x, y + height - barHeight, width / this.metrics.length, barHeight);
    });
  }

  private drawAudioWaveform(): void {
    if (this.metrics.length === 0) return;

    const height = this.canvas.height * 0.2;
    const width = this.canvas.width;
    const y = this.canvas.height * 0.8;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#FFC107';
    this.ctx.lineWidth = 1;

    this.metrics.forEach((metric, i) => {
      const x = (i / this.metrics.length) * width;
      const amplitude = (metric.data[2] / 100) * height;
      this.ctx.moveTo(x, y - amplitude);
      this.ctx.lineTo(x, y + amplitude);
    });

    this.ctx.stroke();
  }
}