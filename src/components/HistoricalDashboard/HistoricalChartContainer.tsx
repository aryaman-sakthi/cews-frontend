// src/components/Chart/HistoricalChartContainer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ConversionChart } from '../CurrencyDashboard/ConversionChart';
import { fetchHistoricalExchangeRate } from '@/lib/api'; 

interface HistoricalChartContainerProps {
  fromCurrency: string;
  toCurrency: string;
}

export const HistoricalChartContainer: React.FC<HistoricalChartContainerProps> = ({
  fromCurrency,
  toCurrency,
}) => {
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        // Call the function you created to fetch historical exchange rates
        const historicalData = await fetchHistoricalExchangeRate(fromCurrency, toCurrency);

        // Map the historical data to the format expected by the chart
        const formattedData = historicalData.map((point) => ({
          date: point.date,
          value: point.close, // Using 'close' value for the exchange rate
        }));

        // Update state with the formatted data
        setChartData(formattedData);
        setRate(formattedData.at(-1)?.value ?? 0); // Set the latest rate (last value in the array)
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

  if (chartData.length === 0) {
    return <div className="text-gray-400 text-center py-10">No data available.</div>;
  }

  return (
    <ConversionChart
      data={chartData}
      rate={rate}
      fromCurrency={fromCurrency}
      toCurrency={toCurrency}
    />
  );
};
