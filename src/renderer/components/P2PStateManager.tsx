import React, { useEffect, useState } from 'react';
import { P2PConnectionManager } from '../../network/P2PConnectionManager';
import { EmulatorService } from '../../emulator/EmulatorService';

interface P2PStateManagerProps {
  emulator: EmulatorService;
  onError: (error: Error) => void;
}

const P2PStateManager: React.FC<P2PStateManagerProps> = ({ emulator, onError }) => {
  const [connection, setConnection] = useState<P2PConnectionManager | null>(null);
  const [activeRooms, setActiveRooms] = useState<RoomInfo[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [newRoomId, setNewRoomId] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [roomPassword, setRoomPassword] = useState<string>('');
  const [joinPassword, setJoinPassword] = useState<string>('');
  const [messages, setMessages] = useState<Map<string, ChatMessage[]>>(new Map());
  const [username, setUsername] = useState<string>('Player');

  useEffect(() => {
    const p2p = new P2PConnectionManager();
    
    p2p.on('message', (roomId: string, message: ChatMessage) => {
      setMessages(prev => {
        const newMap = new Map(prev);
        const roomMessages = newMap.get(roomId) || [];
        newMap.set(roomId, [...roomMessages, message]);
        return newMap;
      });
    });

    if (!connection) return;
    try {
      const roomInfo = await connection.createRoom(maxPlayers, roomPassword);
      setActiveRooms(prev => [...prev, roomInfo]);
      setSelectedRoom(roomInfo.id);
      setRoomPassword('');
    } catch (error) {
      onError(error as Error);
    }
  };

  const handleJoinRoom = async () => {
    if (!connection || !newRoomId) return;
    try {
      await connection.joinRoom(newRoomId, joinPassword);
      setActiveRooms(prev => [...prev, newRoomId]);
      setSelectedRoom(newRoomId);
      setNewRoomId('');
      setJoinPassword('');
    } catch (error) {
      onError(error as Error);
    }
  };

  setConnection(p2p);
    return () => p2p.removeAllListeners();
  }, [emulator]);

  const handleSendMessage = async (roomId: string, content: string) => {
    if (!connection) return;
    try {
      await connection.sendChatMessage(roomId, content, username);
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="p2p-state-manager">
      <div className="room-controls">
        <div className="create-room">
          <select 
            value={maxPlayers} 
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
          <input
            type="password"
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
            placeholder="Room Password (optional)"
          />
          <button onClick={handleCreateRoom}>Create New Room</button>
        </div>
        
        <div className="join-room">
          <input
            type="text"
            value={newRoomId}
            onChange={(e) => setNewRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <input
            type="password"
            value={joinPassword}
            onChange={(e) => setJoinPassword(e.target.value)}
            placeholder="Room Password"
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      </div>

      <div className="active-rooms">
        {activeRooms.map(room => (
          <div key={room.id} className="room-item">
            <div className="room-info">
              Room: {room.id}
              {selectedRoom === room.id && " (Selected)"}
              <div className="room-capacity">
                Players: {room.currentPlayers}/{room.maxPlayers}
                {room.hasPassword && <span className="lock-icon">🔒</span>}
              </div>
            </div>
            <div className="room-actions">
              <button 
                onClick={() => setSelectedRoom(room.id)}
                disabled={room.currentPlayers >= room.maxPlayers}
              >
                Select
              </button>
              <button onClick={() => handleLeaveRoom(room.id)}>Leave</button>
              {selectedRoom === room.id && (
                <div className="state-sharing">
                  {[1, 2, 3, 4].map(slot => (
                    <button 
                      key={slot}
                      onClick={() => handleShareState(room.id, slot)}
                    >
                      Share State {slot}
                    </button>
                  ))}
                </div>
                <RoomChat
                  roomId={room.id}
                  messages={messages.get(room.id) || []}
                  onSendMessage={(content) => handleSendMessage(room.id, content)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default P2PStateManager;