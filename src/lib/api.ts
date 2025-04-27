import axios from "axios";

/**
 * Fetches the current exchange rate between two currencies
 */
export const fetchExchangeRate = async (from: string, to: string): Promise<number> => {
  try {
    console.log(`Fetching exchange rate from ${from} to ${to}`);
    
    // Use the proxy API route to avoid CORS issues
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

export interface PredictionValue {
    timestamp: string;
  mean: number;
  lower_bound: number;
  upper_bound: number;
  isHistorical?: boolean;
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
  backtestValues?: PredictionValue[];
}
interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  backtestValues?: PredictionValue[];
}

// Interface for Currency News Articles
export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: string;
  currency: string;
}

// Interface for Currency News API Response (ADAGE 3.0 format from Django backend)
export interface CurrencyNewsResponse {
  data_source: string;
  dataset_type: string;
  dataset_id: string;
  time_object: {
    timestamp: string;
    timezone: string;
  };
  events: Array<{
    time_object: {
      timestamp: string;
      duration: number;
      duration_unit: string;
      timezone: string;
    };
    event_type: string;
    event_id: string;
    attributes: {
      title: string;
      source: string;
      url: string;
      summary: string;
      sentiment_score: number;
      sentiment_label: string;
      currency: string;
    };
  }>;
}

// Fetch currency news for a specific currency (one currency at a time)
export const fetchCurrencyNews = async (
  currency: string,
  limit: number = 10,
  sentimentScore?: number
): Promise<NewsArticle[]> => {
  try {
    console.log(`Fetching news for currency: ${currency}, limit: ${limit}`);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('currency', currency);
    queryParams.append('limit', limit.toString());
    
    if (sentimentScore !== undefined) {
      queryParams.append('sentiment_score', sentimentScore.toString());
    }
    
    // Use the proxy API route to avoid CORS issues
    const response = await fetch(`/api/currency-news?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching currency news: ${response.status}`);
    }
    
    const data: CurrencyNewsResponse = await response.json();
    
    // Process the news data from ADAGE format
    if (data.events && data.events.length > 0) {
      return data.events.map(event => ({
        title: event.attributes.title,
        source: event.attributes.source,
        url: event.attributes.url,
        summary: event.attributes.summary,
        sentiment_score: event.attributes.sentiment_score,
        sentiment_label: event.attributes.sentiment_label,
        currency: event.attributes.currency
      }));
    }
    
    return [];
  } catch (error) {
    console.error(`Failed to fetch currency news for ${currency}:`, error);
    throw error;
  }
};

// Fetch news for a currency pair (by making two separate requests)
export const fetchCurrencyPairNews = async (
  fromCurrency: string,
  toCurrency: string,
  limit: number = 3
): Promise<NewsArticle[]> => {
  try {
    console.log(`Fetching news for currency pair: ${fromCurrency}/${toCurrency}`);
    
    // Make two separate requests for each currency
    const [fromNewsResponse, toNewsResponse] = await Promise.all([
      fetch(`/api/currency-news?currency=${fromCurrency}&limit=${limit}`),
      fetch(`/api/currency-news?currency=${toCurrency}&limit=${limit}`)
    ]);
    
    // Check if either request failed
    if (!fromNewsResponse.ok || !toNewsResponse.ok) {
      const errorStatus = !fromNewsResponse.ok ? 
        fromNewsResponse.status : toNewsResponse.status;
      throw new Error(`Error fetching currency news: ${errorStatus}`);
    }
    
    // Parse both responses
    const fromData: CurrencyNewsResponse = await fromNewsResponse.json();
    const toData: CurrencyNewsResponse = await toNewsResponse.json();
    
    // Combine events from both responses
    const combinedEvents = [
      ...(fromData.events || []),
      ...(toData.events || [])
    ];
    
    // Sort by timestamp, newest first
    combinedEvents.sort((a, b) => {
      return new Date(b.time_object.timestamp).getTime() - 
             new Date(a.time_object.timestamp).getTime();
    });
    
    // Convert to NewsArticle format
    const articles = combinedEvents.map(event => ({
      title: event.attributes.title,
      source: event.attributes.source,
      url: event.attributes.url,
      summary: event.attributes.summary,
      sentiment_score: event.attributes.sentiment_score,
      sentiment_label: event.attributes.sentiment_label,
      currency: event.attributes.currency
    }));
    
    return articles;
  } catch (error) {
    console.error(`Failed to fetch news for currency pair ${fromCurrency}/${toCurrency}:`, error);
    throw error;
  }
};

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

