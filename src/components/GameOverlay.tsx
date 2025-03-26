import React from 'react';
import { GameUI } from './GameUI';
import { StatsVisualizer } from './StatsVisualizer';

interface GameOverlayProps {
  isVisible: boolean;
  stats: {
    player: number[];
    system: number[];
  };
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ isVisible, stats }) => {
  if (!isVisible) return null;

  return (
    <div className="game-overlay">
      <GameUI 
        stats={{ score: 0, health: 100 }} 
        timer={{ current: 0, total: 300000 }} 
      />
      <div className="stats-container">
        <StatsVisualizer 
          data={stats.player} 
          width={200} 
          height={100} 
        />
        <StatsVisualizer 
          data={stats.system} 
          width={200} 
          height={100} 
        />
      </div>
    </div>
  );
};