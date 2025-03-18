import React from 'react';

const GameRoom: React.FC = () => {
  return (
    <div className="game-room">
      <div className="game-screen">
        {/* Emulator canvas will go here */}
      </div>
      <div className="player-list">
        {/* Connected players will be listed here */}
      </div>
      <div className="chat">
        {/* Chat interface will go here */}
      </div>
    </div>
  );
};

export default GameRoom;