import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ChatMessage } from '../../network/P2PConnectionManager';
import { formatFileSize } from '../../utils/formatters';
import { User } from '../../types/user';
import { formatFileSize } from '../../utils/formatters';

interface RoomChatProps {
  roomId: string;
  onSendMessage: (content: string) => void;
  messages: ChatMessage[];
}

const RoomChat: React.FC<RoomChatProps> = ({ roomId, onSendMessage, messages }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [privateRecipient, setPrivateRecipient] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setSelectedFile(file);
    } else {
      onError(new Error('File size exceeds 10MB limit'));
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!connection) return;
    try {
      await connection.addReaction(messageId, emoji, userId);
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="room-chat">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.isPrivate ? 'private' : ''}`}>
            <div className="message-header">
              <span className="message-sender">{msg.senderName}</span>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              {msg.isPrivate && <span className="private-badge">Private</span>}
            </div>
            <div className="message-content">
              {msg.content}
              {msg.attachment && (
                <div className="attachment">
                  <a href={msg.attachment.url} download={msg.attachment.name}>
                    📎 {msg.attachment.name} ({formatFileSize(msg.attachment.size)})
                  </a>
                </div>
              )}
            </div>
            <div className="message-reactions">
              {Array.from(msg.reactions.entries()).map(([emoji, reaction]) => (
                <button 
                  key={emoji}
                  className={`reaction ${reaction.users.includes(userId) ? 'active' : ''}`}
                  onClick={() => handleReaction(msg.id, emoji)}
                >
                  {emoji} {reaction.users.length}
                </button>
              ))}
              <button className="add-reaction" onClick={() => setShowEmojiPicker(msg.id)}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="input-container">
          <select 
            value={privateRecipient || ''}
            onChange={(e) => setPrivateRecipient(e.target.value || null)}
          >
            <option value="">Public Message</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                Private to {user.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={handleFileUpload}
            className="file-input"
          />
          {selectedFile && (
            <div className="file-preview">
              📎 {selectedFile.name}
              <button onClick={() => setSelectedFile(null)}>×</button>
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={privateRecipient ? "Type private message..." : "Type message..."}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;