'use client';

import React from 'react';

interface ConfidenceScoreTileProps {
  score: number; // 0-100
}

export const ConfidenceScoreTile: React.FC<ConfidenceScoreTileProps> = ({ score }) => {
  // Ensure score is within 0-100 range
  const validScore = Math.min(100, Math.max(0, score));
  
  // Calculate circle properties
  const size = 120; // Size of the circle in pixels - larger to match the reference
  const strokeWidth = 10; // Width of the progress ring - thicker to match the reference
  const radius = (size - strokeWidth) / 2; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const dashOffset = circumference - (validScore / 100) * circumference; // Stroke dash offset
  
  // Color based on score
  const getScoreColor = () => {
    if (validScore >= 80) return '#64d885'; // Green for high confidence
    if (validScore >= 60) return '#6b9ffd'; // Blue for medium confidence
    return '#ffae5c'; // Orange for low confidence
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-white text-base mb-2">Confidence Score:</div>
      <div className="relative h-[120px] w-[120px]">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius}
            fill="transparent"
            stroke={getScoreColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{validScore.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}; 