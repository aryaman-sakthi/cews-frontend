'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Types for API endpoints
interface ApiEndpoint {
  name: string;
  description: string;
  url: string;
  exampleRequest: string;
  documentationLink: string;
  copyUrl?: string; // Optional field for the URL to copy (without HTTP method)
}

// Data for the API endpoints
const DATA_COLLECTION_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Currency Exchange': [
    {
      name: 'Latest Exchange Rate',
      description: 'Retrieves the current exchange rate between two currencies',
      url: 'GET /api/v1/currency/rates/{base}/{target}/',
      exampleRequest: 'GET /api/v1/currency/latest/rate/USD/EUR/',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Currency%20Collector/get_api_v1_currency_rates__base___target__',
    },
    {
      name: 'Historical Exchange Rates',
      description: 'Retrieve historical exchange rates for a currency pair',
      url: 'GET /api/v1/currency/rates/{from_currency}/{to_currency}/historical',
      exampleRequest: 'GET /api/v1/currency/rates/USD/EUR/historical',
      documentationLink:  'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Currency%20Collector/get_api_v1_currency_rates__from_currency___to_currency__historical',
    }
  ],
  'Financial News': [
    {
      name: 'General Financial News',
      description: 'Fetch general financial news',
      url: 'GET /api/v1/financial/',
      exampleRequest: 'GET /api/v1/financial/',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20News%20Collector/get_api_v1_financial_',
    },
    {
      name: 'Store Currency News',
      description: 'Fetch and store news related to a specific currency',
      url: 'POST /api/v1/currency/{currency}',
      exampleRequest: 'POST /api/v1/currency/USD',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20News%20Collector/post_api_v1_currency__currency_',
    },
    {
      name: 'Currency News Events',
      description: 'Retrieve stored currency news events',
      url: 'GET /api/v1/news/events',
      exampleRequest: 'GET /api/v1/news/events',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20News%20Collector/get_api_v1_news_events',
    }
  ],
  'Economic Indicators': [
    {
      name: 'Annual Economic Indicators',
      description: 'Fetches and stores annual economic indicators (Real GDP & Inflation) from Alpha Vantage. Returns the latest stored indicators',
      url: 'POST /api/v1/economic/indicators/annual/',
      exampleRequest: 'POST /api/v1/economic/indicators/annual/',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Economic%20Indicators/post_api_v1_economic_indicators_annual_',
    },
    {
      name: 'Monthly Economic Indicators',
      description: 'Fetches and stores monthly economic indicators (CPI, Unemployment Rate, Federal Funds Rate, Treasury Yield) from Alpha Vantage. Returns the latest stored indicators',
      url: 'POST /api/v1/economic/indicators/monthly/',
      exampleRequest: 'POST /api/v1/economic/indicators/monthly/',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Economic%20Indicators/post_api_v1_economic_indicators_monthly_',
    }
  ]
};

const DATA_VISUALIZATION_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Forex History Graphs': [
    {
      name: 'Exchange Rate Graph (Last Week)',
      description: 'Generate a graph of exchange rates for the last week',
      url: 'GET /api/v1/graph/{from_currency}/{to_currency}/last-week',
      exampleRequest: 'GET /api/v1/graph/USD/EUR/last-week',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Data%20Visualization/get_api_v1_graph__from_currency___to_currency__last_week',
    },
    {
      name: 'Exchange Rate Graph (Last Month)',
      description: 'Generate a graph of exchange rates for the last month',
      url: 'GET /api/v1/graph/{from_currency}/{to_currency}/last-month',
      exampleRequest: 'GET /api/v1/graph/USD/EUR/last-month',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Data%20Visualization/get_api_v1_graph__from_currency___to_currency__last_month',
    },
    {
      name: 'Exchange Rate Graph (Last 6 Months)',
      description: 'Generate a graph of exchange rates for the last 6 months',
      url: 'GET /api/v1/graph/{from_currency}/{to_currency}/last-6-months',
      exampleRequest: 'GET /api/v1/graph/USD/EUR/last-6-months',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Data%20Visualization/get_api_v1_graph__from_currency___to_currency__last_6_months',
    },
    {
      name: 'Exchange Rate Graph (Last Year)',
      description: 'Generate a graph of exchange rates for the last year',
      url: 'GET /api/v1/graph/{from_currency}/{to_currency}/last-year',
      exampleRequest: 'GET /api/v1/graph/USD/EUR/last-year',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Data%20Visualization/get_api_v1_graph__from_currency___to_currency__last_year',
    },
    {
      name: 'Exchange Rate Graph (Last 5 Years)',
      description: 'Generate a graph of exchange rates for the last 5 years',
      url: 'GET /api/v1/graph/{from_currency}/{to_currency}/last-5-years',
      exampleRequest: 'GET /api/v1/graph/USD/EUR/last-5-years',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Data%20Visualization/get_api_v1_graph__from_currency___to_currency__last_5_years',
    }
  ]
};

