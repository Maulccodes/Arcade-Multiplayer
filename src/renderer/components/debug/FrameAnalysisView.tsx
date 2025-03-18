import React from 'react';
import { FrameAnalysis } from '../../../types/debug';

interface FrameAnalysisViewProps {
  stats: FrameAnalysis[];
}

export const FrameAnalysisView: React.FC<FrameAnalysisViewProps> = ({ stats }) => {
  return (
    <div className="frame-analysis-view">
      {stats.map(frame => (
        <div key={frame.frameId} className="frame-entry">
          <span>Frame: {frame.frameId}</span>
          <span>Duration: {frame.duration}ms</span>
          <div>Components: {frame.components.join(', ')}</div>
        </div>
      ))}
    </div>
  );
};