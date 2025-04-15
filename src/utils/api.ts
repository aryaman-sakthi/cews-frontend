// src/utils/api.ts

interface ApiCurrencyResponse {
  data_source: string;
  dataset_type: string;
  dataset_id: string;
  time_object: {
    timestamp: string;
    timezone: string;
  };
  events: {
    time_object: {
      timestamp: string;
      timezone: string;
      duration: number;
      duration_unit: string;
    };
    event_type: string;
    event_id: string;
    attributes: {
      base: string;
      target: string;
      rate: number;
      bid_price: string;
      ask_price: string;
      source: string;
    };
  }[];
}

/**
 * Fetches the current exchange rate between two currencies
 */
export const fetchExchangeRate = async (from: string, to: string): Promise<number> => {
  try {
    console.log(`Fetching exchange rate from ${from} to ${to}`);
    // Make the API call with the provided currencies
    const response = await fetch(`https://foresight-backend.devkitty.pro/api/v1/currency/rates/${from}/${to}/`);
    
    if (!response.ok) {
      throw new Error(`Error fetching exchange rate: ${response.status}`);
    }
    
    const data: ApiCurrencyResponse = await response.json();
    console.log('API response:', data);
    
    // Extract the rate from the response
    if (data && data.events && data.events.length > 0) {
      const event = data.events[0];
      if (event.attributes && typeof event.attributes.rate === 'number') {
        const rate = event.attributes.rate;
        console.log(`Exchange rate found in API response: ${rate}`);
        return rate;
      }
    }
    
    console.warn('Could not find rate in API response, using fallback rate');
    
    // If we couldn't extract the rate, use fallbacks
    if (from === 'USD' && to === 'AUD') {
      return 1.58692;
    } else if (from === 'INR' && to === 'AUD') {
      return 0.0183;
    }
    
    throw new Error('No exchange rate found in the response');
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    
    // Return fallback rates for common pairs
    if (from === 'USD' && to === 'AUD') {
      return 1.58692;
    } else if (from === 'INR' && to === 'AUD') {
      return 0.0183;
    }
    
    // Return a default value if no fallback is available
    return 1.0;
  }
}; 