interface DebugOverlayProps {
  inputManager: InputManager;
  networkOptimizer: NetworkOptimizer;
  emulator: EmulatorService;
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({
  inputManager,
  networkOptimizer,
  emulator
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'input' | 'network' | 'emulator'>('input');

  return (
    <div className={`debug-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="debug-header">
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide' : 'Show'} Debug
        </button>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'input' ? 'active' : ''} 
            onClick={() => setActiveTab('input')}
          >
            Input
          </button>
          <button 
            className={activeTab === 'network' ? 'active' : ''} 
            onClick={() => setActiveTab('network')}
          >
            Network
          </button>
          <button 
            className={activeTab === 'emulator' ? 'active' : ''} 
            onClick={() => setActiveTab('emulator')}
          >
            Emulator
          </button>
        </div>
      </div>

      <div className="debug-content">
        {activeTab === 'input' && (
          <div className="input-debug">
            <h3>Input State</h3>
            <div className="input-buffer">
              {inputManager.getDebugInfo()}
            </div>
            <div className="gamepad-state">
              {inputManager.getGamepadInfo()}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="network-debug">
            <h3>Network State</h3>
            <div className="network-metrics">
              {networkOptimizer.getDebugInfo()}
            </div>
          </div>
        )}

        {activeTab === 'emulator' && (
          <div className="emulator-debug">
            <h3>Emulator State</h3>
            <div className="emulator-metrics">
              {emulator.getDebugInfo()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};