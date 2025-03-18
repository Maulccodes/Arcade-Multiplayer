import { EventEmitter } from 'events';

export interface RoomInfo {
  id: string;
  currentPlayers: number;
  maxPlayers: number;
  hostId: string;
  isPrivate: boolean;
  hasPassword: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface MessageReaction {
  emoji: string;
  users: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

export class P2PConnectionManager {
  // Implementation
}

export interface RoomState {
  id: string;
  hostId: string;
  players: Map<string, PlayerInfo>;
  gameState: {
    currentFrame: number;
    romPath: string;
    emulatorSettings: EmulatorConfig;
  };
}

export interface PlayerInfo {
  id: string;
  name: string;
  role: 'host' | 'guest';
  isReady: boolean;
  latency: number;
}

export class P2PConnectionManager extends EventEmitter {
  private roomStates: Map<string, RoomState> = new Map();
  private connections: Map<string, RTCPeerConnection> = new Map();
  private roomPasswords: Map<string, string> = new Map();

  async createRoom(maxPlayers: number = 4, password?: string): Promise<RoomInfo> {
    const roomId = Math.random().toString(36).substring(2, 15);
    const hostId = Math.random().toString(36).substring(2, 15);
    
    const roomInfo: RoomInfo = {
      id: roomId,
      currentPlayers: 1,
      maxPlayers,
      hostId,
      isPrivate: !!password,
      hasPassword: !!password
    };

    if (password) {
      this.roomPasswords.set(roomId, password);
    }
    
    return roomInfo;
  }

  async joinRoom(roomId: string, password?: string): Promise<boolean> {
    const storedPassword = this.roomPasswords.get(roomId);
    
    if (storedPassword && storedPassword !== password) {
      throw new Error('Incorrect password');
    }
    
    const roomInfo = this.rooms.get(roomId);
    if (!roomInfo) {
      throw new Error('Room not found');
    }
    
    if (roomInfo.currentPlayers >= roomInfo.maxPlayers) {
      throw new Error('Room is full');
    }
    
    roomInfo.currentPlayers++;
    this.rooms.set(roomId, roomInfo);
    this.emit('roomUpdated', roomInfo);
    
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    this.connections.set(roomId, connection);
    this.currentRooms.add(roomId);
    
    await connection.setRemoteDescription(offer);
    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);
    
    return answer;
  }

  async sendState(roomId: string, stateData: string) {
    const dataChannel = this.dataChannels.get(roomId);
    if (dataChannel?.readyState === 'open') {
      dataChannel.send(stateData);
    }
  }

  leaveRoom(roomId: string) {
    const roomInfo = this.rooms.get(roomId);
    if (roomInfo) {
      roomInfo.currentPlayers--;
      if (roomInfo.currentPlayers <= 0) {
        this.rooms.delete(roomId);
        this.emit('roomClosed', roomId);
      } else {
        this.rooms.set(roomId, roomInfo);
        this.emit('roomUpdated', roomInfo);
      }
    }
    const connection = this.connections.get(roomId);
    const dataChannel = this.dataChannels.get(roomId);
    
    dataChannel?.close();
    connection?.close();
    
    this.connections.delete(roomId);
    this.dataChannels.delete(roomId);
    this.currentRooms.delete(roomId);
    
    this.emit('roomLeft', roomId);
  }

  getRooms(): string[] {
    return Array.from(this.currentRooms);
  }

  getRoomInfo(roomId: string): RoomInfo | undefined {
    return this.rooms.get(roomId);
  }

  getAllRooms(): RoomInfo[] {
    return Array.from(this.rooms.values());
  }

  async sendChatMessage(roomId: string, content: string, senderName: string): Promise<void> {
    const message: ChatMessage = {
      id: Math.random().toString(36).substring(2, 15),
      roomId,
      senderId: this.peerId,
      senderName,
      content,
      timestamp: Date.now()
    };

    const dataChannel = this.dataChannels.get(roomId);
    if (dataChannel?.readyState === 'open') {
      dataChannel.send(JSON.stringify({ type: 'chat', data: message }));
    }
  }

  async sendPrivateMessage(roomId: string, recipientId: string, content: string): Promise<void> {
    // Implementation for private messaging
  }

  async addReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    // Implementation for message reactions
  }

  async shareFile(roomId: string, file: File): Promise<string> {
    // Implementation for file sharing
  }
}