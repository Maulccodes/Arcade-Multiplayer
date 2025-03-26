export interface MetricSeries {
  name: string;
  data: number[];
  color: string;
  maxPoints: number;
  timestamp?: number;
}

export interface TimelineChart {
  draw(): void;
  update(data: any): void;
  clear(): void;
}