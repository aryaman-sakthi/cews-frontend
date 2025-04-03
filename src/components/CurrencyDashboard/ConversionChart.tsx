// src/components/CurrencyDashboard/ConversionChart.tsx
'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  value: number;
}

interface ConversionChartProps {
  data: ChartData[];
  rate: number;
}

export const ConversionChart: React.FC<ConversionChartProps> = ({ data, rate }) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-400">USD to AUD conversion chart</span>
        <span className="text-white">1 USD = {rate.toFixed(5)} AUD</span>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};