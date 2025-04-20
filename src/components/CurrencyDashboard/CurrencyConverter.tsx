// src/components/CurrencyDashboard/CurrencyConverter.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { CurrencyRate } from '@/types/currency';
import { formatCurrency } from '@/utils/formatters';
import { Currency } from '@/utils/currencyData';

// Extend CurrencyRate to include lastUpdated
interface ExtendedCurrencyRate extends CurrencyRate {
  lastUpdated?: Date | null;
}

interface CurrencyConverterProps {
  data: ExtendedCurrencyRate;
  onAmountChange: (amount: number) => void;
  onFromCurrencyChange: (currency: string) => void;
  onToCurrencyChange: (currency: string) => void;
  currencies: Currency[];
}

// Currency Selector Component (inline since there was trouble with the separate file)
const CurrencySelector: React.FC<{
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  label: string;
  currencies: Currency[];
}> = ({ selectedCurrency, onCurrencyChange, label, currencies }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <select
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="appearance-none bg-[#2a2a40] text-white px-4 py-2 pr-8 rounded-lg w-full focus:outline-none"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Currency icon component to replace images
const CurrencyIcon: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs font-bold">
      {code.substring(0, 2)}
    </div>
  );
};

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  data,
  onAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  currencies,
}) => {
  // Format the last updated time
  const formattedLastUpdated = data.lastUpdated
    ? data.lastUpdated.toLocaleString()
    : 'Updating...';

  return (
    <div className="bg-[#3a3a50] rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="md:col-span-2">
          <CurrencySelector
            selectedCurrency={data.from}
            onCurrencyChange={onFromCurrencyChange}
            label="From Currency"
            currencies={currencies}
          />
        </div>
        <div className="md:col-span-1 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <div className="md:col-span-2">
          <CurrencySelector
            selectedCurrency={data.to}
            onCurrencyChange={onToCurrencyChange}
            label="To Currency"
            currencies={currencies}
          />
        </div>
      </div>

      {/* Exchange Rate Display */}
      <div className="bg-[#2a2a40] rounded-lg p-3 mb-6 text-center">
        <div className="text-gray-400 text-sm mb-1">Current Exchange Rate</div>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center">
            <CurrencyIcon code={data.from} />
            <span className="ml-1 text-white text-sm">1 {data.from}</span>
          </div>
          <span className="text-gray-400">=</span>
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">{data.rate.toFixed(5)}</span>
            <span className="ml-1 text-white text-sm">{data.to}</span>
            <CurrencyIcon code={data.to} />
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Updated: {formattedLastUpdated}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CurrencyIcon code={data.from} />
              <span className="ml-2 text-white">{data.from}</span>
            </div>
            <input
              type="number"
              value={data.amount}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              className="bg-transparent text-white text-xl focus:outline-none"
            />
          </div>
        </div>

        <div className="mx-4">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CurrencyIcon code={data.to} />
              <span className="ml-2 text-white">{data.to}</span>
            </div>
            <span className="text-white text-xl">
              {formatCurrency(data.convertedAmount, data.to)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};