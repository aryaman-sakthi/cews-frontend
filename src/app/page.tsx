// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CurrencyConverter } from '@/components/CurrencyDashboard/CurrencyConverter';
import { ConversionChart } from '@/components/CurrencyDashboard/ConversionChart';
import { MarketNews } from '@/components/CurrencyDashboard/MarketNews';
import { PredictedRate } from '@/components/CurrencyDashboard/PredictedRate';
import { AlertSubscription } from '@/components/CurrencyDashboard/AlertSubscription';
import { fetchExchangeRate } from '@/lib/api';
import { supportedCurrencies } from '@/utils/currencyData';

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('AUD');
  const [rate, setRate] = useState(0); // Start with 0, will be populated from API
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch exchange rate when currencies change or on initial load
  useEffect(() => {
    const getExchangeRate = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      try {
        console.log(`Fetching rate for ${fromCurrency} to ${toCurrency}...`);
        const newRate = await fetchExchangeRate(fromCurrency, toCurrency);
        console.log(`Received rate: ${newRate}`);
        
        setRate(newRate);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setError(`Failed to fetch exchange rate. Please try again later.`);
        // Keep the previous rate if available
        if (rate === 0) {
          setRate(1.0); // Default for UI to avoid division by zero
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Call the function to fetch the exchange rate
    getExchangeRate();
    
    // Also set up a refresh interval (every 60 seconds)
    const intervalId = setInterval(getExchangeRate, 60000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [fromCurrency, toCurrency]);
  
  // Data structure with dynamic values from the API
  const data = {
    from: fromCurrency,
    to: toCurrency,
    rate: rate,
    amount: amount,
    convertedAmount: amount * rate,
    lastUpdated: lastUpdated,
  };

  // Sample chart data that would be updated based on historical rates
  const chartData = [
    { date: 'Nov 1', value: rate * 0.95 }, // Simulate historical data based on current rate
    { date: 'Nov 15', value: rate * 0.97 },
    { date: 'Nov 30', value: rate },
  ];

  const news = [
    {
      id: '1',
      title: `${fromCurrency}/${toCurrency} Market Update`,
      imageUrl: '/news/1.jpg',
    },
    // Add more news items
  ];

  const prediction = {
    day: 3,
    rate: rate * 1.05, // Example: 5% higher rate prediction
    change: 5.0,
    confidence: 82.5,
  };

  const handleFromCurrencyChange = (currency: string) => {
    if (currency === toCurrency) {
      setToCurrency(fromCurrency); // Swap currencies if same one is selected
    }
    setFromCurrency(currency);
  };

  const handleToCurrencyChange = (currency: string) => {
    if (currency === fromCurrency) {
      setFromCurrency(toCurrency); // Swap currencies if same one is selected
    }
    setToCurrency(currency);
  };

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Currency Dashboard</h1>
          <Link 
            href="/historical" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            View Historical
          </Link>
          <Link 
            href="/predictions" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            View Predictions
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#2a2a40] rounded-2xl p-6">
              {isLoading ? (
                <div className="flex justify-center items-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-900/30 text-red-200 p-3 mb-4 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <CurrencyConverter 
                    data={data} 
                    onAmountChange={setAmount} 
                    onFromCurrencyChange={handleFromCurrencyChange}
                    onToCurrencyChange={handleToCurrencyChange}
                    currencies={supportedCurrencies}
                  />
                </>
              )}
              <ConversionChart 
                data={chartData} 
                rate={rate} 
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
              />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <MarketNews news={news} />
            <PredictedRate prediction={prediction} />
          </div>
        </div>
        
        <AlertSubscription />
      </div>
    </main>
  );
}