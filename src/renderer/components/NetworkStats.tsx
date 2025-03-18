/**
 * Displays real-time network statistics and performance metrics
 */
const NetworkStats: React.FC<NetworkStatsProps> = ({ stats }) => {
  return (
    <div className="network-stats">
      <div className="stat-item">
        <label>Latency:</label>
        <span className={`value ${stats.latency > 100 ? 'warning' : ''}`}>
          {stats.latency}ms
        </span>
      </div>
      <div className="stat-item">
        <label>Buffer Size:</label>
        <span>{stats.bufferSize} frames</span>
      </div>
      <div className="stat-item">
        <label>Rollbacks:</label>
        <span>{stats.rollbackCount}</span>
      </div>
      <div className="stat-item">
        <label>Input Delay:</label>
        <span>{stats.inputDelay}ms</span>
      </div>
    </div>
  );
};