export interface VolatilityData {
  base: string;
  target: string;
  volatility: {
    date: string;
    value: number;
  }[];
  period_days: number;
}

export const fetchCurrencyPrediction = async (
  fromCurrency: string, 
  toCurrency: string, 
  options?: { 
    refresh?: boolean, 
    forecastHorizon?: number, 
    model?: 'arima' | 'statistical' | 'auto', 
    confidence?: number,
    backtest?: boolean
  }
): Promise<CurrencyPrediction> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('from', fromCurrency);
    queryParams.append('to', toCurrency);
    
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
    
    if (options?.backtest) {
      queryParams.append('backtest', 'true');
    }
    
    // Add timestamp to prevent browser caching
    queryParams.append('_t', Date.now().toString());
    
    // Use the proxy API route to avoid CORS issues
    console.log(`Fetching prediction data for ${fromCurrency}/${toCurrency}`);
    const response = await fetch(`/api/prediction?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching prediction: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the first event from the ADAGE response
    const event = data.events[0];
    const attributes = event.attributes;
    
    // Log all attributes for debugging
    console.log('All prediction attributes:', attributes);
    
    // Specifically check confidence_score value
    console.log(`Confidence score in attributes: ${attributes.confidence_score}, type: ${typeof attributes.confidence_score}`);
    
    // Check for backtest data in the attributes
    const backtest_values = attributes.backtest_values || [];
    
    // Add historical flag to backtest values
    const backtestValuesWithFlag = backtest_values.map((value: PredictionValue) => ({
      ...value,
      isHistorical: true
    }));
    
    // Add future flag to prediction values
    const predictionValuesWithFlag = attributes.prediction_values.map((value: PredictionValue) => ({
      ...value,
      isHistorical: false
    }));
    
    // Transform to our frontend model
    const prediction = {
      baseCurrency: attributes.base_currency,
      targetCurrency: attributes.target_currency,
      currentRate: attributes.current_rate,
      changePercent: attributes.change_percent,
      confidenceScore: Number(attributes.confidence_score),
      modelVersion: attributes.model_version,
      inputDataRange: attributes.input_data_range,
      influencingFactors: attributes.influencing_factors,
      predictionValues: predictionValuesWithFlag,
      meanSquareError: attributes.mean_square_error,
      rootMeanSquareError: attributes.root_mean_square_error,
      meanAbsoluteError: attributes.mean_absolute_error,
      backtestValues: backtestValuesWithFlag
    };
    
    // Log the transformed prediction object
    console.log(`Returning prediction with confidence score: ${prediction.confidenceScore}`);
    
    return prediction;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

export const fetchVolatilityAnalysis = async (
  baseCurrency: string,
  targetCurrency: string,
  days: number = 30
): Promise<VolatilityAnalysis> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('base', baseCurrency);
    queryParams.append('target', targetCurrency);
    queryParams.append('days', days.toString());
    
    // Use the proxy API route to avoid CORS issues
    console.log(`Fetching volatility data for ${baseCurrency}/${targetCurrency}`);
    const response = await fetch(`/api/volatility?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching volatility analysis: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the first event from the ADAGE response
    const event = data.events[0];
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
    throw error;
  }
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
    queryParams.append('base', baseCurrency);
    queryParams.append('target', targetCurrency);
    
    if (options?.refresh) {
      queryParams.append('refresh', 'true');
    }
    
    if (options?.lookbackDays) {
      queryParams.append('lookback_days', options.lookbackDays.toString());
    }
    
    // Add timestamp to prevent caching
    queryParams.append('_t', Date.now().toString());
    
    // Use the proxy API route to avoid CORS issues
    console.log(`Fetching correlation data for ${baseCurrency}/${targetCurrency}`);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn('Correlation request timed out');
    }, 10000); // 10 second timeout
    
    try {
      const response = await fetch(`/api/correlation?${queryParams.toString()}`, {
        signal: controller.signal,
        cache: 'no-store'
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Error fetching correlation analysis: ${response.status}`);
        
        // Return a default empty response structure instead of throwing an error
        return createEmptyCorrelationData(baseCurrency, targetCurrency, options?.lookbackDays || 90);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || !data.events || !data.events[0]) {
        console.warn('Invalid correlation API response structure', data);
        return createEmptyCorrelationData(baseCurrency, targetCurrency, options?.lookbackDays || 90);
      }
      
      // Try to safely extract attributes
      interface CorrelationAttributes {
        base_currency?: string;
        target_currency?: string;
        confidence_score?: number;
        data_completeness?: number;
        analysis_period_days?: number;
        influencing_factors?: CorrelationFactor[];
        correlations?: {
          news_sentiment: Record<string, number>;
          economic_indicators: Record<string, number>;
          volatility_news: Record<string, number>;
        };
      }
      
      let attrs: CorrelationAttributes = {};
      try {
        attrs = data.events[0].attributes || {};
      } catch (e) {
        console.warn('Could not extract attributes from correlation data', e);
        return createEmptyCorrelationData(baseCurrency, targetCurrency, options?.lookbackDays || 90);
      }
      
      // Validate that required fields exist, if not, provide defaults
      const baseCurrencyResult = attrs.base_currency || baseCurrency;
      const targetCurrencyResult = attrs.target_currency || targetCurrency;
      
      // Transform to our frontend model with default values for missing fields
      return {
        baseCurrency: baseCurrencyResult,
        targetCurrency: targetCurrencyResult,
        confidenceScore: attrs.confidence_score || 0,
        dataCompleteness: attrs.data_completeness || 0,
        analysisPeriodDays: attrs.analysis_period_days || 90,
        influencingFactors: Array.isArray(attrs.influencing_factors) ? attrs.influencing_factors : [],
        correlations: attrs.correlations || {
          news_sentiment: {},
          economic_indicators: {},
          volatility_news: {}
        }
      };
    } catch (fetchError) {
      // Clear the timeout if fetch fails
      clearTimeout(timeoutId);
      
      console.warn('Fetch error in correlation analysis:', fetchError);
      return createEmptyCorrelationData(baseCurrency, targetCurrency, options?.lookbackDays || 90);
    }
  } catch (error) {
    console.error('General error in fetchCorrelationAnalysis:', error);
    return createEmptyCorrelationData(baseCurrency, targetCurrency, options?.lookbackDays || 90);
  }
};

// Helper function to create empty correlation data
function createEmptyCorrelationData(base: string, target: string, days: number): CorrelationAnalysis {
  return {
    baseCurrency: base,
    targetCurrency: target,
    confidenceScore: 0,
    dataCompleteness: 0,
    analysisPeriodDays: days,
    influencingFactors: [],
    correlations: {
      news_sentiment: {},
      economic_indicators: {},
      volatility_news: {}
    }
  };
}

export const fetchAnomalyDetection = async (
  baseCurrency: string,
  targetCurrency: string,
  days: number = 30
): Promise<AnomalyDetectionResult> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('base', baseCurrency);
    queryParams.append('target', targetCurrency);
    queryParams.append('days', days.toString());
    
    // Add timestamp to prevent caching
    queryParams.append('_t', Date.now().toString());
    
    console.log(`Fetching anomaly data for ${baseCurrency}/${targetCurrency} (${days} days)`);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('Anomaly detection request timed out');
    }, 10000); // 10 second timeout
    
    try {
      const response = await fetch(`/api/anomalies?${queryParams.toString()}`, {
        method: 'POST',
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Error fetching anomaly data: ${response.status}`, errorText);
        
        // Return default empty result instead of throwing error
        return {
          base: baseCurrency,
          target: targetCurrency,
          anomaly_count: 0,
          analysis_period_days: days,
          anomaly_points: []
        };
      }
      
      const data = await response.json();
      console.log(`Received anomaly data for ${baseCurrency}/${targetCurrency}:`, data);
      
      // Validate minimum data structure
      if (!data || (typeof data !== 'object')) {
        console.warn('Invalid anomaly detection response structure', data);
        // Return default empty result
        return {
          base: baseCurrency,
          target: targetCurrency,
          anomaly_count: 0,
          analysis_period_days: days,
          anomaly_points: []
        };
      }
      
      // Check if we received an error object from the API
      if (data.error) {
        console.warn(`Received error from anomaly API: ${data.error}`);
        // Return default empty result
        return {
          base: baseCurrency,
          target: targetCurrency,
          anomaly_count: 0,
          analysis_period_days: days,
          anomaly_points: []
        };
      }
      
      // Check if we got a valid response with at least the minimal required fields
      if (!('base' in data) || !('target' in data)) {
        console.warn('Missing required fields in anomaly data', data);
        
        // Create a fallback object since data is missing required fields
        return {
          base: baseCurrency,
          target: targetCurrency,
          anomaly_count: 0,
          analysis_period_days: days,
          anomaly_points: []
        };
      }
      
      // Ensure anomaly_points is at least an empty array if it's missing
      if (!('anomaly_points' in data) || !Array.isArray(data.anomaly_points)) {
        console.warn('Missing anomaly_points array in response, using empty array', data);
        data.anomaly_points = [];
      }
      
      // Ensure anomaly_count exists
      if (!('anomaly_count' in data)) {
        data.anomaly_count = data.anomaly_points.length;
      }
      
      // Ensure analysis_period_days exists
      if (!('analysis_period_days' in data)) {
        data.analysis_period_days = days;
      }
      
      return data as AnomalyDetectionResult;
    } catch (fetchError) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Handle timeout or network errors gracefully
      console.warn('Fetch error in anomaly detection:', fetchError);
      
      // Return default empty result for any fetch error
      return {
        base: baseCurrency,
        target: targetCurrency,
        anomaly_count: 0,
        analysis_period_days: days,
        anomaly_points: []
      };
    }
  } catch (error) {
    console.error('Error in fetchAnomalyDetection:', error);
    
    // Return default empty result as final fallback
    return {
      base: baseCurrency,
      target: targetCurrency,
      anomaly_count: 0,
      analysis_period_days: days,
      anomaly_points: []
    };
  }
};

