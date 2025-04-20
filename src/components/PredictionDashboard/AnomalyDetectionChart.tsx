'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceDot
} from 'recharts';
import { AnomalyPoint } from '@/lib/api';

interface AnomalyDetectionChartProps {
  anomalyPoints: AnomalyPoint[];
  exchangeRates?: Array<{date: string; rate: number}>;
  baseCurrency: string;
  targetCurrency: string;
}

interface TooltipPayload {
  payload: {
    date: string;
    rate: number;
    timestamp?: string;
    z_score?: number;
    percent_change?: number;
    isAnomaly: boolean;
  };
  [key: string]: unknown;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

// Chart colors
const CHART_COLORS = {
  line: '#9b96fd',
  dots: {
    positive: '#ff5e5e',
    negative: '#5e7eff'
  },
  tooltip: {
    bg: '#1e1e30',
    text: '#ffffff',
    border: '#4b4b60'
  }
};

// Define chart data interface
interface ChartDataPoint {
  date: string;
  rate: number;
  timestamp?: string;
  z_score?: number;
  percent_change?: number;
  isAnomaly: boolean;
}

// Helper function to add ordinal suffix to day (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

// Parse a date string that could be in various formats
const parseDate = (dateStr: string): Date => {
  // Try to parse the date directly first
  let date = new Date(dateStr);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    // If not valid, it might be in DD/MM/YYYY format
    const parts = dateStr.split(/[\/\-\.]/);
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY format
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    }
  }
  
  return date;
};

// Format a date nicely with ordinal suffix (e.g., "9th April")
const formatDateNicely = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseDate(dateInput) : dateInput;
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  return `${day}${suffix} ${date.toLocaleDateString('en-GB', { month: 'long' })}`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const anomalyData = payload[0].payload;
    const isAnomalyPoint = anomalyData.isAnomaly;
    
    if (!isAnomalyPoint) return null;
    
    return (
      <div className="bg-[#1e1e30] p-3 rounded shadow-lg border border-[#4b4b60] text-sm">
        <div className="font-medium text-white mb-1">Anomaly Detected</div>
        <div className="text-gray-300">
          <div>Date: {formatDateNicely(anomalyData.timestamp || anomalyData.date || '')}</div>
          <div>Rate: {anomalyData.rate.toFixed(4)}</div>
          <div className="flex items-center">
            <span>Z-Score: </span>
            <span className={(anomalyData.z_score || 0) > 0 ? 'text-red-400 ml-1' : 'text-blue-400 ml-1'}>
              {(anomalyData.z_score || 0).toFixed(2)}
            </span>
          </div>
          <div>Change: {(anomalyData.percent_change || 0).toFixed(2)}%</div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {Math.abs(anomalyData.z_score || 0) > 3 
            ? 'Extreme anomaly - significant deviation from normal pattern' 
            : 'Moderate anomaly - unusual movement detected'}
        </div>
      </div>
    );
  }
  
  return null;
};

export const AnomalyDetectionChart: React.FC<AnomalyDetectionChartProps> = ({
  anomalyPoints,
  exchangeRates = [],
  baseCurrency,
  targetCurrency
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Prepare chart data by merging exchange rates with anomaly points
  useEffect(() => {
    // First, create a map of dates to anomaly points for quick lookup
    const anomalyMap = new Map();
    
    anomalyPoints.forEach(point => {
      // Use a simplified date string for matching
      const date = parseDate(point.timestamp);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format for consistent matching
      anomalyMap.set(dateStr, point);
    });
    
    // If we have exchange rates, use them as the base data
    if (exchangeRates && exchangeRates.length > 0) {
      const data = exchangeRates.map(item => {
        // Use a simplified date string for matching
        const date = parseDate(item.date);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const anomaly = anomalyMap.get(dateStr);
        
        return {
          date: date.toISOString(), // Store as ISO string for consistent parsing
          rate: item.rate,
          ...(anomaly ? {
            timestamp: anomaly.timestamp,
            z_score: anomaly.z_score,
            percent_change: anomaly.percent_change,
            isAnomaly: true
          } : {
            isAnomaly: false
          })
        };
      });
      
      setChartData(data as ChartDataPoint[]);
    } else {
      // If no exchange rates, just use anomaly points
      const data = anomalyPoints.map(point => {
        const date = parseDate(point.timestamp);
        return {
          date: date.toISOString(), // Store as ISO string for consistent parsing
          timestamp: point.timestamp,
          rate: point.rate,
          z_score: point.z_score,
          percent_change: point.percent_change,
          isAnomaly: true
        };
      });
      
      // Sort by date
      data.sort((a, b) => parseDate(a.timestamp || '').getTime() - parseDate(b.timestamp || '').getTime());
      
      setChartData(data);
    }
  }, [anomalyPoints, exchangeRates]);
  
  // Handle empty data state
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-400">No anomaly data available</div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="mb-4 text-gray-400 text-sm">
        This chart shows detected anomalies in the {baseCurrency}/{targetCurrency} exchange rate. 
        Anomalies are unusual price movements that deviate significantly from normal patterns.
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333345" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#9b9bb2' }} 
              tickFormatter={(val) => formatDateNicely(val)}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fill: '#9b9bb2' }}
              tickFormatter={(val) => val.toFixed(2)}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke={CHART_COLORS.line} 
              dot={false}
              activeDot={{ r: 6, stroke: '#7a7aff', strokeWidth: 1, fill: '#4b4bff' }}
            />
            
            {/* Render special markers for anomaly points */}
            {chartData.filter(item => item.isAnomaly).map((anomaly, index) => (
              <ReferenceDot
                key={index}
                x={anomaly.date}
                y={anomaly.rate}
                r={6}
                fill={(anomaly.z_score || 0) > 0 ? CHART_COLORS.dots.positive : CHART_COLORS.dots.negative}
                stroke="#ffffff"
                strokeWidth={1}
                isFront={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-center items-center gap-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs text-gray-400">Positive anomaly (sudden increase)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs text-gray-400">Negative anomaly (sudden decrease)</span>
        </div>
      </div>
    </div>
  );
}; 