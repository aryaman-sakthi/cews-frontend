'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchHistoricalExchangeRate } from '@/lib/api'; // Assuming you have this function
import { supportedCurrencies } from '@/utils/currencyData';
import { HistoricalChartContainer } from '@/components/HistoricalDashboard/HistoricalChartContainer';

export default function HistoricalRates() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('AUD');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHistoricalData = async () => {
      try {
        setError(null); // Reset error before fetching
        // Use your fetch function to get historical data
        await fetchHistoricalExchangeRate(fromCurrency, toCurrency); // This will be used in the HistoricalChartContainer
      } catch (err) {
        console.error('Error fetching historical data:', err);
        setError('Failed to fetch historical exchange rates.');
      }
    };

    getHistoricalData();
  }, [fromCurrency, toCurrency]);

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Historical Exchange Rates</h1>
          <Link
            href="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-[#2a2a40] rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fromCurrency" className="block mb-2 text-sm font-medium text-gray-300">
                From Currency
              </label>
              <select
                id="fromCurrency"
                className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-gray-700"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {supportedCurrencies.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.name} ({cur.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="toCurrency" className="block mb-2 text-sm font-medium text-gray-300">
                To Currency
              </label>
              <select
                id="toCurrency"
                className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-gray-700"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {supportedCurrencies.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.name} ({cur.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 bg-red-900/30 text-red-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Chart */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Historical Chart</h2>
            <div className="bg-[#1a1a2e] border border-gray-700 rounded-xl h-[300px] p-4">
              <HistoricalChartContainer
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
