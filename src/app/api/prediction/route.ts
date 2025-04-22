import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get('from') || 'USD';
  const to = searchParams.get('to') || 'AUD';
  
  // Get optional parameters
  const refresh = searchParams.get('refresh') === 'true';
  const forecastHorizon = searchParams.get('forecast_horizon');
  const model = searchParams.get('model');
  const confidence = searchParams.get('confidence');

  // Build query parameters for the backend
  const apiParams = new URLSearchParams();
  if (refresh) {
    apiParams.append('refresh', 'true');
  }
  if (forecastHorizon) {
    apiParams.append('forecast_horizon', forecastHorizon);
  }
  if (model) {
    apiParams.append('model', model);
  }
  if (confidence) {
    apiParams.append('confidence', confidence);
  }
  
  // Add timestamp to prevent caching
  apiParams.append('_t', Date.now().toString());

  try {
    // Build the URL with query parameters
    const queryString = apiParams.toString();
    const apiUrl = `https://cews-backend.onrender.com/api/v2/analytics/prediction/${from}/${to}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Fetching prediction data from: ${apiUrl}`);
    
    // Make the request from the server side to avoid CORS issues
    // Always disable caching for prediction calls to ensure fresh data
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      // If the API request fails, return an error
      return NextResponse.json(
        { error: `Failed to fetch prediction: ${response.status}` },
        { status: response.status }
      );
    }
    
    // Get the data from the API and pass it through directly
    const data = await response.json();
    
    // Log the full response structure
    console.log('Full prediction response structure:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    
    // Log the confidence score from the backend
    if (data && data.events && data.events[0] && data.events[0].attributes) {
      const rawConfidenceScore = data.events[0].attributes.confidence_score;
      const confidenceScoreNum = Number(rawConfidenceScore);
      
      console.log(`API Route: Raw confidence score: ${rawConfidenceScore}, type: ${typeof rawConfidenceScore}`);
      console.log(`API Route: Full attributes:`, JSON.stringify(data.events[0].attributes));
      console.log(`API Route: Converted confidence score: ${confidenceScoreNum}, type: ${typeof confidenceScoreNum}`);
      console.log(`API Route: Received confidence score ${confidenceScoreNum} for ${from}/${to}`);
    }
    
    // TEMPORARY: Debug the response structure before sending it back
    const responseBody = JSON.stringify(data);
    console.log('Final response size:', responseBody.length);
    
    // Ensure the confidence_score is a number in the response
    try {
      if (data.events && data.events[0] && data.events[0].attributes) {
        // Get the original value, no matter what format it is
        const originalValue = data.events[0].attributes.confidence_score;
        
        // Try multiple approaches to convert to number
        let numericValue = Number(originalValue);
        
        // If Number() gives NaN, try parseInt as a fallback
        if (isNaN(numericValue) && typeof originalValue === 'string') {
          // Try to extract numeric part if it's a string containing numbers
          const match = originalValue.match(/\d+(\.\d+)?/);
          if (match) {
            numericValue = parseFloat(match[0]);
          } else {
            numericValue = parseInt(originalValue, 10);
          }
        }
        
        // If still NaN, default to something reasonable
        if (isNaN(numericValue)) {
          console.warn(`Could not parse confidence_score "${originalValue}", defaulting to 70`);
          numericValue = 70;
        }
        
        // Force the confidence score to be a number in the response
        data.events[0].attributes.confidence_score = numericValue;
        console.log(`Modified confidence score to number: ${data.events[0].attributes.confidence_score} (was: ${originalValue})`);
      }
    } catch (err) {
      console.error('Error modifying confidence score:', err);
    }
    
    // Return the data with cache control headers
    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error in prediction API route:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch prediction data' },
      { status: 500 }
    );
  }
} 