'use client';

import React, { useState } from 'react';

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
  
  if (!predictions || predictions.length === 0) {
    return (
      <div className="bg-[#2a2a40] rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="text-gray-400">No prediction data available</div>
      </div>
    );
  }
  
  const selectedPrediction = predictions[selectedIndex];
  
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
          {predictions.map((prediction, index) => (
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