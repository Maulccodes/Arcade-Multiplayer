import React, { useState, useEffect } from 'react';
import { ChatSystem } from './ChatSystem';
import { GameSession } from '../types/chat';

export const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatSystem, setChatSystem] = useState<ChatSystem | null>(null);

  useEffect(() => {
    const session: GameSession = {
      id: 'test-session',
      players: ['player1'],
      isActive: true
    };
    setChatSystem(new ChatSystem(session));
  }, []);

  const sendMessage = () => {
    if (chatSystem && message.trim()) {
      chatSystem.handleIncomingMessage({
        id: Date.now().toString(),
        content: message,
        sender: 'player1',
        timestamp: Date.now()
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {/* Display messages here */}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};