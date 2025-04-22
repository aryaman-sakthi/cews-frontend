import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const base = searchParams.get('base') || 'USD';
  const target = searchParams.get('target') || 'AUD';
  const days = searchParams.get('days') || '30';

  try {
    // Make the request from the server side to avoid CORS issues
    const apiUrl = `https://cews-backend.onrender.com/api/v1/analytics/volatility/${base}/${target}?days=${days}`;
    
    console.log(`Fetching volatility data from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store' // Don't cache volatility data
    });
    
    if (!response.ok) {
      // If the API request fails, return an error
      return NextResponse.json(
        { error: `Failed to fetch volatility analysis: ${response.status}` },
        { status: response.status }
      );
    }
    
    // Get the data from the API
    const data = await response.json();
    
    // Return the data directly
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in volatility API route:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch volatility analysis' },
      { status: 500 }
    );
  }
} 