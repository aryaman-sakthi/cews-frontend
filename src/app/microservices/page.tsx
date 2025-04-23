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
}

// Data for the API endpoints
const DATA_COLLECTION_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Currency Exchange': [
    {
      name: 'Latest Exchange Rate',
      description: 'Retrieves the current exchange rate between two currencies',
      url: 'GET /api/v1/currency/latest/rate/{baseCurrency}/{targetCurrency}',
      exampleRequest: 'GET /api/v1/currency/latest/rate/USD/EUR',
      documentationLink: '/docs/api/currency-exchange/latest-rate',
    },
    {
      name: 'Historical Exchange Rates',
      description: 'Retrieves historical exchange rates over a specified time period',
      url: 'GET /api/v1/currency/historical/{baseCurrency}/{targetCurrency}?from={startDate}&to={endDate}',
      exampleRequest: 'GET /api/v1/currency/historical/USD/EUR?from=2023-01-01&to=2023-01-31',
      documentationLink:  '/docs/api/currency-exchange/historical-rates',
    }
  ],
  'Financial News': [
    {
      name: 'Latest Currency News',
      description: 'Retrieves the latest news articles related to specified currencies',
      url: 'GET /api/v1/news/currency/{currencies}',
      exampleRequest: 'GET /api/v1/news/currency/USD,EUR,JPY',
      documentationLink: '/docs/api/financial-news/latest',
    },
    {
      name: 'Sentiment Analysis',
      description: 'Analyzes the sentiment of news articles for a currency',
      url: 'GET /api/v1/news/sentiment/{currency}',
      exampleRequest: 'GET /api/v1/news/sentiment/USD',
      documentationLink: '/docs/api/financial-news/sentiment',
    }
  ],
  'Economic Indicators': [
    {
      name: 'Interest Rates',
      description: 'Retrieves current and historical interest rates for a country',
      url: 'GET /api/v1/indicators/interest-rates/{countryCode}',
      exampleRequest: 'GET /api/v1/indicators/interest-rates/US',
      documentationLink: '/docs/api/economic-indicators/interest-rates',
    },
    {
      name: 'GDP Growth',
      description: 'Retrieves GDP growth data for a country',
      url: 'GET /api/v1/indicators/gdp-growth/{countryCode}',
      exampleRequest: 'GET /api/v1/indicators/gdp-growth/US',
      documentationLink: '/docs/api/economic-indicators/gdp-growth',
    }
  ]
};

const DATA_VISUALIZATION_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Forex History Graphs': [
    {
      name: 'Line Chart',
      description: 'Generates a line chart of historical exchange rates',
      url: 'GET /api/v1/visualization/line-chart/{baseCurrency}/{targetCurrency}?period={days}',
      exampleRequest: 'GET /api/v1/visualization/line-chart/USD/EUR?period=30',
      documentationLink: '/docs/api/visualization/line-chart',
    },
    {
      name: 'Candlestick Chart',
      description: 'Generates a candlestick chart for forex trading analysis',
      url: 'GET /api/v1/visualization/candlestick/{baseCurrency}/{targetCurrency}?period={days}',
      exampleRequest: 'GET /api/v1/visualization/candlestick/USD/JPY?period=30',
      documentationLink: '/docs/api/visualization/candlestick',
    }
  ]
};

