// src/components/CurrencyDashboard/MarketNews.tsx
import React from 'react';
import Image from 'next/image';
import { NewsItem } from '@/types/currency';

interface MarketNewsProps {
  news: NewsItem[];
}

export const MarketNews: React.FC<MarketNewsProps> = ({ news }) => {
  return (
    <div className="bg-[#2a2a40] rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Market News</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <Image
                src={item.imageUrl}
                alt=""
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="text-white text-sm">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};