import React, { useEffect, useRef } from 'react';
import EmulatorService from '../../emulator/EmulatorService';
import ROMSelector from './ROMSelector';

interface EmulatorViewProps {
  config: EmulatorConfig;
  onStateChange?: (state: EmulatorState) => void;
}

const EmulatorView: React.FC<EmulatorViewProps> = ({ config, onStateChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emulatorRef = useRef<EmulatorService | null>(null);

  useEffect(() => {
    if (canvasRef.current && !emulatorRef.current) {
      emulatorRef.current = new EmulatorService(config);
      emulatorRef.current.initialize(canvasRef.current)
        .then(() => {
          emulatorRef.current?.start();
        })
        .catch(error => {
          console.error('Failed to initialize emulator:', error);
        });
    }

    return () => {
      emulatorRef.current?.pause();
    };
  }, [config]);

  const handleROMSelect = async (romPath: string) => {
    if (emulatorRef.current) {
      try {
        await emulatorRef.current.changeROM(romPath);
      } catch (error) {
        console.error('Failed to load ROM:', error);
        // Handle error (show message to user, etc.)
      }
    }
  };

  const handleSaveState = async (slot: number) => {
    if (emulatorRef.current) {
      try {
        await emulatorRef.current.saveState(slot);
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    }
  };

  const handleLoadState = async (slot: number) => {
    if (emulatorRef.current) {
      try {
        await emulatorRef.current.loadState(slot);
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    }
  };

  const handleError = (error: Error) => {
    console.error(error);
    // Add your error handling UI logic here
  };

  return (
    <div className="emulator-view">
      <div className="emulator-controls">
        <ROMSelector 
          onROMSelect={handleROMSelect}
          supportedFormats={['.zip', '.nes', '.sfc', '.smc']}
        />
        <div className="state-controls">
          {[1, 2, 3, 4].map(slot => (
            <div key={slot} className="state-slot">
              <button onClick={() => handleSaveState(slot)}>
                Save State {slot}
              </button>
              <button onClick={() => handleLoadState(slot)}>
                Load State {slot}
              </button>
            </div>
          ))}
          <NetworkStateManager 
            emulator={emulatorRef.current!}
            onError={handleError}
          />
          <P2PStateManager
            emulator={emulatorRef.current!}
            onError={handleError}
          />
        </div>
      </div>
      <canvas 
        ref={canvasRef}
        width={640}
        height={480}
        style={{ 
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
};

export default EmulatorView;