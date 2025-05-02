import React, { useEffect, useRef } from 'react';

const DonutChart: React.FC = () => {
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
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const innerRadius = radius * 0.6;
    
    // Sample data
    const data = [
      { value: 45, color: '#10b981', label: 'Nem' },
      { value: 25, color: '#3b82f6', label: 'Sıcaklık' },
      { value: 15, color: '#f59e0b', label: 'Toprak' },
      { value: 15, color: '#6366f1', label: 'Diğer' }
    ];
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw donut chart
    let startAngle = -Math.PI / 2;
    
    data.forEach((item, index) => {
      // Calculate angles
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Draw arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      
      // Fill slice
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius + 20;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      // Draw center label
      if (index === 0) {
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${total}`, centerX, centerY - 10);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Toplam', centerX, centerY + 10);
      }
      
      // Move to next slice
      startAngle = endAngle;
    });
    
    // Draw legend
    const legendX = width - 130;
    const legendY = 30;
    
    data.forEach((item, index) => {
      const y = legendY + (index * 25);
      
      // Draw color square
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.label} (${item.value}%)`, legendX + 25, y + 7);
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

export default DonutChart;