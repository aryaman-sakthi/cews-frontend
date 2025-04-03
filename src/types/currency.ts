// src/types/currency.ts
export interface CurrencyRate {
    from: string;
    to: string;
    rate: number;
    amount: number;
    convertedAmount: number;
  }
  
  export interface NewsItem {
    id: string;
    title: string;
    imageUrl: string;
  }
  
  export interface PredictionData {
    day: number;
    rate: number;
    change: number;
    confidence: number;
  }