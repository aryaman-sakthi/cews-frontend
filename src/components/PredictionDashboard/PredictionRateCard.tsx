'use client';

import React, { useState } from 'react';

interface PredictionRate {
  date: string;
  high: number;
  mean: number;
  low: number;
}

interface PredictionRateCardProps {
  predictions: PredictionRate[];
  initialIndex?: number;
}

export const PredictionRateCard: React.FC<PredictionRateCardProps> = ({
  predictions,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? predictions.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === predictions.length - 1 ? 0 : prev + 1));
  };
  
  const currentPrediction = predictions[currentIndex];
  
  return (
    <div className="bg-[#2a2a40] rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white text-center mb-6 border-b border-gray-700 pb-2">Predicted Rate</h2>
      
      <div className="flex-grow flex flex-col space-y-5 mb-6">
        {/* High */}
        <div className="bg-[#1e1e30] rounded-xl p-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">High</div>
            <div className="text-2xl font-bold text-green-300">
              {currentPrediction.high.toFixed(7)}
            </div>
          </div>
        </div>
        
        {/* Mean */}
        <div className="bg-[#1e1e30] rounded-xl p-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Mean</div>
            <div className="text-2xl font-bold text-green-300">
              {currentPrediction.mean.toFixed(7)}
            </div>
          </div>
        </div>
        
        {/* Low */}
        <div className="bg-[#1e1e30] rounded-xl p-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Low</div>
            <div className="text-2xl font-bold text-green-300">
              {currentPrediction.low.toFixed(7)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Date Navigation */}
      <div className="flex justify-between items-center">
        <button 
          onClick={handlePrevious}
          className="w-14 h-14 rounded-full bg-[#393959] flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
          aria-label="Previous date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        
        <div className="bg-[#9696fd]/20 px-10 py-4 rounded-xl flex-grow mx-4 flex justify-center">
          <span className="text-white font-semibold text-xl">{currentPrediction.date}</span>
        </div>
        
        <button 
          onClick={handleNext}
          className="w-14 h-14 rounded-full bg-[#393959] flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
          aria-label="Next date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 