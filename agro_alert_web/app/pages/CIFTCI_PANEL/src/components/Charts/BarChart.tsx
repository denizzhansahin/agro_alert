import React, { useEffect, useRef } from 'react';

const BarChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Sample data
    const data = [122, 19, 8, 15, 22, 14, 7];
    const labels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const maxValue = Math.max(...data);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#d1d5db';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw bars
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length;
    
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + (barSpacing * index) + (barSpacing - barWidth) / 2;
      const y = height - padding - barHeight;
      
      // Draw bar
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#059669');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw label
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index], x + barWidth / 2, height - padding + 15);
      
      // Draw value on top of bar
      ctx.fillStyle = '#4b5563';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
    
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className="w-full h-full"
    />
  );
};

export default BarChart;