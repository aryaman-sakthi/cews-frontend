'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface ChartData {
  date: string;
  value: number;
  isHistorical?: boolean;
  predictedValue?: number;
  historicalValue?: number;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const safeData = data && data.length > 0 ? data : [];
  
  // Find the current date (separating historical from future predictions)
  const today = new Date().toISOString().split('T')[0];
  
  // Add realistic volatility to prediction data while maintaining the trend
  const enhancedChartData = useMemo(() => {
    // If no data, return empty array
    if (safeData.length === 0) return [];
    
    // Separate historical and predicted data
    const historical = safeData.filter(d => d.isHistorical);
    const predicted = safeData.filter(d => !d.isHistorical);
    
    // If we have historical data, calculate its volatility
    let volatilityFactor = 0.001; // Default small volatility
    
    if (historical.length > 1) {
      // Calculate the average daily change percentage in historical data
      const changes = [];
      for (let i = 1; i < historical.length; i++) {
        const pctChange = Math.abs((historical[i].value - historical[i-1].value) / historical[i-1].value);
        changes.push(pctChange);
      }
      
      // Use the average historical volatility as our factor
      const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length;
      volatilityFactor = avgChange * 0.5; // Scale down slightly to make predictions look smoother
      
      // Cap the volatility factor at reasonable bounds
      volatilityFactor = Math.min(Math.max(volatilityFactor, 0.0005), 0.005);
    }
    
    // Generate enhanced prediction data with controlled volatility
    const enhancedPredicted = predicted.map((point, index) => {
      // First prediction point should match exactly to ensure smooth transition
      if (index === 0) return point;
      
      // Apply volatility - use the point's index to ensure consistent randomness
      // Seed the random generator with the date string to ensure consistency
      const seedValue = point.date.charCodeAt(0) + point.date.charCodeAt(1) + index;
      const randomFactor = Math.sin(seedValue) * volatilityFactor;
      
      // Apply the volatility to create a "wiggly" effect without changing overall trend
      return {
        ...point,
        predictedValue: point.value * (1 + randomFactor)
      };
    });
    
    // Combine the historical data with the enhanced predictions
    return [
      ...historical.map(item => ({
        ...item,
        predictedValue: item.isHistorical ? null : item.value,
        historicalValue: item.isHistorical ? item.value : null
      })),
      ...enhancedPredicted.map(item => ({
        ...item,
        predictedValue: item.predictedValue || item.value,
        historicalValue: null
      }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [safeData]);
  
  // Check if data is empty
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-gray-400">No prediction data available</div>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={enhancedChartData}>
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