/**
 * Visualizes frame timing and performance metrics
 */
class FrameVisualizer {
  private frameData: FrameData[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  /**
   * Initializes the frame visualizer with a canvas element
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupCanvas();
  }

  /**
   * Adds a new frame data point and updates visualization
   */
  addFrame(frameInfo: FrameInfo): void {
    this.frameData.push({
      ...frameInfo,
      timestamp: performance.now()
    });

    // Keep last 300 frames
    if (this.frameData.length > 300) {
      this.frameData.shift();
    }

    this.draw();
  }

  /**
   * Draws the frame timing visualization
   */
  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw frame time graph
    this.drawFrameGraph();
    
    // Draw performance markers
    this.drawMarkers();
    
    // Draw statistics
    this.drawStats();
  }
}