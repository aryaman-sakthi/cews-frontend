'use client';

import React, { useState, useMemo } from 'react';

interface PredictionRate {
  date: string;
  high: number;
  mean: number;
  low: number;
  isHistorical?: boolean;
}

interface PredictionRateCardProps {
  predictions: PredictionRate[];
  initialIndex?: number;
}

export const PredictionRateCard: React.FC<PredictionRateCardProps> = ({
  predictions,
  initialIndex = 0
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  
  // Add realistic volatility to prediction rate values
  const enhancedPredictions = useMemo(() => {
    if (!predictions || predictions.length === 0) return [];
    
    // Separate historical and future predictions
    const historical = predictions.filter(p => p.isHistorical);
    const future = predictions.filter(p => !p.isHistorical);
    
    // Calculate volatility factor based on historical data
    let volatilityFactor = 0.001; // Default small volatility
    
    if (historical.length > 1) {
      // Calculate average volatility from historical data
      const changes = [];
      for (let i = 1; i < historical.length; i++) {
        const pctChange = Math.abs((historical[i].mean - historical[i-1].mean) / historical[i-1].mean);
        changes.push(pctChange);
      }
      
      if (changes.length > 0) {
        const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length;
        volatilityFactor = avgChange * 0.6; // Scale to make volatility visible but not exaggerated
        
        // Cap volatility at reasonable bounds
        volatilityFactor = Math.min(Math.max(volatilityFactor, 0.0005), 0.005);
      }
    }
    
    // Enhance future predictions with controlled volatility
    const enhancedFuture = future.map((prediction, index) => {
      // First prediction should match to ensure smooth transition
      if (index === 0) return prediction;
      
      // Create a deterministic but varying seed for consistent randomness
      const seedValue = prediction.date.charCodeAt(0) + prediction.date.charCodeAt(1) + index;
      
      // Generate consistent random variations using the seed
      const randomFactorMean = Math.sin(seedValue) * volatilityFactor;
      const randomFactorHigh = Math.sin(seedValue + 1) * volatilityFactor * 1.2; // Slightly more variation in high
      const randomFactorLow = Math.sin(seedValue + 2) * volatilityFactor * 1.2; // Slightly more variation in low
      
      // Apply volatility while preserving high > mean > low relationship
      const adjustedMean = prediction.mean * (1 + randomFactorMean);
      const adjustedHigh = prediction.high * (1 + randomFactorHigh);
      const adjustedLow = prediction.low * (1 + randomFactorLow);
      
      // Ensure high/low bounds remain logical
      return {
        ...prediction,
        mean: adjustedMean,
        high: Math.max(adjustedHigh, adjustedMean * 1.001), // Ensure high > mean
        low: Math.min(adjustedLow, adjustedMean * 0.999)    // Ensure low < mean
      };
    });
    
    // Combine historical and enhanced future predictions
    return [...historical, ...enhancedFuture];
  }, [predictions]);
  
  if (!enhancedPredictions || enhancedPredictions.length === 0) {
    return (
      <div className="bg-[#2a2a40] rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="text-gray-400">No prediction data available</div>
      </div>
    );
  }
  
  const selectedPrediction = enhancedPredictions[selectedIndex] || enhancedPredictions[0];
  
  return (
    <div className="bg-[#2a2a40] rounded-2xl p-6 h-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">Rate Prediction</h3>
        <p className="text-gray-400 text-sm">
          High, mean, and low bounds for each date
        </p>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="text-indigo-400 font-medium">
          {selectedPrediction.date}
          {selectedPrediction.isHistorical && (
            <span className="ml-2 bg-green-500 text-white text-xs py-1 px-2 rounded-full">Historical</span>
          )}
            </div>
          </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#2a2a60] p-3 rounded-lg">
          <div className="text-gray-400 text-xs mb-1">High</div>
          <div className="text-green-400 font-bold">{selectedPrediction.high.toFixed(5)}</div>
        </div>
        <div className="bg-[#3a3a70] p-3 rounded-lg">
          <div className="text-gray-400 text-xs mb-1">Mean</div>
          <div className="text-purple-400 font-bold">{selectedPrediction.mean.toFixed(5)}</div>
        </div>
        <div className="bg-[#2a2a60] p-3 rounded-lg">
          <div className="text-gray-400 text-xs mb-1">Low</div>
          <div className="text-red-400 font-bold">{selectedPrediction.low.toFixed(5)}</div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="text-gray-400 text-sm mb-2">Date Selection</div>
        <div className="grid grid-cols-4 gap-2">
          {enhancedPredictions.map((prediction, index) => (
        <button 
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`p-2 rounded text-center text-xs ${
                index === selectedIndex 
                  ? 'bg-indigo-600 text-white' 
                  : prediction.isHistorical
                    ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                    : 'bg-[#3a3a60] text-gray-300 hover:bg-[#4a4a70]'
              }`}
            >
              {prediction.date.split('/').slice(0, 2).join('/')}
        </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 