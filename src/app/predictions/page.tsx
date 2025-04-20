/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ConversionRateChart } from '@/components/PredictionDashboard/ConversionRateChart';
import { PredictionRateCard } from '@/components/PredictionDashboard/PredictionRateCard';
import { VolatilityAnalysis } from '@/components/PredictionDashboard/VolatilityAnalysis';
import { CorrelationHeatmap } from '@/components/PredictionDashboard/CorrelationHeatmap';
import { AnomalyDetectionChart } from '@/components/PredictionDashboard/AnomalyDetectionChart';
import { ConfidenceScoreTile } from '@/components/PredictionDashboard/ConfidenceScoreTile';
import { scrollToElement } from '@/utils/scrollUtils';
import { 
  fetchCurrencyPrediction, 
  fetchVolatilityAnalysis,
  fetchCorrelationAnalysis,
  fetchAnomalyDetection,
  CurrencyPrediction, 
  PredictionValue,
  VolatilityAnalysis as VolatilityAnalysisData,
  CorrelationAnalysis,
  AnomalyDetectionResult
} from '@/lib/api';
import Link from 'next/link';

// Currency options
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
];

// Sample labels for correlation matrix - these will be replaced with real data
const defaultFactors = ['GDP Growth', 'Inflation', 'Interest Rates', 'News Sentiment', 'Trade Balance'];

