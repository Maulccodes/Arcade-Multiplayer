import React, { useState } from 'react';
import { EmulatorService } from '../../emulator/EmulatorService';

interface NetworkStateManagerProps {
  emulator: EmulatorService;
  onError: (error: Error) => void;
}

const NetworkStateManager: React.FC<NetworkStateManagerProps> = ({ emulator, onError }) => {
  const [shareCode, setShareCode] = useState<string>('');

  const handleExportState = async (slot: number) => {
    try {
      const statePackage = await emulator.exportStateToNetwork(slot);
      const shareCode = btoa(statePackage);
      setShareCode(shareCode);
    } catch (error) {
      onError(error as Error);
    }
  };

  const handleImportState = async () => {
    try {
      const statePackage = atob(shareCode);
      await emulator.importStateFromNetwork(statePackage);
      setShareCode('');
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="network-state-manager">
      <div className="state-export">
        {[1, 2, 3, 4].map(slot => (
          <button 
            key={slot}
            onClick={() => handleExportState(slot)}
          >
            Share State {slot}
          </button>
        ))}
      </div>
      
      <div className="state-import">
        <input
          type="text"
          value={shareCode}
          onChange={(e) => setShareCode(e.target.value)}
          placeholder="Paste share code here"
        />
        <button 
          onClick={handleImportState}
          disabled={!shareCode}
        >
          Import Shared State
        </button>
      </div>
    </div>
  );
};

export default NetworkStateManager;