const ANALYTICAL_MODEL_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Volatility Analysis': [
    {
      name: 'Volatility Index',
      description: 'Calculates the volatility index for a currency pair',
      url: 'GET /api/v1/analytics/volatility/{baseCurrency}/{targetCurrency}?period={days}',
      exampleRequest: 'GET /api/v1/analytics/volatility/USD/EUR?period=30',
      documentationLink: '/docs/api/analytics/volatility-index',
    }
  ],
  'Anomaly Detection': [
    {
      name: 'Detect Anomalies',
      description: 'Identifies anomalies in exchange rate movements',
      url: 'GET /api/v1/analytics/anomalies/{baseCurrency}/{targetCurrency}?period={days}',
      exampleRequest: 'GET /api/v1/analytics/anomalies/USD/JPY?period=90',
      documentationLink: '/docs/api/analytics/anomaly-detection',
    }
  ],
  'Correlation Analysis': [
    {
      name: 'Currency Correlations',
      description: 'Analyzes correlations between currency pairs',
      url: 'GET /api/v1/analytics/correlations/{baseCurrency}/{targetCurrency}',
      exampleRequest: 'GET /api/v1/analytics/correlations/EUR/USD',
      documentationLink: '/docs/api/analytics/currency-correlations',
    },
    {
      name: 'Factor Analysis',
      description: 'Analyzes economic factors affecting currency values',
      url: 'GET /api/v1/analytics/factors/{baseCurrency}/{targetCurrency}',
      exampleRequest: 'GET /api/v1/analytics/factors/USD/EUR',
      documentationLink: '/docs/api/analytics/factor-analysis',
    }
  ],
  'Forex Prediction': [
    {
      name: 'Rate Prediction',
      description: 'Predicts future exchange rates based on historical data',
      url: 'GET /api/v1/analytics/predict/{baseCurrency}/{targetCurrency}?horizon={days}',
      exampleRequest: 'GET /api/v1/analytics/predict/USD/EUR?horizon=7',
      documentationLink: '/docs/api/analytics/rate-prediction',
    },
    {
      name: 'Trend Analysis',
      description: 'Analyzes trends in currency exchange rates',
      url: 'GET /api/v1/analytics/trends/{baseCurrency}/{targetCurrency}?period={days}',
      exampleRequest: 'GET /api/v1/analytics/trends/USD/EUR?period=30',
      documentationLink: '/docs/api/analytics/trend-analysis',
    }
  ]
};

const ALERT_SYSTEM_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  'Exchange Rate Alerts': [
    {
      name: 'Create Alert',
      description: 'Sets up an alert for when an exchange rate reaches a threshold',
      url: 'POST /api/v1/alerts/create',
      exampleRequest: 'POST /api/v1/alerts/create\n{\n  "baseCurrency": "USD",\n  "targetCurrency": "EUR",\n  "threshold": 0.85,\n  "email": "user@example.com"\n}',
      documentationLink: '/docs/api/alerts/create',
    },
    {
      name: 'Delete Alert',
      description: 'Deletes an existing exchange rate alert',
      url: 'DELETE /api/v1/alerts/{alertId}',
      exampleRequest: 'DELETE /api/v1/alerts/12345',
      documentationLink: '/docs/api/alerts/delete',
    },
    {
      name: 'List Alerts',
      description: 'Lists all active alerts for a user',
      url: 'GET /api/v1/alerts/list?userId={userId}',
      exampleRequest: 'GET /api/v1/alerts/list?userId=user@example.com',
      documentationLink: '/docs/api/alerts/list',
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

  // Function to change active subsection
  const handleSubsectionChange = (sectionId: string, subsection: string) => {
    setActiveSubsections(prev => ({
      ...prev,
      [sectionId]: subsection
    }));
  };

  // Function to render endpoint tiles
  const renderEndpoints = (endpoints: ApiEndpoint[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {endpoints.map((endpoint, idx) => (
          <div key={idx} className="bg-[#2a2a40] rounded-2xl p-6 text-white flex flex-col h-full min-h-[320px]">
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
            
            {/* Subsection tabs - updated for better alignment */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#2a2a40]/70 rounded-xl p-1.5 flex min-w-[70%] max-w-[800px] justify-between">
                {section.subsections.map((subsection) => (
                  <button
                    key={subsection}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSubsections[section.id] === subsection
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-[#3a3a50]/50'
                    }`}
                    onClick={() => handleSubsectionChange(section.id, subsection)}
                  >
                    {subsection}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Render endpoints for active subsection */}
            {renderEndpoints(section.endpoints[activeSubsections[section.id]] || [])}
          </div>
        ))}
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