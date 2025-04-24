'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface ChartData {
  date: string;
  value: number;
  isHistorical?: boolean;
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
  
  // Find the current date (separating historical from future predictions)
  const today = new Date().toISOString().split('T')[0];
  
  // Group data for better visualization
  const chartData = data.map(item => ({
    ...item,
    predictedValue: item.isHistorical ? null : item.value,
    historicalValue: item.isHistorical ? item.value : null
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
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
          formatter={(value: number, name: string) => {
            if (name === "Future Prediction") {
              return [`${value.toFixed(5)} ${toCurrency}`, `Predicted ${fromCurrency} to ${toCurrency}`];
            } else {
              return [`${value.toFixed(5)} ${toCurrency}`, `Historical ${fromCurrency} to ${toCurrency}`];
            }
          }}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ backgroundColor: '#2a2a40', border: 'none', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#9ca3af' }}
        />
        
        {/* Reference line for today's date */}
        <ReferenceLine x={today} stroke="#fff" strokeDasharray="3 3" label={{
          value: "Today",
          position: "top",
          fill: "#fff"
        }} />
        
        {/* Historical data line */}
        <Line
          name="Historical Data"
          type="monotone"
          dataKey="historicalValue"
          stroke="#4ade80"
          strokeWidth={3}
          dot={{ r: 3, fill: '#4ade80' }}
          activeDot={{ r: 6, fill: '#4ade80' }}
          connectNulls
        />
        
        {/* Future prediction line */}
        <Line
          name="Future Prediction"
          type="monotone"
          dataKey="predictedValue"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ r: 3, fill: '#8b5cf6' }}
          activeDot={{ r: 6, fill: '#8b5cf6' }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}; 