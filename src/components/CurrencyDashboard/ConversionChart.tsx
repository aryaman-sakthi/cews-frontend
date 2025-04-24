'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchHistoricalExchangeRate } from '@/lib/api';

interface HistoricalDataPoint {
  date: string;
  close: number;
}

interface ChartData {
  date: string;
  value: number;
}

interface ConversionChartProps {
  fromCurrency: string;
  toCurrency: string;
}

type Range = '5y' | '1y' | '6m' | '1m' | '1w' | 'all';

export const ConversionChart: React.FC<ConversionChartProps> = ({
  fromCurrency,
  toCurrency,
}) => {
  const [fullData, setFullData] = useState<ChartData[]>([]);
  const [filteredData, setFilteredData] = useState<ChartData[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<Range>('1y');

  const filterDataByRange = (data: ChartData[], range: Range) => {
    if (range === 'all') return data;

    const now = new Date();
    const startDate = new Date(
      range === '5y' ? now.setFullYear(now.getFullYear() - 5)
      : range === '1y' ? now.setFullYear(now.getFullYear() - 1)
      : range === '6m' ? now.setMonth(now.getMonth() - 6)
      : range === '1m' ? now.setMonth(now.getMonth() - 1)
      : range === '1w' ? now.setDate(now.getDate() - 7)
      : now
    );

    return data.filter(point => new Date(point.date) >= startDate);
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const historicalData = await fetchHistoricalExchangeRate(fromCurrency, toCurrency);
        const formattedData = historicalData.map((point: HistoricalDataPoint) => ({
          date: point.date,
          value: point.close,
        }));
        setFullData(formattedData);
        setFilteredData(filterDataByRange(formattedData, selectedRange));
        setRate(formattedData.at(-1)?.value ?? 0);
      } catch (error) {
        console.error('Failed to load historical data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [fromCurrency, toCurrency, selectedRange]);

  useEffect(() => {
    setFilteredData(filterDataByRange(fullData, selectedRange));
  }, [selectedRange, fullData]);

  if (loading) {
    return <div className="text-gray-400 text-center py-10">Loading chart...</div>;
  }

  if (filteredData.length === 0) {
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
          <LineChart data={filteredData}>
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              angle={-45} 
              textAnchor="end" 
              interval="preserveStartEnd"
              height={60} 
              style={{ fontSize: '10px' }}
            />
            <YAxis
              stroke="#666"
              domain={['auto', 'auto']}
              tickCount={6}
              tickFormatter={(val) => val.toFixed(2)}
              padding={{ top: 20, bottom: 10 }} // Add padding to the top and bottom
            />
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

      {/* Time Range Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {(['5y', '1y', '6m', '1m', '1w', 'all'] as Range[]).map((range) => (
          <button
            key={range}
            className={`px-3 py-1 rounded-full text-sm transition ${
              selectedRange === range
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedRange(range)}
          >
            {range === '5y' && '5Y'}
            {range === '1y' && '1Y'}
            {range === '6m' && '6M'}
            {range === '1m' && '1M'}
            {range === '1w' && '1W'}
            {range === 'all' && 'All'}
          </button>
        ))}
      </div>
    </div>
  );
};
