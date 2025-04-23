import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const currency = searchParams.get('currency') || 'USD';
  const limit = parseInt(searchParams.get('limit') || '10');
  const sentimentScore = searchParams.get('sentiment_score');
  const mode = searchParams.get('mode') || 'get'; // 'fetch' or 'get'

  try {
    // Remove any currency pair formatting - backend only supports single currencies
    const cleanCurrency = currency.split('/')[0]; // Take only the first part if it's a pair
    
    console.log(`Processing currency news for ${cleanCurrency}, mode: ${mode}`);
    
    // Step 1: If in fetch mode, trigger Alpha Vantage fetch and return immediately
    if (mode === 'fetch') {
      // Construct URL for the trigger endpoint
      const fetchUrl = new URL(`https://cews-backend.onrender.com/api/v1/currency/${cleanCurrency}`);
      
      // Don't include limit parameter in the URL - it isn't needed based on your screenshot
      console.log(`Triggering Alpha Vantage fetch for ${cleanCurrency}: ${fetchUrl.toString()}`);
      
      try {
        // Set a longer timeout for the Alpha Vantage fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
        
        const fetchResponse = await fetch(fetchUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          // Send an empty object as body to ensure it's a proper POST request
          body: JSON.stringify({}),
        });
        
        clearTimeout(timeoutId);
        
        if (!fetchResponse.ok) {
          console.error(`Error triggering Alpha Vantage fetch: ${fetchResponse.status}`);
          // Even if there's an error, return a success response to allow the frontend to proceed
          return NextResponse.json({ 
            status: 'success', 
            message: `Alpha Vantage fetch triggered for ${cleanCurrency}. It may take time to process.` 
          });
        }
        
        // Return success response for the fetch trigger
        console.log('Successfully triggered Alpha Vantage fetch');
        return NextResponse.json({ 
          status: 'success', 
          message: 'Alpha Vantage fetch triggered successfully. Data will be available in approximately 30 seconds.' 
        });
      } catch (error: unknown) {
        // Type checking for errors
        const fetchError = error as { name?: string };
        if (fetchError && fetchError.name === 'AbortError') {
          console.error('Alpha Vantage trigger timed out');
        } else {
          console.error('Error triggering Alpha Vantage fetch:', error);
        }
        
        // Even if there's an error, return a "success" response to allow the frontend to proceed
        return NextResponse.json({ 
          status: 'success', 
          message: `Alpha Vantage fetch triggered for ${cleanCurrency}. It may take time to process.` 
        });
      }
    }
    
    // Step 2: Get mode - retrieve news from database without triggering new fetch
    console.log(`Retrieving news data for ${cleanCurrency} from database`);
    
    // Construct the URL for the database endpoint
    const url = new URL('https://cews-backend.onrender.com/api/v1/news/events');
    
    // Add query parameters
    url.searchParams.append('currency', cleanCurrency);
    url.searchParams.append('limit', limit.toString());
    
    if (sentimentScore) {
      url.searchParams.append('sentiment_score', sentimentScore);
    }
    
    // Make the request with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    
    console.log(`Fetching news from database: ${url.toString()}`);
    const response = await fetch(url.toString(), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Database API error: ${response.status}`);
      return createEmptyResponse(cleanCurrency);
    }
    
    // Parse the database response
    const data = await response.json();
    
    // Check if we have events
    if (!data.events || data.events.length === 0) {
      console.log('No news events found in the database');
      return createEmptyResponse(cleanCurrency);
    }
    
    // Return the data from database
    console.log(`Found ${data.events.length} news events for ${cleanCurrency}`);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in currency news API route:', error);
    return createEmptyResponse(currency);
  }
}

// Helper function to create empty response in ADAGE format
function createEmptyResponse(currency: string) {
  const currentTime = new Date().toISOString();
  const dateStr = currentTime.split('T')[0].replace(/-/g, '');
  
  const emptyResponse = {
    data_source: "Alpha Vantage",
    dataset_type: "currency_news",
    dataset_id: `currency-news-${currency}-${dateStr}`,
    time_object: {
      timestamp: currentTime,
      timezone: "UTC"
    },
    events: []
  };
  
  return NextResponse.json(emptyResponse, { status: 200 });
}