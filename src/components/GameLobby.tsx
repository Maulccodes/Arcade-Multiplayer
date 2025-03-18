/**
 * Game Lobby Component
 * Handles player matchmaking and session creation
 */
const GameLobby: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  /**
   * Create a new game room
   * @param config Game room configuration
   */
  const createRoom = async (config: RoomConfig): Promise<void> => {
    const room = await gameService.createRoom({
      ...config,
      hostId: currentUser.id,
      maxPlayers: config.maxPlayers || 4,
      gameSettings: getDefaultSettings(selectedGame)
    });
    
    setRooms(prev => [...prev, room]);
  };

  /**
   * Handle player joining room
   */
  const handleJoinRoom = async (roomId: string): Promise<void> => {
    await gameService.joinRoom(roomId);
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="game-lobby">
      <GameSelector onSelect={setSelectedGame} />
      <RoomList rooms={rooms} onJoin={handleJoinRoom} />
      <PlayerList players={players} />
    </div>
  );
};