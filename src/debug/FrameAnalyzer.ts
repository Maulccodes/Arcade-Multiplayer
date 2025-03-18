class FrameAnalyzer {
  private frameTimings: number[] = [];
  private frameBreakdown: Map<string, number[]> = new Map();
  private markers: Set<string> = new Set();

  startFrame(marker: string = 'frame'): void {
    performance.mark(`${marker}-start`);
  }

  endFrame(marker: string = 'frame'): void {
    performance.mark(`${marker}-end`);
    performance.measure(marker, `${marker}-start`, `${marker}-end`);
    
    const measure = performance.getEntriesByName(marker).pop();
    if (measure) {
      const timings = this.frameBreakdown.get(marker) || [];
      this.frameBreakdown.set(marker, [...timings, measure.duration]);
    }
  }

  analyzeFrames(): FrameAnalysis {
    return {
      averageTime: this.calculateAverageTime(),
      jank: this.detectJank(),
      breakdown: this.getBreakdown()
    };
  }
}