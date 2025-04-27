'use client';

import React, { useState, useEffect } from 'react';
import { PredictionValue } from '@/lib/api';

interface PredictionAlertTileProps {
  baseCurrency: string;
  targetCurrency: string;
  predictedRates?: PredictionValue[];
}

const PredictionAlertTile: React.FC<PredictionAlertTileProps> = ({
  baseCurrency,
  targetCurrency,
  predictedRates = []
}) => {
  const [email, setEmail] = useState('');
  const [threshold, setThreshold] = useState('');
  const [alertType, setAlertType] = useState('above');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  // Update threshold when predicted rates or selected day changes
  useEffect(() => {
    if (predictedRates && predictedRates.length > selectedDay) {
      const predictedRate = predictedRates[selectedDay].mean;
      setThreshold(predictedRate.toFixed(5));
    }
  }, [predictedRates, selectedDay]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const alertData = {
        email,
        threshold: threshold,
        base: baseCurrency,
        target: targetCurrency,
        alert_type: alertType,
      };

      console.log('Sending prediction alert data:', alertData);
     
      const response = await fetch('/api/alerts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setMessage({
          text: `Prediction alert set! We'll notify you when the predicted rate ${alertType === 'above' ? 'rises above' : 'falls below'} ${threshold}.`,
          type: 'success',
        });
        // Reset form
        setEmail('');
      } else {
        setMessage({
          text: `Error: ${data.error || JSON.stringify(data)}`,
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'Failed to register prediction alert. Please try again later.',
        type: 'error',
      });
      console.error('Error registering prediction alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPredictionDays = () => {
    if (!predictedRates || predictedRates.length === 0) {
      return <p className="text-gray-400">No prediction data available</p>;
    }

    return (
      <div className="grid grid-cols-3 gap-2 mb-4">
        {predictedRates.slice(0, 3).map((rate, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`px-3 py-2 rounded-lg text-sm ${
              selectedDay === index 
                ? 'bg-purple-600 text-white' 
                : 'bg-[#2a2a40]/80 text-gray-300 hover:bg-[#2a2a40] transition-colors'
            }`}
          >
            <div className="font-semibold">{formatDate(rate.timestamp)}</div>
            <div className="text-xs opacity-80">Pred. {rate.mean.toFixed(5)}</div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#2a2a40]/50 to-[#2a2a40]/10 rounded-3xl p-6">
      <h3 className="text-xl text-white font-semibold mb-3">
        Prediction Alert
      </h3>
      <p className="text-gray-300 mb-4 text-sm">
        Get notified when our AI predicts significant changes for {baseCurrency}/{targetCurrency}.
      </p>
      
      {renderPredictionDays()}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="prediction-email" className="block text-left text-sm text-gray-300 mb-1">Email Address</label>
          <input
            id="prediction-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-[#2a2a40]/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {/* Alert Type and Threshold */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="prediction-alert-type" className="block text-left text-sm text-gray-300 mb-1">Alert When Rate Is</label>
            <select
              id="prediction-alert-type"
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a40]/80 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <div>
            <label htmlFor="prediction-threshold" className="block text-left text-sm text-gray-300 mb-1">Threshold Value</label>
            <input
              id="prediction-threshold"
              type="number"
              step="0.00001"
              min="0"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#2a2a40]/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg text-white font-semibold disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Setting Alert...' : 'Set Prediction Alert'}
        </button>
        
        {/* Success/Error Message */}
        {message && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-800/50 text-green-200' : 'bg-red-800/50 text-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default PredictionAlertTile; 