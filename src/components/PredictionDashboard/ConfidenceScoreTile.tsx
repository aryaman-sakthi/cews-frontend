'use client';

import React, { useEffect } from 'react';

interface ConfidenceScoreTileProps {
  score: number; // 0-100
}

export const ConfidenceScoreTile: React.FC<ConfidenceScoreTileProps> = ({ score }) => {
  // Log the score received by the component
  console.log(`ConfidenceScoreTile received score: ${score}`);
  
  // Add effect for debugging when score changes
  useEffect(() => {
    console.log(`ConfidenceScoreTile effect triggered with score: ${score}`);
    // This logs when component mounts or score changes
  }, [score]);
  
  // CRITICAL FIX: Force the score to be a proper number and remove any hard-coded values
  const forcedScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  
  // Calculate circle properties
  const size = 120; // Size of the circle in pixels - larger to match the reference
  const strokeWidth = 10; // Width of the progress ring - thicker to match the reference
  const radius = (size - strokeWidth) / 2; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const dashOffset = circumference - (forcedScore / 100) * circumference; // Stroke dash offset
  
  console.log(`Using score: ${forcedScore}, calculated dashOffset: ${dashOffset}`);
  
  // Color based on score
  const getScoreColor = () => {
    if (forcedScore >= 80) return '#64d885'; // Green for high confidence
    if (forcedScore >= 60) return '#6b9ffd'; // Blue for medium confidence
    return '#ffae5c'; // Orange for low confidence
  };

  // Generate a random key to force re-render
  const randomKey = `confidence-${forcedScore}-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col items-center" key={randomKey}>
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
            key={`confidence-circle-${forcedScore}`} // Force re-render when score changes
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
          <span className="text-2xl font-bold text-white">{forcedScore.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}; 