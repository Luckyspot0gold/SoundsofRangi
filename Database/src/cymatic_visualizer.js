// src/components/CymaticVisualizer.js
import React, { useRef, useEffect } from 'react';

const CymaticVisualizer = ({ frequency }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw cymatic pattern based on frequency
    const drawCymaticPattern = (freq) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) / 2 - 10;
      
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
      ctx.fillRect(0, 0, width, height);
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0, centerX, centerY, maxRadius
      );
      gradient.addColorStop(0, '#00ffcc');
      gradient.addColorStop(1, '#0066ff');
      
      // Draw pattern based on frequency
      for (let i = 0; i < 360; i += 1) {
        const angle = i * Math.PI / 180;
        const variance = Math.sin(angle * freq / 100) * 0.8 + 
                         Math.cos(angle * freq / 50) * 0.5;
        const radius = maxRadius * (0.5 + 0.5 * variance);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add inner patterns
      for (let ring = 1; ring < 5; ring++) {
        ctx.beginPath();
        const ringFreq = freq * ring / 2;
        const ringRadius = maxRadius * (ring / 5);
        
        for (let i = 0; i < 360; i += 2) {
          const angle = i * Math.PI / 180;
          const variance = Math.sin(angle * ringFreq / 100) * 0.3;
          const radius = ringRadius * (0.9 + variance);
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.strokeStyle = `hsl(${(ring * 60) % 360}, 80%, 60%)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
    
    drawCymaticPattern(frequency);
  }, [frequency]);

  return (
    <div className="cymatic-visualizer">
      <h2>Cymatic Pattern: {frequency} Hz</h2>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500}
        className="cymatic-canvas"
      />
    </div>
  );
};

export default CymaticVisualizer;
