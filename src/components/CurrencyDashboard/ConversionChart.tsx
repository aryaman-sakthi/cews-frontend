'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchHistoricalExchangeRate } from '@/lib/api'; // Ensure this path is correct

interface ChartData {
  date: string;
  value: number;
}

interface ConversionChartProps {
  fromCurrency: string;
  toCurrency: string;
}

export const ConversionChart: React.FC<ConversionChartProps> = ({
  fromCurrency,
  toCurrency,
}) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const historicalData = await fetchHistoricalExchangeRate(fromCurrency, toCurrency);

        const formattedData = historicalData.map((point: any) => ({
          date: point.date,
          value: point.close,
        }));

        setData(formattedData);
        setRate(formattedData.at(-1)?.value ?? 0);
      } catch (error) {
        console.error('Failed to load historical data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [fromCurrency, toCurrency]);

  if (loading) {
    return <div className="text-gray-400 text-center py-10">Loading chart...</div>;
  }

  if (data.length === 0) {
    return <div className="text-gray-400 text-center py-10">No data available.</div>;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-400">
          {fromCurrency} to {toCurrency} conversion chart
        </span>
        <span className="text-white">
          1 {fromCurrency} = {rate.toFixed(5)} {toCurrency}
        </span>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            angle={-45} 
            textAnchor="end" 
            interval="preserveStartEnd"
            height={60} 
            style={{ fontSize: '10px' }}
          />
            <YAxis stroke="#666" />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(5)} ${toCurrency}`, 'Rate']}
              labelFormatter={(label) => `Date: ${label}`}
            />
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
