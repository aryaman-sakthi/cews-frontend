'use client';

import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface PredictionTilesProps {
  confidence: number;
  predictedRate: number;
  fromCurrency: string;
  toCurrency: string;
  predictionChange: number;
}

export const PredictionTiles: React.FC<PredictionTilesProps> = ({
  confidence,
  predictedRate,
  fromCurrency,
  toCurrency,
  predictionChange
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Confidence Score Tile */}
      <div className="bg-[#2a2a40] rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Confidence Score</h3>
        <div className="flex justify-center">
          <div className="w-40 h-40">
            <CircularProgressbar
              value={confidence}
              text={`${confidence}%`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: confidence > 75 ? '#4ade80' : confidence > 50 ? '#facc15' : '#ef4444',
                textColor: '#ffffff',
                trailColor: '#3d3d5c',
              })}
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-400">
            {confidence > 75 
              ? 'High confidence in prediction' 
              : confidence > 50 
                ? 'Moderate confidence in prediction' 
                : 'Low confidence in prediction'
            }
          </p>
        </div>
      </div>

      {/* Prediction Rate Tile */}
      <div className="bg-[#2a2a40] rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Predicted Rate</h3>
        <div className="flex flex-col items-center justify-center h-40">
          <div className="text-3xl font-bold text-white">
            {predictedRate.toFixed(5)}
          </div>
          <div className="text-lg text-gray-300 mt-2">
            1 {fromCurrency} = {predictedRate.toFixed(5)} {toCurrency}
          </div>
          <div className={`flex items-center mt-4 ${predictionChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <span className="text-xl font-semibold">
              {predictionChange > 0 ? '+' : ''}{predictionChange.toFixed(2)}%
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ml-1 ${predictionChange > 0 ? 'rotate-0' : 'rotate-180'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4.5-4.5a1 1 0 011.414 0l4.5 4.5a1 1 0 01-1.414 1.414L10 3.414 5.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}; 