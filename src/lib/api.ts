// src/lib/api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

// src/lib/api.ts
export async function fetchCurrentRate(baseRate: string = 'USD', targetRate: string = 'AUD') {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/currency/rates/${baseRate}/${targetRate}`);

    if (!response.ok) {
      throw new Error('Failed to fetch rate');
    }

    const data = await response.json();
    const latestEvent = data.events[0];
    
    return {
      rate: latestEvent.attributes.rate,
      convertedAmount: 1000 * latestEvent.attributes.rate,
      from: latestEvent.attributes.base,
      to: latestEvent.attributes.target
    };
  } catch (error) {
    console.error('Error fetching rate:', error);
    throw error;
  }
}

export const fetchMarketNews = async () => {
  // Implement your news API call here
  return [];
};