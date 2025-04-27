/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
        // Step 1: Trigger fetch requests for both individual currencies
        const triggers = [];
        
        console.log(`Triggering fetch for ${fromCurrency}...`);
        triggers.push(fetch(`/api/currency-news?currency=${fromCurrency}&limit=3&mode=fetch`)
          .then(response => {
            if (!response.ok) console.error(`Failed to trigger fetch for ${fromCurrency}`);
            return response.json();
          })
          .catch(err => console.error(`Error triggering fetch for ${fromCurrency}:`, err))
        );
        
        console.log(`Triggering fetch for ${toCurrency}...`);
        triggers.push(fetch(`/api/currency-news?currency=${toCurrency}&limit=3&mode=fetch`)
          .then(response => {
            if (!response.ok) console.error(`Failed to trigger fetch for ${toCurrency}`);
            return response.json();
          })
          .catch(err => console.error(`Error triggering fetch for ${toCurrency}:`, err))
        );
        
        // Execute all trigger requests in parallel
        const triggerResults = await Promise.all(triggers);
        console.log('Trigger results:', triggerResults);
        
        // Step 2: Wait for AlphaVantage to process the data
        console.log(`Waiting 35 seconds for ${fromCurrency} and ${toCurrency} data to be processed...`);
        await new Promise(resolve => setTimeout(resolve, 35000)); // 35 seconds wait
        
        // Step 3: Fetch data for both currencies and combine
        // Fetch for fromCurrency
        const fromResponse = await fetch(`/api/currency-news?currency=${fromCurrency}&limit=3&mode=get`);
        const fromData = await fromResponse.json();
        
        // Fetch for toCurrency
        const toResponse = await fetch(`/api/currency-news?currency=${toCurrency}&limit=3&mode=get`);
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
        
        // Process the news data
        if (limitedEvents.length > 0) {
          const articles = limitedEvents.map((event: any) => ({
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
    <div className="bg-[#2a2a40] rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-4">Market News</h2>
      
      {isLoading ? (
        <div className="flex-1 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 p-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <div className="w-full h-full bg-[#3a3a50] rounded-lg animate-pulse" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-[#3a3a50] rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#3a3a50] rounded w-1/4 animate-pulse" />
                <div className="h-3 bg-[#3a3a50] rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
          <div className="text-center text-gray-400 text-sm mt-4">
            Fetching latest market news...
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400 text-sm p-4">{error}</div>
        </div>
      ) : news.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-sm text-center">
            No news available for {fromCurrency} or {toCurrency}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto">
          {news.map((item, index) => (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              key={index} 
              className="flex items-start space-x-3 p-4 hover:bg-[#3a3a50] rounded-lg transition-colors"
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={getSourceImage(item.source)}
                  alt={item.source}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium line-clamp-2">{item.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{item.source}</p>
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