const ANALYTICAL_MODEL_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Volatility Analysis': [
    {
      name: 'Volatility Analysis',
      description: 'Analyze exchange rate volatility between two currencies',
      url: 'GET /api/v1/analytics/volatility/{base}/{target}/',
      exampleRequest: 'GET /api/v1/analytics/volatility/USD/EUR/',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V1%20-%20Analytical%20Model/get_api_v1_analytics_volatility__base___target__',
    }
  ],
  'Anomaly Detection': [
    {
      name: 'Anomaly Detection',
      description: 'Detect anomalies in exchange rate data',
      url: 'POST /api/v2/analytics/anomaly-detection/ \nRequest body: {"base", "target", "days"}',
      exampleRequest: 'POST /api/v2/analytics/anomaly-detection/ \nRequest body: {"base": "USD", "target": "EUR", "days": 30}',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V2%20-%20Prediction%20Model/post_api_v2_analytics_anomaly_detection_',
    }
  ],
  'Correlation Analysis': [
    {
      name: 'Correlation Analysis',
      description: 'Analyze correlations between exchange rates and other factors',
      url: 'GET /api/v2/analytics/correlation/{base}/{target}/',
      exampleRequest: 'GET /api/v2/analytics/correlation/USD/EUR/',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V2%20-%20Prediction%20Model/get_api_v2_analytics_correlation__base___target__',
    }
  ],
  'Forex Prediction': [
    {
      name: 'Forex Prediction',
      description: 'Get prediction for future exchange rates upto 7 days',
      url: 'GET /api/v2/analytics/prediction/{base}/{target}/',
      exampleRequest: 'GET /api/v2/analytics/prediction/USD/EUR/',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V2%20-%20Prediction%20Model/get_api_v2_analytics_prediction__base___target__',
    }
  ]
};

const ALERT_SYSTEM_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Exchange Rate Alerts': [
    {
      name: 'Exchange Rate Alert',
      description: 'Register an alert for when an exchange rate crosses a threshold',
      url: 'POST /api/v1/alerts/register/ \nRequest body: {"base", "target", "alert_type", "threshold", "email"}',
      exampleRequest: 'POST /api/v1/alerts/register/ \nRequest body: {"base": "USD", "target": "EUR", "alert_type": "above", "threshold": 0.85, "email": "user@example.com"}',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V2%20-%20Alert%20System/post_api_v1_alerts_register_',
    },
    {
      name: 'Predicted Exchange Rate Alert',
      description: 'Register an alert for when a predicted exchange rate crosses a threshold',
      url: 'POST /api/v1/alerts/register/ \nRequest body: {"base", "target", "alert_type", "threshold", "email"}',
      exampleRequest: 'POST /api/v1/alerts/register/ \nRequest body: {"base": "USD", "target": "EUR", "alert_type": "above", "threshold": 0.85, "email": "user@example.com"}',
      documentationLink: 'https://app.swaggerhub.com/apis-docs/unsw-77b/Foresight/1.0.0#/V2%20-%20Alert%20System/post_api_v1_alerts_register_',
    }
  ]
};

// Main sections configuration
const SECTIONS = [
  {
    id: 'data-collection',
    title: 'Data Collection',
    subsections: Object.keys(DATA_COLLECTION_ENDPOINTS),
    endpoints: DATA_COLLECTION_ENDPOINTS
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization',
    subsections: Object.keys(DATA_VISUALIZATION_ENDPOINTS),
    endpoints: DATA_VISUALIZATION_ENDPOINTS
  },
  {
    id: 'analytical-model',
    title: 'Analytical Model',
    subsections: Object.keys(ANALYTICAL_MODEL_ENDPOINTS),
    endpoints: ANALYTICAL_MODEL_ENDPOINTS
  },
  {
    id: 'alert-system',
    title: 'Alert System',
    subsections: Object.keys(ALERT_SYSTEM_ENDPOINTS),
    endpoints: ALERT_SYSTEM_ENDPOINTS
  }
];

