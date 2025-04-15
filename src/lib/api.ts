// src/lib/api.ts
import axios from 'axios';
import { get } from 'http';

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

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
    
    // Method 1: Use the proxy API route to avoid CORS issues
    const response = await fetch(`/api/exchange-rate?from=${from}&to=${to}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching exchange rate: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.rate !== undefined) {
      console.log(`Exchange rate found: ${data.rate}`);
      return data.rate;
    }
    
    throw new Error(data.error || 'No exchange rate found in response');
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    throw error; // Propagate the error to the component
  }
}; 