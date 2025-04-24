// src/components/CurrencyDashboard/AlertSubscription.tsx
'use client';
 
import React, { useState } from 'react';

export const AlertSubscription = () => {
  const [email, setEmail] = useState('');
  const [threshold, setThreshold] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your alert subscription logic here
    console.log('Subscription data:', { email, threshold });
  };

  return (
    <div className="mt-12 text-center px-4 py-8 bg-gradient-to-b from-[#2a2a40]/50 to-[#2a2a40]/10 rounded-3xl">
      <h2 className="text-2xl text-white font-semibold mb-4">
        Waiting on a better rate?
      </h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        Set an alert now, and we&apos;ll tell you when it gets better. And with our daily summaries,
        you&apos;ll never miss out on the latest news.
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-3 bg-[#2a2a40]/80 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <input
          type="number"
          placeholder="Threshold value"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="w-full px-6 py-3 bg-[#2a2a40]/80 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-xl text-white font-semibold"
        >
          Set Alert
        </button>
      </form>
    </div>
  );
};