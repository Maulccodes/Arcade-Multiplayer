import React, { useState } from 'react';
import { MemoryLeak, FrameAnalysis, PacketEntry, StateDiff } from '../../../types/debug';
import { MemoryLeakView } from './MemoryLeakView';
import { FrameAnalysisView } from './FrameAnalysisView';
import { PacketAnalyzer } from './PacketAnalyzer';
import { StateDiffViewer } from './StateDiffViewer';

type TabType = 'memory' | 'frames' | 'network' | 'state';

export const AdvancedDebugPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('memory');
  const [memoryLeaks, setMemoryLeaks] = useState<MemoryLeak[]>([]);
  const [frameAnalysis, setFrameAnalysis] = useState<FrameAnalysis[]>([]);
  const [packetEntries, setPacketEntries] = useState<PacketEntry[]>([]);
  const [stateDiffs, setStateDiffs] = useState<StateDiff[]>([]);
  const [frameStats, setFrameStats] = useState<FrameAnalysis[]>([]);

  return (
    <div className="advanced-debug-panel">
      <div className="debug-tabs">
        <button 
          className={activeTab === 'memory' ? 'active' : ''} 
          onClick={() => setActiveTab('memory')}
        >
          Memory
        </button>
        <button 
          className={activeTab === 'frames' ? 'active' : ''} 
          onClick={() => setActiveTab('frames')}
        >
          Frames
        </button>
        <button 
          className={activeTab === 'network' ? 'active' : ''} 
          onClick={() => setActiveTab('network')}
        >
          Network
        </button>
        <button 
          className={activeTab === 'state' ? 'active' : ''} 
          onClick={() => setActiveTab('state')}
        >
          State
        </button>
      </div>

      <div className="debug-content">
        {activeTab === 'memory' && (
          <MemoryLeakView leaks={memoryLeaks} />
        )}
        {activeTab === 'frames' && (
          <FrameAnalysisView stats={frameStats} />
        )}
        // Replace PacketInspectorView with PacketAnalyzer
        {activeTab === 'network' && (
          <PacketAnalyzer packets={packetEntries} />
        )}
        {activeTab === 'state' && (
          <StateDiffView diffs={stateDiffs} />
        )}
      </div>
    </div>
  );
};