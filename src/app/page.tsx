// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { CurrencyConverter } from '@/components/CurrencyDashboard/CurrencyConverter';
import { ConversionChart } from '@/components/CurrencyDashboard/ConversionChart';
import { MarketNews } from '@/components/CurrencyDashboard/MarketNews';
import { PredictedRate } from '@/components/CurrencyDashboard/PredictedRate';
import { AlertSubscription } from '@/components/CurrencyDashboard/AlertSubscription';
import { fetchCurrentRate } from '@/lib/api';

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [rateData, setRateData] = useState({
    from: 'USD',
    to: 'AUD',
    rate: 0,
    amount: 1000,
    convertedAmount: 0
  });
  
  // Sample data - replace with real data from API
  const getRates = async () => {
    try {
      const data = await fetchCurrentRate('USD', 'AUD');
      setRateData({
        from: data.from,
        to: data.to,
        rate: data.rate,
        amount: amount,
        convertedAmount: amount * data.rate
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  console.log("please")

  const chartData = [
    { date: 'Nov 1', value: 52 },
    { date: 'Nov 15', value: 48 },
    { date: 'Nov 30', value: 65 },
  ];

  const news = [
    {
      id: '1',
      title: 'AUD/JPY falls to near 94',
      imageUrl: '/news/1.jpg',
    },
    // Add more news items
  ];

  const prediction = {
    day: 3,
    rate: 1.095,
    change: 1.75,
    confidence: 82.5,
  };

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#2a2a40] rounded-2xl p-6">
              <CurrencyConverter data={data} onAmountChange={setAmount} />
              <ConversionChart data={chartData} rate={data.rate} />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <MarketNews news={news} />
            <PredictedRate prediction={prediction} />
          </div>
        </div>
        
        {/* Add the AlertSubscription component */}
        <AlertSubscription />
      </div>
    </main>
  );
}