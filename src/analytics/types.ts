/**
 * Represents a series of metric data points for visualization
 */
export interface MetricSeries {
  /** Name of the metric series */
  name: string;
  /** Array of numerical data points */
  data: number[];
  /** Color used to render the series in charts */
  color: string;
  /** Maximum number of data points to maintain in the series */
  maxPoints: number;
}

/**
 * Defines the common interface for timeline-based charts
 */
export interface TimelineChart {
  /** Renders the chart on the canvas */
  draw(): void;
  /** Updates the chart with new data */
  update(data: any): void;
  /** Clears the chart from the canvas */
  clear(): void;
}