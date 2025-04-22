'use client';

import React from 'react';
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
    
    // Show basic tooltip for all points
    if (!isAnomalyPoint) {
      return (
        <div className="bg-[#1e1e30] p-3 rounded shadow-lg border border-[#4b4b60] text-sm">
          <div className="font-medium text-white mb-1">Exchange Rate</div>
          <div className="text-gray-300">
            <div>Date: {formatDateNicely(anomalyData.timestamp || anomalyData.date || '')}</div>
            <div>Rate: {anomalyData.rate.toFixed(4)}</div>
          </div>
        </div>
      );
    }
    
    // Enhanced tooltip for anomalies
    return (
      <div className="bg-[#1e1e30] p-3 rounded shadow-lg border border-[#4b4b60] text-sm max-w-xs">
        <div className="font-bold text-red-400 mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Anomaly Detected
        </div>
        <div className="text-gray-300">
          <div>Date: {formatDateNicely(anomalyData.timestamp || anomalyData.date || '')}</div>
          <div>Rate: {anomalyData.rate.toFixed(4)}</div>
          <div className="flex items-center">
            <span>Z-Score: </span>
            <span className={(anomalyData.z_score || 0) > 0 ? 'text-red-400 ml-1' : 'text-blue-400 ml-1'}>
              {(anomalyData.z_score || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center">
            <span>Change: </span>
            <span className={(anomalyData.percent_change || 0) > 0 ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
              {(anomalyData.percent_change || 0).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {Math.abs(anomalyData.z_score || 0) > 3 
            ? 'Extreme anomaly - significant deviation indicating a major market event' 
            : Math.abs(anomalyData.z_score || 0) > 2
              ? 'Strong anomaly - unusual price movement that warrants attention'
              : 'Moderate anomaly - unusual but not extreme price movement'}
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
  // We'll replace the useState + useEffect approach with useMemo
  // This prevents the infinite update loop by only recalculating when dependencies change
  const chartData = React.useMemo(() => {
    // Handle empty data case
    if (!anomalyPoints || !Array.isArray(anomalyPoints) || anomalyPoints.length === 0) {
      return [];
    }

    try {
      // Filter out invalid data points
      const validAnomalyPoints = anomalyPoints.filter(point => 
        point && typeof point === 'object' && 
        'timestamp' in point && 'rate' in point &&
        !isNaN(parseFloat(String(point.rate)))
      );

      if (validAnomalyPoints.length === 0) {
        return [];
      }

      // Create a map of dates to anomaly points for lookup
      const anomalyMap = new Map();
      validAnomalyPoints.forEach(point => {
        try {
          const date = parseDate(point.timestamp);
          if (isNaN(date.getTime())) return;
          const dateStr = date.toISOString().split('T')[0];
          anomalyMap.set(dateStr, point);
        } catch {
          // Skip invalid dates
        }
      });

      let result: ChartDataPoint[] = [];

      // If we have exchange rates, use them as the base
      if (exchangeRates && exchangeRates.length > 0) {
        result = exchangeRates
          .map(item => {
            try {
              const date = parseDate(item.date);
              const dateStr = date.toISOString().split('T')[0];
              const anomaly = anomalyMap.get(dateStr);

              return {
                date: date.toISOString(),
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
            } catch {
              return null;
            }
          })
          .filter(Boolean) as ChartDataPoint[];
      } else {
        // If no exchange rates, just use anomaly points
        result = validAnomalyPoints
          .map(point => {
            try {
              const date = parseDate(point.timestamp);
              return {
                date: date.toISOString(),
                timestamp: point.timestamp,
                rate: point.rate,
                z_score: point.z_score,
                percent_change: point.percent_change,
                isAnomaly: true
              };
            } catch {
              return null;
            }
          })
          .filter(Boolean) as ChartDataPoint[];

        // Sort by date
        result.sort((a, b) => {
          try {
            const dateA = parseDate(a.timestamp || '').getTime();
            const dateB = parseDate(b.timestamp || '').getTime();
            return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
          } catch {
            return 0;
          }
        });
      }

      return result;
    } catch (err) {
      console.error('Error processing anomaly data:', err);
      return [];
    }
  }, [anomalyPoints, exchangeRates]); // Only recalculate when these props change
  
  // Handle empty data state
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No anomaly data available
      </div>
    );
  }
  
  // Get min/max for y-axis domain padding
  const rates = chartData.map(d => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const padding = (maxRate - minRate) * 0.1; // 10% padding
  
  return (
    <div className="w-full">
      <div className="mb-4 text-gray-400 text-sm">
        This chart shows detected anomalies in the {baseCurrency}/{targetCurrency} exchange rate. 
        Anomalies are unusual price movements that deviate significantly from normal patterns.
      </div>
      
      <div className="h-64">
        {/* Use fixed width and height fallbacks to prevent resize observer issues */}
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333345" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(dateStr) => {
                try {
                  const date = new Date(dateStr);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } catch {
                  return '';
                }
              }}
              tick={{ fill: '#9b96fd70' }}
            />
            <YAxis 
              domain={[minRate - padding, maxRate + padding]} 
              tickFormatter={(value) => value.toFixed(2)}
              tick={{ fill: '#9b96fd70' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke={CHART_COLORS.line} 
              dot={false}
              strokeWidth={2}
            />
            
            {/* Add reference dots for anomalies */}
            {chartData
              .filter(point => point.isAnomaly)
              .map((point, index) => {
                const isPositive = (point.z_score || 0) > 0;
                const severity = Math.abs(point.z_score || 0);
                // Scale dot size based on severity
                const r = severity > 3 ? 12 : severity > 2 ? 10 : 8;
                
                return (
                  <ReferenceDot
                    key={`anomaly-${index}`}
                    x={point.date}
                    y={point.rate}
                    r={r}
                    fill={isPositive ? CHART_COLORS.dots.positive : CHART_COLORS.dots.negative}
                    stroke="#fff"
                    strokeWidth={2}
                    isFront={true}
                  />
                );
              })
            }
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