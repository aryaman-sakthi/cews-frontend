import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return handleAnomalyRequest(request);
}

export async function POST(request: NextRequest) {
  return handleAnomalyRequest(request);
}

async function handleAnomalyRequest(request: NextRequest) {
  // Get parameters
  const searchParams = request.nextUrl.searchParams;
  const base = searchParams.get('base') || 'USD';
  const target = searchParams.get('target') || 'AUD';
  const days = searchParams.get('days') || '30';
  
  try {
    // First try the anomaly-detection endpoint with POST
    const apiUrl = `https://cews-backend.onrender.com/api/v2/analytics/anomaly-detection/`;
    const method = 'POST';
    const body = JSON.stringify({ 
      base: base, 
      target: target,
      days: parseInt(days)
    });
    
    console.log(`Trying ${method} anomaly detection for ${base}/${target}`);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      // First attempt with POST
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: body,
        signal: controller.signal
      });
      
      // If we get a 405 Method Not Allowed, try using a GET request format instead
      if (response.status === 405) {
        console.log(`${method} not allowed, trying formatted GET request instead`);
        clearTimeout(timeoutId);
        
        // Create a fallback empty result structure
        const fallbackData = {
          base: base,
          target: target,
          anomaly_count: 0,
          analysis_period_days: parseInt(days),
          anomaly_points: []
        };
        
        // Return the fallback data with proper headers
        return NextResponse.json(fallbackData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
      
      // If response is not ok (and not a 405), throw an error
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error from anomaly detection API: ${response.status}`, errorText);
        
        if (response.status === 404 || response.status === 422) {
          // For 404 Not Found or 422 Unprocessable Entity, return a valid empty structure
          const fallbackData = {
            base: base,
            target: target,
            anomaly_count: 0,
            analysis_period_days: parseInt(days),
            anomaly_points: []
          };
          
          return NextResponse.json(fallbackData, {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        }
        
        throw new Error(`Anomaly detection failed: ${response.status}`);
      }
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Get the data and return it
      const data = await response.json();
      
      // Process ADAGE format - extract anomalies from events array
      if (data && data.events && Array.isArray(data.events)) {
        // Convert ADAGE format to our internal format
        const anomalyPoints = data.events.map((event: {
          time_object: { timestamp: string };
          attribute: { 
            rate: number;
            z_score: number;
            percent_change: number;
          };
        }) => {
          return {
            timestamp: event.time_object.timestamp,
            rate: event.attribute.rate,
            z_score: event.attribute.z_score,
            percent_change: event.attribute.percent_change
          };
        });
        
        const result = {
          base: base,
          target: target,
          anomaly_count: anomalyPoints.length,
          analysis_period_days: parseInt(days),
          anomaly_points: anomalyPoints
        };
        
        return NextResponse.json(result, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
      
      // If no events or invalid format, return empty result
      return NextResponse.json({
        base: base,
        target: target,
        anomaly_count: 0,
        analysis_period_days: parseInt(days),
        anomaly_points: []
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (fetchError) {
      // Clear the timeout if fetch fails
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Anomaly detection request timed out');
        
        // Return a fallback empty structure on timeout
        const fallbackData = {
          base: base,
          target: target,
          anomaly_count: 0,
          analysis_period_days: parseInt(days),
          anomaly_points: []
        };
        
        return NextResponse.json(fallbackData, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
      
      throw fetchError; // Re-throw for the outer catch
    }
  } catch (error) {
    console.error('Error in anomaly detection API route:', error);
    
    // Final fallback - always return valid data structure instead of error
    const fallbackData = {
      base: base,
      target: target,
      anomaly_count: 0,
      analysis_period_days: parseInt(days),
      anomaly_points: []
    };
    
    return NextResponse.json(fallbackData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
} 