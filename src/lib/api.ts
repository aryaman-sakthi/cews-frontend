// src/lib/api.ts
import axios from 'axios';

// Configure API URL - can be overridden with environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Flag to enable mock data when backend is not available
const USE_MOCK_DATA = true; // Set to false when backend is ready

export const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/exchange/${fromCurrency}/${toCurrency}`);
    return response.data.rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Return mock data if backend is unavailable
    if (USE_MOCK_DATA) {
      console.log('Using mock exchange rate data');
      // Generate a realistic exchange rate based on currency pair
      const mockRates: Record<string, number> = {
        'USDEUR': 0.91,
        'USDGBP': 0.77,
        'USDAUD': 1.52,
        'USDJPY': 154.65,
        'USDCAD': 1.36,
        'USDCHF': 0.90,
        'USDCNY': 7.24,
        'EURAUD': 1.66,
        'EURGBP': 0.85
      };
      
      const pair = `${fromCurrency}${toCurrency}`;
      const inversePair = `${toCurrency}${fromCurrency}`;
      
      if (mockRates[pair]) {
        return mockRates[pair];
      } else if (mockRates[inversePair]) {
        return 1 / mockRates[inversePair];
      } else {
        // Generate a random but realistic rate if pair not found
        return Math.random() * 2 + 0.5;
      }
    }
    
    throw error;
  }
};

export interface PredictionValue {
  timestamp: string;
  mean: number;
  lower_bound: number;
  upper_bound: number;
}

export interface InfluencingFactor {
  factor_name: string;
  impact_level: string;
  used_in_prediction: boolean;
}

export interface CurrencyPrediction {
  baseCurrency: string;
  targetCurrency: string;
  currentRate: number;
  changePercent: number;
  confidenceScore: number;
  modelVersion: string;
  inputDataRange: string;
  influencingFactors: InfluencingFactor[];
  predictionValues: PredictionValue[];
  meanSquareError?: number;
  rootMeanSquareError?: number;
  meanAbsoluteError?: number;
}
interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// New interface for Volatility Analysis
export interface VolatilityAnalysis {
  baseCurrency: string;
  targetCurrency: string;
  currentVolatility: number;
  averageVolatility: number;
  volatilityLevel: 'NORMAL' | 'HIGH' | 'EXTREME';
  analysisPeriodDays: number;
  trend: 'STABLE' | 'INCREASING' | 'DECREASING';
  confidenceScore?: number;
}

// New interface for Correlation Analysis
export interface CorrelationFactor {
  factor: string;
  correlation: number;
  actual_correlation?: number;
  type: string;
}

export interface CorrelationAnalysis {
  baseCurrency: string;
  targetCurrency: string;
  confidenceScore: number;
  dataCompleteness: number;
  analysisPeriodDays: number;
  influencingFactors: CorrelationFactor[];
  correlations: {
    news_sentiment: Record<string, number>;
    economic_indicators: Record<string, number>;
    volatility_news: Record<string, number>;
  };
}

// Generate mock prediction data
const generateMockPrediction = (fromCurrency: string, toCurrency: string): CurrencyPrediction => {
  // Generate a base rate
  const baseRate = Math.random() * 2 + 0.5;
  
  // Generate dates for next 7 days
  const dates: string[] = [];
  const values: number[] = [];
  const now = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(now.getDate() + i + 1);
    dates.push(date.toISOString().split('T')[0]);
    
    // Generate a slightly changing rate with some randomness
    const volatility = 0.005; // 0.5% daily volatility
    const trend = 0.001; // slight upward trend
    const dayChange = (Math.random() - 0.5) * 2 * volatility + trend;
    values.push(baseRate * (1 + dayChange * i));
  }
  
  // Create prediction values
  const predictionValues: PredictionValue[] = dates.map((date, i) => {
    const mean = values[i];
    return {
      timestamp: date,
      mean,
      lower_bound: mean * 0.97, // 3% below mean
      upper_bound: mean * 1.03, // 3% above mean
    };
  });
  
  // Create influencing factors
  const factors: InfluencingFactor[] = [
    {
      factor_name: "Economic Indicators",
      impact_level: "high",
      used_in_prediction: true
    },
    {
      factor_name: "Market Sentiment",
      impact_level: "medium",
      used_in_prediction: true
    },
    {
      factor_name: "Historical Volatility",
      impact_level: "medium",
      used_in_prediction: true
    }
  ];
  
  return {
    baseCurrency: fromCurrency,
    targetCurrency: toCurrency,
    currentRate: baseRate,
    changePercent: 1.2,
    confidenceScore: Math.round(Math.random() * 15 + 70), // 70-85%
    modelVersion: "Statistical Model v2",
    inputDataRange: "2023-01-01 to 2024-03-31",
    influencingFactors: factors,
    predictionValues,
    meanSquareError: 0.00025,
    rootMeanSquareError: 0.0158,
    meanAbsoluteError: 0.0122
  };
};

// Generate mock volatility data
const generateMockVolatilityAnalysis = (baseCurrency: string, targetCurrency: string): VolatilityAnalysis => {
  // Generate random but realistic volatility values
  const currentVolatility = Math.random() * 15 + 5; // Between 5-20%
  const averageVolatility = currentVolatility * (0.8 + Math.random() * 0.4); // Slightly different

  // Determine volatility level based on current value
  let volatilityLevel: 'NORMAL' | 'HIGH' | 'EXTREME';
  if (currentVolatility < 10) {
    volatilityLevel = 'NORMAL';
  } else if (currentVolatility < 15) {
    volatilityLevel = 'HIGH';
  } else {
    volatilityLevel = 'EXTREME';
  }

  // Random trend
  const trends: Array<'STABLE' | 'INCREASING' | 'DECREASING'> = ['STABLE', 'INCREASING', 'DECREASING'];
  const trend = trends[Math.floor(Math.random() * trends.length)];

  return {
    baseCurrency,
    targetCurrency,
    currentVolatility,
    averageVolatility,
    volatilityLevel,
    analysisPeriodDays: 30,
    trend,
    confidenceScore: Math.round(Math.random() * 20 + 75) // 75-95%
  };
};

export const fetchCurrencyPrediction = async (
  fromCurrency: string, 
  toCurrency: string, 
  options?: { 
    refresh?: boolean, 
    forecastHorizon?: number, 
    model?: 'arima' | 'statistical' | 'auto', 
    confidence?: number
  }
): Promise<CurrencyPrediction> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (options?.refresh) {
      queryParams.append('refresh', 'true');
    }
    
    if (options?.forecastHorizon) {
      queryParams.append('forecast_horizon', options.forecastHorizon.toString());
    }
    
    if (options?.model) {
      queryParams.append('model', options.model);
    }
    
    if (options?.confidence) {
      queryParams.append('confidence', options.confidence.toString());
    }
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/prediction/${fromCurrency}/${toCurrency}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    
    // Extract the first event from the ADAGE response
    const event = response.data.events[0];
    const attributes = event.attributes;
    
    // Transform to our frontend model
    return {
      baseCurrency: attributes.base_currency,
      targetCurrency: attributes.target_currency,
      currentRate: attributes.current_rate,
      changePercent: attributes.change_percent,
      confidenceScore: attributes.confidence_score,
      modelVersion: attributes.model_version,
      inputDataRange: attributes.input_data_range,
      influencingFactors: attributes.influencing_factors,
      predictionValues: attributes.prediction_values,
      meanSquareError: attributes.mean_square_error,
      rootMeanSquareError: attributes.root_mean_square_error,
      meanAbsoluteError: attributes.mean_absolute_error
    };
  } catch (error) {
    console.error('Error fetching currency prediction:', error);
    
    // Return mock data if backend is unavailable
    if (USE_MOCK_DATA) {
      console.log(`Using mock prediction data for ${fromCurrency}/${toCurrency}`);
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockPrediction(fromCurrency, toCurrency);
    }
    
    throw error;
  }
};

export const fetchVolatilityAnalysis = async (
  baseCurrency: string,
  targetCurrency: string,
  days: number = 30
): Promise<VolatilityAnalysis> => {
  try {
    const url = `${API_BASE_URL}/api/v1/analytics/volatility/${baseCurrency}/${targetCurrency}?days=${days}`;
    const response = await axios.get(url);
    
    // Extract the first event from the ADAGE response
    const event = response.data.events[0];
    const attrs = event.attributes;
    
    // Transform to our frontend model
    return {
      baseCurrency: attrs.base_currency,
      targetCurrency: attrs.target_currency,
      currentVolatility: attrs.current_volatility,
      averageVolatility: attrs.average_volatility,
      volatilityLevel: attrs.volatility_level,
      analysisPeriodDays: attrs.analysis_period_days,
      trend: attrs.trend,
      confidenceScore: attrs.confidence_score
    };
  } catch (error) {
    console.error('Error fetching volatility analysis:', error);
    
    // Return mock data if backend is unavailable
    if (USE_MOCK_DATA) {
      console.log(`Using mock volatility data for ${baseCurrency}/${targetCurrency}`);
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      return generateMockVolatilityAnalysis(baseCurrency, targetCurrency);
    }
    
    throw error;
  }
};

// Generate mock correlation data
const generateMockCorrelationAnalysis = (baseCurrency: string, targetCurrency: string): CorrelationAnalysis => {
  // Generate random but realistic correlation values
  const generateCorrelation = () => Math.round((Math.random() * 1.6 - 0.8) * 100) / 100;
  
  // Create mock factors
  const factors: CorrelationFactor[] = [
    { factor: 'GDP Growth', correlation: generateCorrelation(), type: 'economic' },
    { factor: 'Inflation Rate', correlation: generateCorrelation(), type: 'economic' },
    { factor: 'Interest Rate', correlation: generateCorrelation(), type: 'economic' },
    { factor: 'Trade Balance', correlation: generateCorrelation(), type: 'economic' },
    { factor: 'Market Sentiment', correlation: generateCorrelation(), type: 'news' }
  ];
  
  // Sort factors by absolute correlation value
  factors.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  
  // Create mock news sentiment correlations
  const newsSentiment: Record<string, number> = {
    'positive_news': generateCorrelation(),
    'negative_news': generateCorrelation(),
    'neutral_news': generateCorrelation(),
    'financial_news': generateCorrelation(),
    'political_news': generateCorrelation()
  };
  
  // Create mock economic indicator correlations
  const economicIndicators: Record<string, number> = {
    'gdp_growth': generateCorrelation(),
    'inflation_rate': generateCorrelation(),
    'interest_rate': generateCorrelation(),
    'unemployment': generateCorrelation(),
    'trade_balance': generateCorrelation()
  };
  
  // Create mock volatility news correlations
  const volatilityNews: Record<string, number> = {
    'market_volatility': generateCorrelation(),
    'news_sentiment_volatility': generateCorrelation()
  };

  return {
    baseCurrency,
    targetCurrency,
    confidenceScore: Math.round(Math.random() * 25 + 70), // 70-95%
    dataCompleteness: Math.round(Math.random() * 30 + 70), // 70-100%
    analysisPeriodDays: 90,
    influencingFactors: factors,
    correlations: {
      news_sentiment: newsSentiment,
      economic_indicators: economicIndicators,
      volatility_news: volatilityNews
    }
  };
};

export const fetchCorrelationAnalysis = async (
  baseCurrency: string,
  targetCurrency: string,
  options?: {
    refresh?: boolean,
    lookbackDays?: number
  }
): Promise<CorrelationAnalysis> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (options?.refresh) {
      queryParams.append('refresh', 'true');
    }
    
    if (options?.lookbackDays) {
      queryParams.append('lookback_days', options.lookbackDays.toString());
    }
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/v2/analytics/correlation/${baseCurrency}/${targetCurrency}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    
    // Extract the first event from the ADAGE response
    const event = response.data.events[0];
    const attrs = event.attributes;
    
    // Transform to our frontend model
    return {
      baseCurrency: attrs.base_currency,
      targetCurrency: attrs.target_currency,
      confidenceScore: attrs.confidence_score,
      dataCompleteness: attrs.data_completeness,
      analysisPeriodDays: attrs.analysis_period_days,
      influencingFactors: attrs.influencing_factors,
      correlations: attrs.correlations
    };
  } catch (error) {
    console.error('Error fetching correlation analysis:', error);
    
    // Return mock data if backend is unavailable
    if (USE_MOCK_DATA) {
      console.log(`Using mock correlation data for ${baseCurrency}/${targetCurrency}`);
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 400));
      return generateMockCorrelationAnalysis(baseCurrency, targetCurrency);
    }
    
    throw error;
  }
};

export interface AnomalyPoint {
  timestamp: string;
  rate: number;
  z_score: number;
  percent_change: number;
}

export interface AnomalyDetectionResult {
  base: string;
  target: string;
  anomaly_count: number;
  analysis_period_days: number;
  anomaly_points: AnomalyPoint[];
}

// Generate mock anomaly detection data
const generateMockAnomalyDetection = (baseCurrency: string, targetCurrency: string): AnomalyDetectionResult => {
  // Generate 1-4 random anomalies
  const anomalyCount = Math.floor(Math.random() * 4) + 1;
  const anomalyPoints: AnomalyPoint[] = [];
  
  // Generate dates for the past 30 days
  const now = new Date();
  const possibleDays = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    possibleDays.push(date);
  }
  
  // Shuffle and take a subset of days for anomalies
  const shuffledDays = possibleDays.sort(() => 0.5 - Math.random()).slice(0, anomalyCount);
  
  // Create anomaly points
  for (const day of shuffledDays) {
    anomalyPoints.push({
      timestamp: day.toISOString(),
      rate: Math.random() * 2 + 0.5,
      z_score: (Math.random() * 2 + 2) * (Math.random() < 0.5 ? -1 : 1), // Between 2-4 or -2 to -4
      percent_change: Math.random() * 6 + 2 // 2-8% change
    });
  }
  
  return {
    base: baseCurrency,
    target: targetCurrency,
    anomaly_count: anomalyCount,
    analysis_period_days: 30,
    anomaly_points: anomalyPoints
  };
};

export const fetchAnomalyDetection = async (
  baseCurrency: string,
  targetCurrency: string,
  days: number = 30
): Promise<AnomalyDetectionResult> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('days', days.toString());
    
    const url = `${API_BASE_URL}/v2/analytics/anomaly-detection/${baseCurrency}/${targetCurrency}?${queryParams.toString()}`;
    
    const response = await axios.post(url, {
      base: baseCurrency,
      target: targetCurrency,
      days: days
    });
    
    // Extract the data from the ADAGE response
    const adageData = response.data;
    const event = adageData.events[0];
    const attrs = event.attributes;
    
    // Transform to our frontend model
    return {
      base: attrs.base_currency,
      target: attrs.target_currency,
      anomaly_count: attrs.anomaly_count,
      analysis_period_days: attrs.analysis_period_days,
      anomaly_points: attrs.anomaly_points
    };
  } catch (error) {
    console.error('Error fetching anomaly detection:', error);
    
    // Return mock data if backend is unavailable
    if (USE_MOCK_DATA) {
      console.log(`Using mock anomaly data for ${baseCurrency}/${targetCurrency}`);
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 400));
      return generateMockAnomalyDetection(baseCurrency, targetCurrency);
    }
    
    throw error;
  }
}; 

export const fetchHistoricalExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<HistoricalDataPoint[]> => {
  try {
    const url = `${API_BASE_URL}/api/v1/currency/rates/${fromCurrency}/${toCurrency}/historical`;
    const response = await axios.post(url);
    console.log(response);


    // Ensure the data is available
    const timeSeriesData = response.data?.event?.[0]?.attributes?.data;

    if (!timeSeriesData) {
      throw new Error('Invalid data format received from API');
    }

    // Map and format the data to HistoricalDataPoint array
    const formattedData: HistoricalDataPoint[] = timeSeriesData.map(
      (entry: { date: string; open: number; high: number; low: number; close: number }) => ({
        date: entry.date,
        open: entry.open,
        high: entry.high,
        low: entry.low,
        close: entry.close,
      })
    );
    

    // Sort chronologically (oldest to newest)
    formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return formattedData;
  } catch (error) {
    console.error('Error fetching historical data:', error);

    // Optional: Return mock data for dev fallback
    if (USE_MOCK_DATA) {
      console.log('Using mock historical data');
      const now = new Date();
      const mockData: HistoricalDataPoint[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          open: 1.0 + i * 0.01,
          high: 1.01 + i * 0.01,
          low: 0.99 + i * 0.01,
          close: 1.0 + i * 0.01,
        };
      }).reverse();

      return mockData;
    }

    throw error;
  }
};