export default function MicroservicesPage() {
  // State for active subsections in each section
  const [activeSubsections, setActiveSubsections] = useState<Record<string, string>>({
    'data-collection': 'Currency Exchange',
    'data-visualization': 'Forex History Graphs',
    'analytical-model': 'Volatility Analysis',
    'alert-system': 'Exchange Rate Alerts'
  });

  // Add state for toast notification
  const [toast, setToast] = useState<{visible: boolean, message: string}>({
    visible: false,
    message: ''
  });

  // Function to change active subsection
  const handleSubsectionChange = (sectionId: string, subsection: string) => {
    setActiveSubsections(prev => ({
      ...prev,
      [sectionId]: subsection
    }));
  };

  // Function to render endpoint tiles with copy button
  const renderEndpoints = (endpoints: ApiEndpoint[]) => {
    // Function to copy URL to clipboard with toast notification
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          // Show toast notification
          setToast({
            visible: true,
            message: 'URL copied to clipboard!'
          });
          
          // Hide toast after 2 seconds
          setTimeout(() => {
            setToast({visible: false, message: ''});
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setToast({
            visible: true,
            message: 'Failed to copy URL'
          });
          
          // Hide toast after 2 seconds
          setTimeout(() => {
            setToast({visible: false, message: ''});
          }, 2000);
        });
    };

    // Function to extract path from URL (remove HTTP method)
    const getPathFromUrl = (url: string): string => {
      // Remove any HTTP method at the beginning (GET, POST, PUT, DELETE, etc.)
      return url.replace(/^(GET|POST|PUT|DELETE|PATCH)\s+/i, '');
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {endpoints.map((endpoint, idx) => (
          <div key={idx} className="bg-[#2a2a40] rounded-2xl p-6 text-white flex flex-col h-full min-h-[320px] relative">
            {/* Copy button */}
            <button 
              className="absolute top-3 right-3 bg-[#3b3b60]/70 hover:bg-indigo-600 p-1.5 rounded-md transition-colors"
              onClick={() => copyToClipboard(endpoint.copyUrl || getPathFromUrl(endpoint.url))}
              title="Copy API path"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            <div className="flex-grow overflow-hidden">
              <h3 className="text-xl font-semibold mb-2">{endpoint.name}</h3>
              <p className="text-gray-300 mb-4 text-sm">{endpoint.description}</p>
              
              <div className="mb-3">
                <p className="text-sm text-gray-400">URL</p>
                <code className="block bg-[#1a1a2e] p-3 rounded-lg text-sm overflow-x-auto custom-scrollbar text-gray-300">
                  {endpoint.url}
                </code>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-400">Example Request</p>
                <code className="block bg-[#1a1a2e] p-3 rounded-lg text-sm overflow-x-auto whitespace-pre custom-scrollbar text-gray-300">
                  {endpoint.exampleRequest}
                </code>
              </div>
            </div>
            
            <div className="text-center mt-4 pt-3 border-t border-gray-700/30">
              <Link 
                href={endpoint.documentationLink} 
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-colors text-sm w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Documentation
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Foresight</h1>
          <Link 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Explore Our Microservices</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            This API provides currency exchange rates, predictions, volatility analysis, and other financial data. It follows the ADAGE 3.0
            data model for standardized financial data exchange.
          </p>
        </div>

        {/* Render all sections */}
        {SECTIONS.map((section) => (
          <div key={section.id} className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
            </div>
            
            {/* Subsection tabs - with special handling for different section types */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#2a2a40]/70 rounded-xl p-1.5 flex min-w-[70%] max-w-[800px]">
                <div className="flex w-full">
                  {section.subsections.map((subsection) => {
                    // Special handling based on section type
                    if (section.id === 'data-visualization' || section.id === 'alert-system') {
                      // For Data Visualization and Alert System - center with whitespace-nowrap
                      return (
                        <div key={subsection} className="flex justify-center w-full">
                          <button
                            className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                              activeSubsections[section.id] === subsection
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-300 hover:bg-[#3a3a50]/50'
                            }`}
                            onClick={() => handleSubsectionChange(section.id, subsection)}
                          >
                            {subsection}
                          </button>
                        </div>
                      );
                    } else {
                      // For Analytical Model and Data Collection - original style
                      return (
                        <button
                          key={subsection}
                          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mx-1 ${
                            activeSubsections[section.id] === subsection
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-300 hover:bg-[#3a3a50]/50'
                          }`}
                          onClick={() => handleSubsectionChange(section.id, subsection)}
                        >
                          {subsection}
                        </button>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            
            {/* Render endpoints for active subsection */}
            {renderEndpoints(section.endpoints[activeSubsections[section.id]] || [])}
          </div>
        ))}

        {/* Toast Notification */}
        {toast.visible && (
          <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {toast.message}
          </div>
        )}
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(42, 42, 64, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.8);
        }
      `}</style>
    </main>
  );
} 