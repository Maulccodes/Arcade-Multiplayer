import { EventEmitter } from 'events';

export interface RoomInfo {
  id: string;
  maxPlayers: number;
  currentPlayers: number;
  hasPassword: boolean;
}

export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: number;
}

export class P2PConnectionManager extends EventEmitter {
  private rooms: Map<string, RoomInfo> = new Map();
  private joinedRooms: Set<string> = new Set();
  
  constructor() {
    super();
  }
  
  async createRoom(maxPlayers: number, password?: string): Promise<RoomInfo> {
    const roomId = this.generateRoomId();
    const roomInfo: RoomInfo = {
      id: roomId,
      maxPlayers,
      currentPlayers: 1, // Creator is the first player
      hasPassword: !!password
    };
    
    this.rooms.set(roomId, roomInfo);
    this.joinedRooms.add(roomId);
    
    return roomInfo;
  }
  
  async joinRoom(roomId: string, password?: string): Promise<boolean> {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    if (room.currentPlayers >= room.maxPlayers) {
      throw new Error('Room is full');
    }
    
    // In a real implementation, we would verify the password here
    
    room.currentPlayers++;
    this.rooms.set(roomId, room);
    this.joinedRooms.add(roomId);
    
    return true;
  }
  
  leaveRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    
    if (room) {
      room.currentPlayers--;
      
      if (room.currentPlayers <= 0) {
        this.rooms.delete(roomId);
      } else {
        this.rooms.set(roomId, room);
      }
    }
    
    this.joinedRooms.delete(roomId);
  }
  
  async sendChatMessage(roomId: string, content: string, sender: string): Promise<void> {
    if (!this.joinedRooms.has(roomId)) {
      throw new Error('Not a member of this room');
    }
    
    const message: ChatMessage = {
      sender,
      content,
      timestamp: Date.now()
    };
    
    // In a real implementation, this would send the message to other peers
    // For now, we'll just emit a local event
    this.emit('message', roomId, message);
  }
  
  async shareGameState(roomId: string, state: Uint8Array, slot: number): Promise<void> {
    if (!this.joinedRooms.has(roomId)) {
      throw new Error('Not a member of this room');
    }
    
    // In a real implementation, this would send the state to other peers
    this.emit('state', roomId, state, slot);
  }
  
  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}