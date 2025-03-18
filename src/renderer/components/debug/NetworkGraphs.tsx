import React, { useEffect, useState } from 'react';
import { NetworkMetrics } from '../../../types/network';
import './NetworkGraphs.css';

interface NetworkGraphsProps {
  metrics: NetworkMetrics[];
}

export const NetworkGraphs: React.FC<NetworkGraphsProps> = ({ metrics }) => {
  const [history, setHistory] = useState<NetworkMetrics[]>([]);

  useEffect(() => {
    setHistory(prev => [...prev, ...metrics].slice(-100));
  }, [metrics]);

  return (
    <div className="network-graphs">
      <div className="metrics-container">
        <div className="metric">
          <h3>Latency</h3>
          <div className="graph">
            {history.map((m, i) => (
              <div key={i} style={{ height: `${m.latency}%` }} />
            ))}
          </div>
        </div>
        <div className="metric">
          <h3>Packet Loss</h3>
          <div className="graph">
            {history.map((m, i) => (
              <div key={i} style={{ height: `${m.packetLoss}%` }} />
            ))}
          </div>
        </div>
        <div className="metric">
          <h3>Bandwidth</h3>
          <div className="graph">
            {history.map((m, i) => (
              <div key={i} style={{ height: `${m.bandwidth}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};