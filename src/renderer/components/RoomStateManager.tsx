import React, { useEffect, useState } from 'react';
import { RoomState, PlayerInfo } from '../../network/P2PConnectionManager';

interface RoomStateManagerProps {
  roomId: string;
  connection: P2PConnectionManager;
  emulator: EmulatorService;
  onError: (error: Error) => void;
}

const RoomStateManager: React.FC<RoomStateManagerProps> = ({ 
  roomId, 
  connection, 
  emulator, 
  onError 
}) => {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleReadyToggle = async () => {
    try {
      await connection.setPlayerReady(roomId, emulator.playerId, !isReady);
      setIsReady(!isReady);
    } catch (error) {
      onError(error as Error);
    }
  };

  const handleTransferHost = async (newHostId: string) => {
    try {
      await connection.transferHost(roomId, newHostId);
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="room-state-manager">
      <div className="player-list">
        <h3>Players</h3>
        {Array.from(roomState?.players.values() || []).map(player => (
          <div key={player.id} className="player-item">
            <span className="player-name">
              {player.name}
              {player.role === 'host' && <span className="host-badge">Host</span>}
            </span>
            <span className={`ready-status ${player.isReady ? 'ready' : 'not-ready'}`}>
              {player.isReady ? '✓ Ready' : '○ Not Ready'}
            </span>
            {roomState?.hostId === emulator.playerId && player.id !== emulator.playerId && (
              <button onClick={() => handleTransferHost(player.id)}>
                Make Host
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="room-controls">
        <button onClick={handleReadyToggle}>
          {isReady ? 'Not Ready' : 'Ready'}
        </button>
        {roomState?.hostId === emulator.playerId && (
          <button 
            onClick={() => emulator.start()}
            disabled={!Array.from(roomState.players.values()).every(p => p.isReady)}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomStateManager;