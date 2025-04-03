// src/components/CurrencyDashboard/CurrencyConverter.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { CurrencyRate } from '@/types/currency';
import { formatCurrency } from '@/utils/formatters';

interface CurrencyConverterProps {
  data: CurrencyRate;
  onAmountChange: (amount: number) => void;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  data,
  onAmountChange,
}) => {
  return (
    <div className="bg-[#3a3a50] rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Image
                src={`/flags/${data.from.toLowerCase()}.png`}
                alt={data.from}
                width={24}
                height={24}
                className="rounded-full"
              />
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
              <Image
                src={`/flags/${data.to.toLowerCase()}.png`}
                alt={data.to}
                width={24}
                height={24}
                className="rounded-full"
              />
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