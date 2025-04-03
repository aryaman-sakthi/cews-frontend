// src/lib/api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const fetchExchangeRate = async (from: string, to: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${from}`);
    return response.data.rates[to];
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};

export const fetchMarketNews = async () => {
  // Implement your news API call here
  return [];
};