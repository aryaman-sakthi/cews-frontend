import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the 'from' and 'to' currencies from query parameters
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get('from') || 'USD';
  const to = searchParams.get('to') || 'AUD';

  try {
    // Make the request from the server side to avoid CORS issues
    const response = await fetch(`https://cews-backend.onrender.com/api/v1/currency/rates/${from}/${to}/`);
    
    if (!response.ok) {
      // If the API request fails, return an error
      return NextResponse.json(
        { error: `Failed to fetch exchange rate: ${response.status}` },
        { status: response.status }
      );
    }
    
    // Get the data from the API
    const data = await response.json();
    
    // Extract the rate from the response
    if (data && data.events && data.events.length > 0) {
      const event = data.events[0];
      if (event.attributes && typeof event.attributes.rate === 'number') {
        // Return the rate in a simplified format
        return NextResponse.json({ rate: event.attributes.rate });
      }
    }
    
    // Return error if rate not found in API response
    return NextResponse.json(
      { error: 'Could not extract rate from API response' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error in exchange rate API route:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch exchange rate' },
      { status: 500 }
    );
  }
} 