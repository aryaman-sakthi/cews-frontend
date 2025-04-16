import { NextRequest, NextResponse } from 'next/server';

// Mock data generator for development
const generateMockNews = (currency: string, limit: number) => {
  const mockNewsItems = [
    {
      title: `${currency} gains momentum as economic outlook improves`,
      source: 'Financial Times',
      url: 'https://www.ft.com',
      summary: `The ${currency} showed strong performance against major currencies amid positive economic data.`,
      sentiment_score: 0.75,
      sentiment_label: 'bullish',
      currency: currency
    },
    {
      title: `${currency} faces pressure following central bank announcement`,
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com',
      summary: `The ${currency} declined after the central bank signaled potential policy changes in the upcoming quarter.`,
      sentiment_score: -0.45,
      sentiment_label: 'somewhat_bearish',
      currency: currency
    },
    {
      title: `Analysts predict ${currency} volatility in coming weeks`,
      source: 'Reuters',
      url: 'https://www.reuters.com',
      summary: `Market analysts expect increased ${currency} volatility due to geopolitical tensions and trade uncertainties.`,
      sentiment_score: 0.15,
      sentiment_label: 'neutral',
      currency: currency
    },
    {
      title: `${currency} trading volume reaches new highs`,
      source: 'CNBC',
      url: 'https://www.cnbc.com',
      summary: `Trading volume for ${currency} reached record levels as institutional investors increase their positions.`,
      sentiment_score: 0.62,
      sentiment_label: 'somewhat_bullish',
      currency: currency
    },
    {
      title: `${currency} outlook remains uncertain amid global economic slowdown`,
      source: 'Wall Street Journal',
      url: 'https://www.wsj.com',
      summary: `Experts remain divided on the future of ${currency} as global economic indicators show mixed signals.`,
      sentiment_score: -0.12,
      sentiment_label: 'neutral',
      currency: currency
    }
  ];

  // Randomize and return limited number of items
  const randomized = [...mockNewsItems].sort(() => 0.5 - Math.random());
  return randomized.slice(0, Math.min(limit, mockNewsItems.length));
};

export async function GET(request: NextRequest) {
  // Get query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const currency = searchParams.get('currency') || 'USD';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    // For production: uncomment this section and comment out the mock data section below
    /*
    // Construct the URL with query parameters
    let url = `https://foresight-backend.devkitty.pro/api/v1/currency/news/?currency=${currency}&limit=${limit}`;
    
    // Make the request from the server side to avoid CORS issues
    const response = await fetch(url);
    
    if (!response.ok) {
      // If the API request fails, return an error
      return NextResponse.json(
        { error: `Failed to fetch currency news: ${response.status}` },
        { status: response.status }
      );
    }
    
    // Get the data from the API
    const data = await response.json();
    
    // Return the full response
    return NextResponse.json(data);
    */

    // Generate mock data for development
    const currentTime = new Date().toISOString();
    const currencyParts = currency.includes('/') ? currency.split('/') : [currency];
    
    // Generate news for each currency if it's a pair
    let allMockNews: any[] = [];
    currencyParts.forEach(curr => {
      const mockNews = generateMockNews(curr, Math.ceil(limit / currencyParts.length));
      allMockNews = [...allMockNews, ...mockNews];
    });
    
    // Limit to requested number of items
    allMockNews = allMockNews.slice(0, limit);
    
    // Create events in the ADAGE format
    const events = allMockNews.map((item, index) => {
      // Create a random date within the last 7 days
      const daysAgo = Math.floor(Math.random() * 7);
      const publishDate = new Date();
      publishDate.setDate(publishDate.getDate() - daysAgo);
      
      return {
        time_object: {
          timestamp: publishDate.toISOString(),
          duration: 0,
          duration_unit: "second",
          timezone: "UTC"
        },
        event_type: "currency_news",
        event_id: `mock-news-${index}-${Date.now()}`,
        attributes: {
          title: item.title,
          source: item.source,
          url: item.url,
          summary: item.summary,
          sentiment_score: item.sentiment_score,
          sentiment_label: item.sentiment_label,
          currency: item.currency
        }
      };
    });

    // Create full response in ADAGE format
    const mockResponse = {
      data_source: "Mock Data",
      dataset_type: "currency_news",
      dataset_id: `currency-news-${currency}-${Date.now()}`,
      time_object: {
        timestamp: currentTime,
        timezone: "UTC"
      },
      events: events
    };
    
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error in currency news API route:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch currency news', events: [] },
      { status: 500 }
    );
  }
}