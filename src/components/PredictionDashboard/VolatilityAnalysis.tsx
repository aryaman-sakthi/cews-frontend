'use client';

import React from 'react';

interface VolatilityAnalysisProps {
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  currentValue: number;
  averageValue: number;
  trend: 'STABLE' | 'INCREASING' | 'DECREASING';
}

export const VolatilityAnalysis: React.FC<VolatilityAnalysisProps> = ({
  level,
  currentValue,
  averageValue,
  trend
}) => {
  // Determine level color
  const getLevelColor = () => {
    switch (level) {
      case 'LOW':
        return 'text-green-400';
      case 'MODERATE':
        return 'text-yellow-400';
      case 'HIGH':
        return 'text-orange-400';
      case 'EXTREME':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  // Determine trend color and icon
  const getTrendColor = () => {
    switch (trend) {
      case 'STABLE':
        return 'text-blue-400';
      case 'INCREASING':
        return 'text-red-400';
      case 'DECREASING':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };
  
  // Get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case 'STABLE':
        return '↔️';
      case 'INCREASING':
        return '↗️';
      case 'DECREASING':
        return '↘️';
      default:
        return '';
    }
  };

  return (
    <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Volatility Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level */}
        <div className="bg-[#1e1e30] rounded-xl p-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Volatility Level</div>
            <div className={`text-3xl font-bold ${getLevelColor()}`}>
              {level}
            </div>
          </div>
        </div>
        
        {/* Current vs Average */}
        <div className="grid grid-cols-2 gap-2">
          {/* Current Value */}
          <div className="bg-[#1e1e30] rounded-xl p-4">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Current</div>
              <div className="text-2xl font-bold text-white">
                {currentValue.toFixed(2)}%
              </div>
            </div>
          </div>
          
          {/* Average Value */}
          <div className="bg-[#1e1e30] rounded-xl p-4">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Average</div>
              <div className="text-2xl font-bold text-white">
                {averageValue.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Trend */}
        <div className="bg-[#1e1e30] rounded-xl p-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Trend</div>
            <div className={`text-3xl font-bold ${getTrendColor()}`}>
              {getTrendIcon()} {trend}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-gray-300 text-sm">
        <p>Volatility represents the degree of variation in exchange rates over time. 
        Higher volatility indicates more rapid and significant price changes, potentially 
        offering both greater risk and opportunity.</p>
      </div>
    </div>
  );
}; 