import React from 'react';

const Lobby: React.FC = () => {
  return (
    <div className="lobby">
      <h1>Game Lobby</h1>
      <div className="room-list">
        {/* Room list will go here */}
      </div>
      <div className="create-room">
        {/* Create room form will go here */}
      </div>
    </div>
  );
};

export default Lobby;