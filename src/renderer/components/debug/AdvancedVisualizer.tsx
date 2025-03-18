/**
 * Component that combines all debug visualizations
 */
const AdvancedVisualizer: React.FC<VisualizerProps> = ({
  heapData,
  frameData,
  packetData,
  stateData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize visualizers
    const frameViz = new FrameVisualizer(canvasRef.current);
    const stateViz = new StateRollbackVisualizer();

    // Update visualizations on data change
    frameViz.updateData(frameData);
    stateViz.updateData(stateData);

  }, [frameData, stateData]);

  return (
    <div className="advanced-visualizer">
      <canvas ref={canvasRef} className="visualization-canvas" />
      <div className="visualization-controls">
        <button onClick={() => handleSnapshotCompare()}>
          Compare Heap Snapshots
        </button>
        <button onClick={() => handlePacketAnalysis()}>
          Analyze Network Packets
        </button>
      </div>
      <div className="visualization-stats">
        {/* Display statistics and metrics */}
      </div>
    </div>
  );
};