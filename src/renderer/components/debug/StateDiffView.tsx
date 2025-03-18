import React from 'react';
import { StateDiff } from '../../../types/debug';

interface StateDiffViewProps {
  diffs: StateDiff[];
}

export const StateDiffView: React.FC<StateDiffViewProps> = ({ diffs }) => {
  return (
    <div className="state-diff-view">
      {diffs.map(diff => (
        <div key={diff.id} className="diff-entry">
          <span>Time: {new Date(diff.timestamp).toLocaleString()}</span>
          <pre>{JSON.stringify(diff.changes, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};