export const fetchVolatilityData = async (
  baseCurrency: string,
  targetCurrency: string,
  days: number = 30
): Promise<VolatilityData> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('base', baseCurrency);
    queryParams.append('target', targetCurrency);
    queryParams.append('days', days.toString());
    
    // Add timestamp to prevent caching
    queryParams.append('_t', Date.now().toString());
    
    console.log(`Fetching volatility data for ${baseCurrency}/${targetCurrency} (${days} days)`);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('Volatility data request timed out');
    }, 10000); // 10 second timeout
    
    const response = await fetch(`/api/volatility?${queryParams.toString()}`, {
      method: 'POST',
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching volatility data: ${response.status}`, errorText);
      
      // Return specific error messages based on status codes
      if (response.status === 504) {
        throw new Error('Volatility data request timed out. The server might be overloaded or temporarily unavailable.');
      } else if (response.status === 404) {
        throw new Error(`No volatility data available for ${baseCurrency}/${targetCurrency}`);
      } else if (response.status >= 500) {
        throw new Error('Server error while fetching volatility data. Please try again later.');
      } else {
        throw new Error(`Failed to fetch volatility data: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    // Validate minimum data structure
    if (!data || !data.volatility) {
      console.warn('Invalid volatility response structure', data);
      throw new Error(`No valid volatility data available for ${baseCurrency}/${targetCurrency}`);
    }
    
    return data as VolatilityData;
  } catch (error) {
    console.error('Error in fetchVolatilityData:', error);
    throw error;
  }
}; 

export const fetchHistoricalExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<HistoricalDataPoint[]> => {
  try {
    const url = `https://foresight-backend-v2.devkitty.pro/api/v2/currency/rates/${fromCurrency}/${toCurrency}/historical`;
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
    throw error;
  }
};

