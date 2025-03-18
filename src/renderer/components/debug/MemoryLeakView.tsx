import React from 'react';
import { MemoryLeak } from '../../../types/debug';

interface MemoryLeakViewProps {
  leaks: MemoryLeak[];
}

export const MemoryLeakView: React.FC<MemoryLeakViewProps> = ({ leaks }) => {
  return (
    <div className="memory-leak-view">
      {leaks.map(leak => (
        <div key={leak.id} className="leak-entry">
          <span>Location: {leak.location}</span>
          <span>Size: {leak.size}</span>
          <span>Time: {new Date(leak.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};