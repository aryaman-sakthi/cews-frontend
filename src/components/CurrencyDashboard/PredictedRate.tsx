// src/components/CurrencyDashboard/PredictedRate.tsx
'use client';

import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PredictionData } from '@/types/currency';
import { formatPercentage } from '@/utils/formatters';

interface PredictedRateProps {
  prediction: PredictionData;
}

export const PredictedRate: React.FC<PredictedRateProps> = ({ prediction }) => {
  return (
    <div className="bg-[#2a2a40] rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Predicted Rate</h2>
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <p className="text-gray-400 text-sm">Day</p>
          <p className="text-white text-2xl">{prediction.day}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Rate</p>
          <p className="text-green-500 text-2xl">{prediction.rate}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Change</p>
          <p className="text-green-500 text-2xl">
            {formatPercentage(prediction.change)}
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={prediction.confidence}
            text={`${prediction.confidence}%`}
            styles={buildStyles({
              textColor: 'white',
              pathColor: '#8884d8',
              trailColor: '#2a2a40',
            })}
          />
        </div>
      </div>
    </div>
  );
};