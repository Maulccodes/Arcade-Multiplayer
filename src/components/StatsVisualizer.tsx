import React, { useEffect, useRef } from 'react';

interface StatsVisualizerProps {
  data: number[];
  width: number;
  height: number;
}

export const StatsVisualizer: React.FC<StatsVisualizerProps> = ({ data, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    data.forEach((value, index) => {
      const x = (index / data.length) * width;
      const y = height - (value / 100) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};