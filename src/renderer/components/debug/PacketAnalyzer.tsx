import React from 'react';
import { PacketEntry } from '../../../types/debug';

interface PacketAnalyzerProps {
  packets: PacketEntry[];
}

export const PacketAnalyzer: React.FC<PacketAnalyzerProps> = ({ packets }) => {
  return (
    <div className="packet-analyzer">
      {packets.map(packet => (
        <div key={packet.id} className="packet-entry">
          <span>Type: {packet.type}</span>
          <span>Size: {packet.size}</span>
          <span>Time: {new Date(packet.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};