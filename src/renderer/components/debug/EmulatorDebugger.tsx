const EmulatorDebugger: React.FC<{ emulator: EmulatorService }> = ({ emulator }) => {
  const [cpuState, setCpuState] = useState<CPUState | null>(null);
  const [memoryView, setMemoryView] = useState<Uint8Array | null>(null);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);

  useEffect(() => {
    const debugInterval = setInterval(() => {
      setCpuState(emulator.getCPUState());
      setMemoryView(emulator.getMemorySnapshot());
    }, 100);

    return () => clearInterval(debugInterval);
  }, [emulator]);

  return (
    <div className="emulator-debugger">
      <div className="cpu-state">
        <h4>CPU Registers</h4>
        {cpuState && Object.entries(cpuState).map(([reg, value]) => (
          <div key={reg} className="register">
            {reg}: {value.toString(16).padStart(4, '0')}
          </div>
        ))}
      </div>
      <div className="memory-viewer">
        <h4>Memory View</h4>
        {memoryView && (
          <div className="memory-grid">
            {Array.from(memoryView.slice(0, 256)).map((byte, i) => (
              <div key={i} className="memory-cell">
                {byte.toString(16).padStart(2, '0')}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};