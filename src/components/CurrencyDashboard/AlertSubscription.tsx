'use client';
 
import React, { useState } from 'react';

interface AlertSubscriptionProps {
  fromCurrency?: string;
  toCurrency?: string;
  currentRate?: number;
}

export const AlertSubscription: React.FC<AlertSubscriptionProps> = ({ 
  fromCurrency = 'USD', 
  toCurrency = 'EUR', 
  currentRate = 0 
}) => {
  const [email, setEmail] = useState('');
  const [threshold, setThreshold] = useState('');
  const [alertType, setAlertType] = useState('above');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const alertData = {
        email,
        threshold: parseFloat(threshold),
        base: fromCurrency,
        target: toCurrency,
        alert_type: alertType,
      };

      // Make POST request to your API
      const response = await fetch('/api/alerts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: `Alert successfully registered with ID: ${data.alert_id}`,
          type: 'success',
        });
        // Reset form
        setEmail('');
        setThreshold('');
      } else {
        setMessage({
          text: `Error: ${JSON.stringify(data)}`,
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'Failed to register alert. Please try again later.',
        type: 'error',
      });
      console.error('Error registering alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe currency display with fallbacks
  const displayFromCurrency = fromCurrency || 'USD';
  const displayToCurrency = toCurrency || 'EUR';
  const displayRate = currentRate || 0;

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
        {/* Display Selected Currencies */}
        <div className="bg-[#2a2a40]/80 rounded-xl p-4 mb-2">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs font-bold">
                {displayFromCurrency.substring(0, 2)}
              </div>
              <span className="ml-2 text-white">{displayFromCurrency}</span>
            </div>
            
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs font-bold">
                {displayToCurrency.substring(0, 2)}
              </div>
              <span className="ml-2 text-white">{displayToCurrency}</span>
            </div>
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Current rate: <span className="text-white font-medium">{displayRate.toFixed(5)}</span>
          </div>
        </div>
        
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-left text-sm text-gray-300 mb-1">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-6 py-3 bg-[#2a2a40]/80 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {/* Alert Type and Threshold */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="alert-type" className="block text-left text-sm text-gray-300 mb-1">Alert When Rate Is</label>
            <select
              id="alert-type"
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="w-full px-6 py-3 bg-[#2a2a40]/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <div>
            <label htmlFor="threshold" className="block text-left text-sm text-gray-300 mb-1">Threshold Value</label>
            <input
              id="threshold"
              type="number"
              placeholder={displayRate.toFixed(5)}
              step="0.000001"
              min="0"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
              className="w-full px-6 py-3 bg-[#2a2a40]/80 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-xl text-white font-semibold disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Setting Alert...' : 'Set Alert'}
        </button>
        
        {/* Success/Error Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-800/50 text-green-200' : 'bg-red-800/50 text-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};