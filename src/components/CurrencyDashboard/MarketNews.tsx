'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { NewsItem } from '@/types/currency';

interface MarketNewsProps {
  fromCurrency: string;
  toCurrency: string;
}

interface NewsArticle {
  title: string;
  source: string;
  url: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: string;
  currency: string;
}

export const MarketNews: React.FC<MarketNewsProps> = ({ fromCurrency, toCurrency }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First try to fetch news for the currency pair (e.g., USD/EUR)
        const pairResponse = await fetch(`/api/currency-news?currency=${fromCurrency}/${toCurrency}&limit=5`);
        let data = await pairResponse.json();
        
        // If no events or empty response, try each currency individually
        if (!data.events || data.events.length === 0) {
          // Fetch for fromCurrency
          const fromResponse = await fetch(`/api/currency-news?currency=${fromCurrency}&limit=3`);
          const fromData = await fromResponse.json();
          
          // Fetch for toCurrency
          const toResponse = await fetch(`/api/currency-news?currency=${toCurrency}&limit=3`);
          const toData = await toResponse.json();
          
          // Combine results from both currencies
          const combinedEvents = [
            ...(fromData.events || []),
            ...(toData.events || [])
          ];
          
          // Sort by timestamp, newest first
          combinedEvents.sort((a: any, b: any) => {
            return new Date(b.time_object.timestamp).getTime() - 
                   new Date(a.time_object.timestamp).getTime();
          });
          
          // Limit to 5 items
          const limitedEvents = combinedEvents.slice(0, 5);
          
          if (limitedEvents.length > 0) {
            data = { ...fromData, events: limitedEvents };
          }
        }

        // Process the news data
        if (data.events && data.events.length > 0) {
          const articles = data.events.map((event: any) => ({
            title: event.attributes.title,
            source: event.attributes.source,
            url: event.attributes.url,
            summary: event.attributes.summary,
            sentiment_score: event.attributes.sentiment_score,
            sentiment_label: event.attributes.sentiment_label,
            currency: event.attributes.currency
          }));
          
          setNews(articles);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error('Error fetching currency news:', error);
        setError('Failed to fetch currency news');
      } finally {
        setIsLoading(false);
      }
    };

    if (fromCurrency && toCurrency) {
      fetchNews();
    }
  }, [fromCurrency, toCurrency]);

  // Function to get sentiment color
  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
      case 'somewhat_bullish':
        return 'text-green-400';
      case 'bearish':
      case 'somewhat_bearish':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Function to get a placeholder image based on the source
  const getSourceImage = (source: string): string => {
    // Map common news sources to images
    const sourceMap: Record<string, string> = {
      'reuters': '/news/reuters.jpg',
      'bloomberg': '/news/bloomberg.jpg',
      'wsj': '/news/wsj.jpg',
      'cnbc': '/news/cnbc.jpg',
      'ft': '/news/ft.jpg',
      'bbc': '/news/bbc.jpg',
      'cnn': '/news/cnn.jpg',
    };
    
    // Look for matching source in the sourceMap
    for (const [key, value] of Object.entries(sourceMap)) {
      if (source.toLowerCase().includes(key)) {
        return value;
      }
    }
    
    // Default image if no match
    return '/news/default.jpg';
  };

  return (
    <div className="bg-[#2a2a40] rounded-2xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Market News</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm p-4">{error}</div>
      ) : news.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-4">
          No news available for {fromCurrency}/{toCurrency}
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {news.map((item, index) => (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              key={index} 
              className="flex items-start space-x-3 p-2 hover:bg-[#3a3a50] rounded-lg transition-colors"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={getSourceImage(item.source)}
                  alt={item.source}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
                <p className="text-gray-400 text-xs mt-1 truncate">{item.source}</p>
                <div className={`text-xs mt-1 ${getSentimentColor(item.sentiment_label)}`}>
                  {item.sentiment_label.replace(/_/g, ' ')} 
                  ({item.sentiment_score.toFixed(2)})
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};