import React from 'react';
import { PlayerStats, MatchTimer } from '../types/ui';

interface GameUIProps {
  stats: PlayerStats;
  timer: MatchTimer;
}

export const GameUI: React.FC<GameUIProps> = ({ stats, timer }) => {
  return (
    <div className="game-ui">
      <div className="stats-panel">
        <div className="score">Score: {stats.score}</div>
        <div className="health">Health: {stats.health}</div>
      </div>
      <div className="match-timer">
        Time: {Math.floor(timer.current / 1000)}s
      </div>
    </div>
  );
};