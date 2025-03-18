/**
 * Manages WebRTC connections and peer communication
 */
class WebRTCManager {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();

  /**
   * Initialize WebRTC connection with peer
   * @param peerId Remote peer ID
   */
  async initializePeerConnection(peerId: string): Promise<void> {
    const connection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:your-turn-server.com', 
          username: 'username', 
          credential: 'credential' 
        }
      ]
    });

    // Setup connection handlers
    this.setupConnectionHandlers(connection, peerId);
    
    // Create data channel
    const dataChannel = connection.createDataChannel('gameData', {
      ordered: false,
      maxRetransmits: 1
    });

    this.setupDataChannel(dataChannel, peerId);
  }

  /**
   * Handle connection state changes
   */
  private handleConnectionStateChange(connection: RTCPeerConnection, peerId: string): void {
    connection.onconnectionstatechange = () => {
      switch (connection.connectionState) {
        case 'connected':
          this.startLatencyMonitoring(peerId);
          break;
        case 'disconnected':
          this.handleDisconnect(peerId);
          break;
        case 'failed':
          this.attemptReconnection(peerId);
          break;
      }
    };
  }
}