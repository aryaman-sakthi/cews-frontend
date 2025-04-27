import { NextResponse } from 'next/server';

// Define the backend API URL using the specific endpoint
const BACKEND_API_URL = 'http://cews-backend.onrender.com';
const ALERT_ENDPOINT = `${BACKEND_API_URL}/api/v2/alerts/register/`;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure the data matches the expected format
    const alertData = {
      base: data.base,
      target: data.target,
      alert_type: data.alert_type,
      email: data.email,
      threshold: parseFloat(data.threshold)
    };
    
    console.log('Sending alert data to backend:', alertData);
    console.log('Using endpoint:', ALERT_ENDPOINT);
    
    // Forward the request to our Django backend
    const response = await fetch(ALERT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    });
    
    // For debugging
    console.log('Backend response status:', response.status);
    
    const responseData = await response.json();
    console.log('Backend response data:', responseData);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: responseData || 'Failed to register alert' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error processing alert registration:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 