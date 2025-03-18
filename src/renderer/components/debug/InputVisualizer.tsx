import React, { useEffect, useRef } from 'react';

const InputVisualizer: React.FC<{ inputManager: InputManager }> = ({ inputManager }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawInputState = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gamepad state
      const gamepadState = inputManager.getGamepadState();
      drawGamepadVisual(ctx, gamepadState);
      
      // Draw input buffer timeline
      const inputBuffer = inputManager.getInputBuffer();
      drawInputTimeline(ctx, inputBuffer);
      
      requestAnimationFrame(drawInputState);
    };

    drawInputState();
  }, [inputManager]);

  return <canvas ref={canvasRef} className="input-visualizer" width="400" height="200" />;
};