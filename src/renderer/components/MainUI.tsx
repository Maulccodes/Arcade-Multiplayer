/**
 * Main application user interface component
 */
const MainUI: React.FC = () => {
  const [currentView, setCurrentView] = useState<'menu' | 'game' | 'lobby'>('menu');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const emulatorRef = useRef<EmulatorCore | null>(null);

  /**
   * Initialize emulator instance
   */
  useEffect(() => {
    emulatorRef.current = new EmulatorCore();
    return () => {
      // Cleanup emulator resources
      emulatorRef.current?.stop();
    };
  }, []);

  /**
   * Handle ROM selection and loading
   */
  const handleROMSelect = async (file: File) => {
    const romData = await file.arrayBuffer();
    emulatorRef.current?.loadROM(new Uint8Array(romData));
    setCurrentView('game');
  };

  return (
    <div className="main-ui">
      {currentView === 'menu' && (
        <MenuView onROMSelect={handleROMSelect} />
      )}
      {currentView === 'game' && (
        <GameView emulator={emulatorRef.current} />
      )}
      {currentView === 'lobby' && (
        <LobbyView config={gameConfig} />
      )}
    </div>
  );
};