import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;