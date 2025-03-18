const PerformanceProfiler: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    jsHeapSize: 0,
    networkLatency: 0
  });

  useEffect(() => {
    let lastFrameTime = performance.now();
    let frameCount = 0;

    const measurePerformance = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastFrameTime >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: frameCount,
          frameTime: (now - lastFrameTime) / frameCount,
          jsHeapSize: performance.memory?.usedJSHeapSize || 0
        }));

        frameCount = 0;
        lastFrameTime = now;
      }

      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();
  }, []);

  return (
    <div className="performance-profiler">
      <div className="metric">
        <label>FPS:</label>
        <span className={metrics.fps < 55 ? 'warning' : ''}>
          {metrics.fps.toFixed(1)}
        </span>
      </div>
      <div className="metric">
        <label>Frame Time:</label>
        <span>{metrics.frameTime.toFixed(2)}ms</span>
      </div>
      <div className="metric">
        <label>Memory:</label>
        <span>{(metrics.jsHeapSize / 1024 / 1024).toFixed(1)} MB</span>
      </div>
    </div>
  );
};