export default function PredictionsPage() {
  // References for scroll sections
  const upperSectionRef = useRef<HTMLDivElement>(null);
  const lowerSectionRef = useRef<HTMLDivElement>(null);
  
  // State for animation
  const [showLowerSection, setShowLowerSection] = useState(false);
  
  // Currency selection state
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('AUD');
  const [amount, setAmount] = useState(1000);
  const [showBaseCurrencyDropdown, setShowBaseCurrencyDropdown] = useState(false);
  const [showTargetCurrencyDropdown, setShowTargetCurrencyDropdown] = useState(false);
  
  // Prediction data state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<CurrencyPrediction | null>(null);
  
  // Volatility analysis state
  const [volatilityAnalysis, setVolatilityAnalysis] = useState<VolatilityAnalysisData | null>(null);
  const [volatilityLoading, setVolatilityLoading] = useState(false);
  const [volatilityError, setVolatilityError] = useState<string | null>(null);
  
  // Correlation analysis state
  const [correlationAnalysis, setCorrelationAnalysis] = useState<CorrelationAnalysis | null>(null);
  const [correlationLoading, setCorrelationLoading] = useState(false);
  const [correlationError, setCorrelationError] = useState<string | null>(null);
  
  // Anomaly detection state
  const [anomalyData, setAnomalyData] = useState<AnomalyDetectionResult | null>(null);
  const [anomalyLoading, setAnomalyLoading] = useState(false);
  const [anomalyError, setAnomalyError] = useState<string | null>(null);
  
  // Load prediction data when currencies change
  useEffect(() => {
    const loadPredictionData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchCurrencyPrediction(baseCurrency, targetCurrency, {
          forecastHorizon: 7,
          model: 'auto',
          confidence: 80
        });
        
        setPrediction(result);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError('Failed to load prediction data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPredictionData();
  }, [baseCurrency, targetCurrency]);
  
  // Load volatility analysis data when currencies change
  useEffect(() => {
    const loadVolatilityData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setVolatilityLoading(true);
      setVolatilityError(null);
      
      try {
        const result = await fetchVolatilityAnalysis(baseCurrency, targetCurrency, 30);
        setVolatilityAnalysis(result);
      } catch (err) {
        console.error('Error fetching volatility analysis:', err);
        setVolatilityError('Failed to load volatility data. Please try again.');
      } finally {
        setVolatilityLoading(false);
      }
    };
    
    loadVolatilityData();
  }, [baseCurrency, targetCurrency]);
  
  // Load correlation analysis data when currencies change
  useEffect(() => {
    const loadCorrelationData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setCorrelationLoading(true);
      setCorrelationError(null);
      
      try {
        const result = await fetchCorrelationAnalysis(baseCurrency, targetCurrency);
        setCorrelationAnalysis(result);
      } catch (err) {
        console.error('Error fetching correlation analysis:', err);
        setCorrelationError('Failed to load correlation data. Please try again.');
      } finally {
        setCorrelationLoading(false);
      }
    };
    
    loadCorrelationData();
  }, [baseCurrency, targetCurrency]);
  
  // Load anomaly detection data when currencies change
  useEffect(() => {
    const loadAnomalyData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setAnomalyLoading(true);
      setAnomalyError(null);
      
      try {
        const result = await fetchAnomalyDetection(baseCurrency, targetCurrency, 30);
        setAnomalyData(result);
      } catch (err) {
        console.error('Error fetching anomaly detection:', err);
        setAnomalyError('Failed to load anomaly detection data. Please try again.');
      } finally {
        setAnomalyLoading(false);
      }
    };
    
    loadAnomalyData();
  }, [baseCurrency, targetCurrency]);
  
  // Prepare correlation data for the heatmap
  const prepareCorrelationHeatmapData = () => {
    if (!correlationAnalysis) return { data: [], rowLabels: defaultFactors, colLabels: ['Exchange Rate'] };
    
    // Extract factors from the correlation analysis
    const factors = correlationAnalysis.influencingFactors;
    
    // Get factor labels for rows
    const factorLabels = factors.map(factor => factor.factor);
    
    // Create heatmap cells - only create correlations between factors and exchange rate
    const heatmapData = [];
    
    // Add correlation between each factor and exchange rate
    for (const factor of factors) {
      heatmapData.push({
        row: factor.factor,
        col: 'Exchange Rate',
        value: factor.correlation
      });
    }
    
    return {
      data: heatmapData,
      rowLabels: factorLabels,
      colLabels: ['Exchange Rate']
    };
  };
  
  // Setup scroll observation
  useEffect(() => {
    // Set up the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setShowLowerSection(entry.isIntersecting);
      });
    }, { threshold: 0.1 });
    
    // Start observing
    if (lowerSectionRef.current) {
      const currentRef = lowerSectionRef.current;
      observer.observe(currentRef);
    }
    
    return () => {
      // Save a reference to the current value for cleanup
      const currentRef = lowerSectionRef.current;
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  // Handle currency changes with validation
  const handleBaseCurrencyChange = (currency: string) => {
    if (currency === targetCurrency) {
      // Swap currencies if the same one is selected
      setTargetCurrency(baseCurrency);
    }
    setBaseCurrency(currency);
    setShowBaseCurrencyDropdown(false);
  };
  
  const handleTargetCurrencyChange = (currency: string) => {
    if (currency === baseCurrency) {
      // Swap currencies if the same one is selected
      setBaseCurrency(targetCurrency);
    }
    setTargetCurrency(currency);
    setShowTargetCurrencyDropdown(false);
  };
  
  // Create chart data from prediction values
  const createChartData = (predictionValues: PredictionValue[]) => {
    return predictionValues.map((value) => ({
      date: new Date(value.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: value.mean
    }));
  };
  
  // Create prediction rate data from prediction values
  const createPredictionRates = (predictionValues: PredictionValue[]) => {
    return predictionValues.map((value) => ({
      date: new Date(value.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      high: value.upper_bound,
      mean: value.mean,
      low: value.lower_bound
    }));
  };
  
  // Handle scroll to lower section
  const handleScrollToLower = () => {
    scrollToElement('lower-section', 80);
  };
  
  // Handle scroll to upper section
  const handleScrollToUpper = () => {
    scrollToElement('upper-section', 80);
  };
  
  // Find currency info by code
  const findCurrency = (code: string) => {
    return CURRENCIES.find(c => c.code === code) || { code, name: code, flag: '🏳️' };
  };
  
  const baseInfo = findCurrency(baseCurrency);
  const targetInfo = findCurrency(targetCurrency);
  
  // Calculate converted amount
  const convertedAmount = prediction 
    ? amount * prediction.currentRate
    : 0;
  
  // Get heatmap data
  const heatmapProps = prepareCorrelationHeatmapData();
  
  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8">
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Currency Predictions</h1>
          <Link 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Upper Section */}
        <section 
          id="upper-section"
          ref={upperSectionRef}
          className="min-h-screen flex flex-col justify-start py-6"
        >
          {/* Currency Converter Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
            {/* Currency Converter Tile */}
            <div className="lg:col-span-9 bg-[#2a2a40] rounded-2xl p-6 min-h-[180px] flex items-center">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="flex flex-col mb-4 md:mb-0">
                  <div className="mb-2 text-white font-medium">Amount</div>
                  <div className="bg-[#9696fd]/20 p-3 rounded-lg flex items-center w-full md:w-[220px]">
                    <div className="relative">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => setShowBaseCurrencyDropdown(!showBaseCurrencyDropdown)}
                      >
                        <span className="mr-2">{baseInfo.flag}</span>
                        <span className="text-white">{baseInfo.code}</span>
                        <span className="ml-2">▼</span>
                      </div>
                      
                      {/* Currency Dropdown */}
                      {showBaseCurrencyDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-[#2a2a40] rounded-lg shadow-lg z-10 w-40">
                          {CURRENCIES.map(currency => (
                            <div 
                              key={currency.code}
                              className="flex items-center p-2 hover:bg-[#3b3b60] cursor-pointer"
                              onClick={() => handleBaseCurrencyChange(currency.code)}
                            >
                              <span className="mr-2">{currency.flag}</span>
                              <span className="text-white">{currency.code}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input 
                      type="number" 
                      className="ml-auto text-white font-bold bg-transparent text-right w-32 focus:outline-none"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center items-center mx-4 my-2 md:my-0">
                  <div className="bg-[#3b3b60] p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="mb-2 text-white font-medium">Converted to</div>
                  <div className="bg-[#9696fd]/20 p-3 rounded-lg flex items-center justify-between w-full md:w-[250px]">
                    <div className="relative">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => setShowTargetCurrencyDropdown(!showTargetCurrencyDropdown)}
                      >
                        <span className="mr-2">{targetInfo.flag}</span>
                        <span className="text-white">{targetInfo.code}</span>
                        <span className="ml-2">▼</span>
                      </div>
                      
                      {/* Currency Dropdown */}
                      {showTargetCurrencyDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-[#2a2a40] rounded-lg shadow-lg z-10 w-40">
                          {CURRENCIES.map(currency => (
                            <div 
                              key={currency.code}
                              className="flex items-center p-2 hover:bg-[#3b3b60] cursor-pointer"
                              onClick={() => handleTargetCurrencyChange(currency.code)}
                            >
                              <span className="mr-2">{currency.flag}</span>
                              <span className="text-white">{currency.code}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-white font-bold text-right truncate min-w-[120px]">
                      {prediction ? `${targetInfo.flag} ${convertedAmount.toFixed(2)}` : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Confidence Score Tile */}
            <div className="lg:col-span-3 bg-[#2a2a40] rounded-2xl p-6 min-h-[180px] flex justify-center items-center">
              {prediction ? (
                <ConfidenceScoreTile score={prediction.confidenceScore} />
              ) : (
                <div className="text-gray-400">No prediction data</div>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 text-red-200 p-6 rounded-lg text-center my-12">
              {error}
              <button 
                onClick={() => fetchCurrencyPrediction(baseCurrency, targetCurrency)}
                className="mt-4 bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : prediction ? (
            <>
              {/* Chart and Prediction Rate Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                <div className="lg:col-span-8">
                  <div className="bg-[#2a2a40] rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white">{baseCurrency} to {targetCurrency} conversion chart</div>
                      <div className="text-purple-400 font-bold">
                        1 {baseCurrency} = <span className="text-pink-500">{prediction.currentRate.toFixed(5)}</span> {targetCurrency}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm mb-4">
                      Data range: {prediction.inputDataRange}
                    </div>
                    <div className="h-[300px]">
                      <ConversionRateChart 
                        data={createChartData(prediction.predictionValues)}
                        fromCurrency={baseCurrency}
                        toCurrency={targetCurrency}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-4">
                  <PredictionRateCard 
                    predictions={createPredictionRates(prediction.predictionValues)}
                    initialIndex={0}
                  />
                </div>
              </div>
            </>
          ) : null}
          
          {!loading && prediction && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleScrollToLower}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center transition-all duration-300"
              >
                View Analysis
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2 animate-bounce" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          )}
        </section>
        
        {/* Lower Section */}
        <section 
          id="lower-section"
          ref={lowerSectionRef}
          className={`min-h-screen transition-opacity duration-1000 ${showLowerSection ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="pt-16">
            <button
              onClick={handleScrollToUpper}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center mb-8 transition-all duration-300"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Back to Predictions
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-6">Currency Analysis</h2>
            
            <div className="text-gray-400 mb-8">
              Advanced analysis of the relationship between {baseCurrency} and {targetCurrency}, 
              showing volatility patterns and correlations with major economic factors.
            </div>
            
            {/* Volatility Analysis Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-white mb-4">Volatility Analysis</h3>
              
              {volatilityLoading ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8 flex justify-center items-center min-h-[200px]">
                  <div className="text-white">Loading volatility analysis...</div>
                </div>
              ) : volatilityError ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="text-red-400">{volatilityError}</div>
                </div>
              ) : volatilityAnalysis ? (
                <VolatilityAnalysis 
                  level={volatilityAnalysis.volatilityLevel === 'NORMAL' ? 'LOW' : volatilityAnalysis.volatilityLevel}
                  currentValue={volatilityAnalysis.currentVolatility}
                  averageValue={volatilityAnalysis.averageVolatility}
                  trend={volatilityAnalysis.trend}
                />
              ) : (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="text-white">No volatility data available</div>
                </div>
              )}
            </div>
            
            {/* Correlation Analysis Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-white mb-4">Correlation Analysis</h3>
              
              {correlationLoading ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8 flex justify-center items-center min-h-[300px]">
                  <div className="text-white">Loading correlation analysis...</div>
                </div>
              ) : correlationError ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="text-red-400">{correlationError}</div>
                </div>
              ) : correlationAnalysis ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-white mr-2">
                        Factors Affecting {baseCurrency}/{targetCurrency}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-gray-400 text-sm mr-4">
                        <span className="mr-2">Analysis Period:</span>
                        <span className="text-white">{correlationAnalysis.analysisPeriodDays} days</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        <span className="mr-2">Confidence:</span>
                        <span className="text-indigo-400 font-bold">{correlationAnalysis.confidenceScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <CorrelationHeatmap 
                    data={heatmapProps.data}
                    rowLabels={heatmapProps.rowLabels}
                    colLabels={heatmapProps.colLabels}
                  />
                  
                  {correlationAnalysis.influencingFactors.length > 0 && (
                    <div className="mt-6 border-t border-gray-700 pt-4">
                      <div className="text-gray-300 text-sm">
                        The data above shows how different economic factors correlate with changes in the {baseCurrency}/{targetCurrency} exchange rate.
                        Factors with higher positive values tend to move in the same direction as the exchange rate, while 
                        those with negative values tend to move in the opposite direction.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="text-white">No correlation data available</div>
                </div>
              )}
            </div>

            {/* Anomaly Detection Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-white mb-4">Anomaly Detection</h3>
              
              {anomalyLoading ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8 flex justify-center items-center min-h-[300px]">
                  <div className="text-white">Loading anomaly detection...</div>
                </div>
              ) : anomalyError ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="text-red-400">{anomalyError}</div>
                </div>
              ) : anomalyData ? (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-white mr-2">
                        Exchange Rate Anomalies
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center">
                      <div className="text-gray-400 text-sm mr-4">
                        <span className="mr-2">Analysis Period:</span>
                        <span className="text-white">{anomalyData.analysis_period_days} days</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        <span className="mr-2">Anomalies Found:</span>
                        <span className={`font-bold ${anomalyData.anomaly_count > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {anomalyData.anomaly_count}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <AnomalyDetectionChart 
                    anomalyPoints={anomalyData.anomaly_points}
                    baseCurrency={baseCurrency}
                    targetCurrency={targetCurrency}
                  />
                  
                  <div className="mt-6 border-t border-gray-700 pt-4">
                    <div className="text-gray-300 text-sm">
                      {anomalyData.anomaly_count > 0 ? (
                        <>
                          Our system has detected {anomalyData.anomaly_count} anomalies in the {baseCurrency}/{targetCurrency} exchange rate over the past {anomalyData.analysis_period_days} days.
                          These anomalies represent times when the exchange rate behaved in unexpected ways, which might indicate market volatility or 
                          reactions to significant economic events.
                        </>
                      ) : (
                        <>
                          No anomalies were detected in the {baseCurrency}/{targetCurrency} exchange rate over the past {anomalyData.analysis_period_days} days,
                          indicating a period of relatively stable and predictable currency movement.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                  <div className="text-white">No anomaly detection data available</div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 