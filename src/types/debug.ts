export interface MemoryLeak {
  id: string;
  location: string;
  size: number;
  timestamp: number;
}

export interface FrameAnalysis {
  frameId: number;
  duration: number;
  components: string[];
}

export interface PacketEntry {
  id: string;
  type: string;
  size: number;
  timestamp: number;
  data: any;
}

export interface StateDiff {
  id: string;
  timestamp: number;
  changes: {
    before: any;
    after: any;
  };
}