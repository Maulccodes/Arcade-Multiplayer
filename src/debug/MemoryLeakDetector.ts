class MemoryLeakDetector {
  private snapshots: Map<string, HeapSnapshot> = new Map();
  private objectReferences: Map<string, number> = new Map();
  private intervalId: number | null = null;

  startTracking(interval: number = 5000): void {
    this.intervalId = window.setInterval(() => {
      this.takeSnapshot();
      this.analyzeMemoryGrowth();
    }, interval);
  }

  private takeSnapshot(): void {
    const snapshot = {
      timestamp: Date.now(),
      jsHeapSize: performance.memory?.usedJSHeapSize || 0,
      objects: this.getObjectCounts()
    };
    
    this.snapshots.set(snapshot.timestamp.toString(), snapshot);
    this.cleanOldSnapshots();
  }

  private analyzeMemoryGrowth(): void {
    const snapshots = Array.from(this.snapshots.values());
    const growth = this.calculateGrowthRate(snapshots);
    
    if (growth.rate > 0.1) {
      this.emit('memoryLeak', {
        rate: growth.rate,
        suspects: growth.suspects
      });
    }
  }
}