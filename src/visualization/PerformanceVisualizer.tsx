class PerformanceVisualizer {
  private canvas: HTMLCanvasElement;
  private metrics: PerformanceMetrics;
  private graphs: Map<string, Graph>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupGraphs();
    this.startVisualization();
  }

  private setupGraphs(): void {
    this.graphs.set('fps', new LineGraph({
      title: 'Frame Rate',
      color: '#00ff00',
      threshold: 60
    }));

    this.graphs.set('network', new LatencyGraph({
      title: 'Network Latency',
      color: '#ff9900',
      warning: 100
    }));

    this.graphs.set('memory', new AreaGraph({
      title: 'Memory Usage',
      color: '#0099ff',
      stack: true
    }));
  }

  updateMetrics(newMetrics: PerformanceMetrics): void {
    this.metrics = newMetrics;
    this.graphs.forEach(graph => graph.update(newMetrics));
    this.render();
  }

  private render(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.graphs.forEach(graph => graph.draw(ctx));
  }
}