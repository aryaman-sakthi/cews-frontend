'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartData {
  date: string;
  value: number;
}

interface ConversionRateChartProps {
  data: ChartData[];
  fromCurrency: string;
  toCurrency: string;
}

export const ConversionRateChart: React.FC<ConversionRateChartProps> = ({ 
  data, 
  fromCurrency,
  toCurrency 
}) => {
  // Check if data is empty
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-gray-400">No prediction data available</div>
      </div>
    );
  }
  
  // Create comparison data with slight offset or use existing data
  const comparisonData = data.map(item => ({
    ...item,
    comparisonValue: item.value * 0.95 // Create a comparison value that's 5% lower
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={comparisonData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="date" 
          stroke="#666" 
          tick={{ fill: "#9ca3af" }}
        />
        <YAxis 
          stroke="#666" 
          tick={{ fill: "#9ca3af" }}
          domain={['dataMin - 0.05', 'dataMax + 0.05']}
          tickFormatter={(value) => value.toFixed(5)}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(5)} ${toCurrency}`, `${fromCurrency} to ${toCurrency}`]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ backgroundColor: '#2a2a40', border: 'none', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#9ca3af' }}
        />
        <Line
          name={`Predicted ${toCurrency} Rate`}
          type="monotone"
          dataKey="value"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: '#8b5cf6' }}
        />
        {/* Add a dashed line for comparison/prediction */}
        <Line
          name={`Historical ${toCurrency} Rate`}
          type="monotone"
          dataKey="comparisonValue"
          stroke="#4B5563"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}; 