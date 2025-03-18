/**
 * Monitors and analyzes network quality metrics
 */
class NetworkMonitor {
  private metrics: NetworkMetrics[] = [];
  private pingInterval: number = 1000;
  private qualityThresholds = {
    good: { latency: 50, jitter: 20, packetLoss: 0.01 },
    medium: { latency: 100, jitter: 50, packetLoss: 0.05 }
  };

  /**
   * Start network quality monitoring
   */
  startMonitoring(): void {
    setInterval(() => {
      this.measureLatency();
      this.calculateJitter();
      this.checkPacketLoss();
      this.analyzeQuality();
    }, this.pingInterval);
  }

  /**
   * Measure current network latency
   */
  private async measureLatency(): Promise<number> {
    const startTime = performance.now();
    await this.sendPing();
    const latency = performance.now() - startTime;
    
    this.metrics.push({
      timestamp: Date.now(),
      latency,
      jitter: this.calculateJitter(),
      packetLoss: this.getPacketLossRate()
    });

    return latency;
  }

  /**
   * Analyze overall network quality
   */
  private analyzeQuality(): NetworkQuality {
    const recentMetrics = this.metrics.slice(-10);
    const averageLatency = this.calculateAverage(recentMetrics.map(m => m.latency));
    
    // Determine quality level
    if (averageLatency <= this.qualityThresholds.good.latency) {
      return 'good';
    } else if (averageLatency <= this.qualityThresholds.medium.latency) {
      return 'medium';
    }
    return 'poor';
  }
}