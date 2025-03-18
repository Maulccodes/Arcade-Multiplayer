import React from 'react';
import { StateDiff } from '../../../types/debug';

interface StateDiffViewerProps {
  diffs: StateDiff[];
}

export const StateDiffViewer: React.FC<StateDiffViewerProps> = ({ diffs }) => {
  return (
    <div className="state-diff-viewer">
      {diffs.map(diff => (
        <div key={diff.id} className="diff-entry">
          <span>Time: {new Date(diff.timestamp).toLocaleString()}</span>
          <pre>{JSON.stringify(diff.changes, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};