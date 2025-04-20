'use client';

import React, { useState, useEffect } from 'react';

interface HeatmapCell {
  row: string;
  col: string;
  value: number;
}

interface CorrelationHeatmapProps {
  data: HeatmapCell[];
  rowLabels: string[];
  colLabels: string[];
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  data: initialData,
  rowLabels,
  colLabels
}) => {
  // State to hold the data after client-side initialization
  const [data, setData] = useState<HeatmapCell[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const [isSingleColumnHeatmap, setSingleColumnHeatmap] = useState(false);

  // Initialize data only on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // Check if this is a single column heatmap (correlation with exchange rate)
    setSingleColumnHeatmap(colLabels.length === 1);
    
    // If initial data is provided and non-empty, use it
    if (initialData && initialData.length > 0) {
      setData(initialData);
    } else {
      // Otherwise generate sample data
      const newData: HeatmapCell[] = [];
      
      // If single column (exchange rate correlations), create correlation values for each factor
      if (colLabels.length === 1) {
        for (const row of rowLabels) {
          // Generate random correlation values between -0.8 and 0.8
          const value = Math.round((Math.random() * 1.6 - 0.8) * 10) / 10;
          newData.push({ row, col: colLabels[0], value });
        }
      } else {
        // Otherwise create a full heatmap
        for (const row of rowLabels) {
          for (const col of colLabels) {
            if (row === col) {
              newData.push({ row, col, value: 1.0 });
            } else {
              // Generate random correlation values between -0.2 and 0.4
              const value = Math.round((Math.random() * 0.6 - 0.2) * 10) / 10;
              newData.push({ row, col, value });
            }
          }
        }
      }
      
      setData(newData);
    }
  }, [initialData, rowLabels, colLabels]);

  // Get value for a specific cell
  const getCellValue = (row: string, col: string): number => {
    const cell = data.find(d => d.row === row && d.col === col);
    return cell ? cell.value : 0;
  };

  // Generate color based on correlation value
  const getColorForValue = (value: number): string => {
    if (value > 0.7) return 'bg-red-600/90';
    if (value > 0.5) return 'bg-red-500/80';
    if (value > 0.3) return 'bg-red-400/70';
    if (value > 0.1) return 'bg-red-300/60';
    if (value > 0) return 'bg-red-200/50';
    if (value < -0.7) return 'bg-blue-600/90';
    if (value < -0.5) return 'bg-blue-500/80';
    if (value < -0.3) return 'bg-blue-400/70';
    if (value < -0.1) return 'bg-blue-300/60';
    if (value < 0) return 'bg-blue-200/50';
    return 'bg-gray-700';
  };
  
  // Format the correlation value for display
  const formatCorrelationValue = (value: number): string => {
    if (value === 1) return '1.0';
    return value.toFixed(2);
  };
  
  // Handle factor hover for bar chart
  const handleFactorHover = (factor: string) => {
    setHoveredFactor(factor);
  };
  
  // Handle factor hover end
  const handleFactorLeave = () => {
    setHoveredFactor(null);
  };
  
  // Get correlation description
  const getCorrelationDescription = (value: number): string => {
    if (value > 0.5) 
      return 'Strong positive correlation - this factor tends to rise with exchange rate';
    if (value > 0.2) 
      return 'Moderate positive correlation - this factor often rises with exchange rate';
    if (value > 0)
      return 'Weak positive correlation - limited influence on exchange rate';
    if (value < -0.5)
      return 'Strong negative correlation - this factor tends to fall as exchange rate rises';
    if (value < -0.2)
      return 'Moderate negative correlation - this factor often falls as exchange rate rises';
    return 'Weak negative correlation - limited inverse influence on exchange rate';
  };

  // If not on client yet, show a loading placeholder to avoid hydration issues
  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Loading correlation data...</div>
      </div>
    );
  }

  // For single column heatmap (exchange rate correlations), render as a bar chart
  if (isSingleColumnHeatmap) {
    // Sort factors by absolute correlation value
    const sortedFactors = [...rowLabels].sort((a, b) => {
      const aValue = Math.abs(getCellValue(a, colLabels[0]));
      const bValue = Math.abs(getCellValue(b, colLabels[0]));
      return bValue - aValue;
    });

    return (
      <div>
        <div className="text-gray-400 text-sm mb-6">
          This chart shows how strongly each factor correlates with the {colLabels[0]} movement.
          Positive values (red) indicate factors that move in the same direction as the exchange rate,
          while negative values (blue) indicate factors that move in the opposite direction.
        </div>
        
        {/* Bar chart visualization */}
        <div className="space-y-4">
          {sortedFactors.map(factor => {
            const value = getCellValue(factor, colLabels[0]);
            const isPositive = value >= 0;
            const barWidth = Math.abs(value) * 100; // percent of full width
            const isHighlighted = hoveredFactor === factor;
            
            return (
              <div 
                key={factor} 
                className={`p-4 rounded-lg ${isHighlighted ? 'bg-[#1e1e30]' : 'bg-[#232335]'} transition-colors`}
                onMouseEnter={() => handleFactorHover(factor)}
                onMouseLeave={handleFactorLeave}
              >
                <div className="flex justify-between mb-2">
                  <div className="text-white font-medium">{factor}</div>
                  <div className={`font-bold ${isPositive ? 'text-red-400' : 'text-blue-400'}`}>
                    {formatCorrelationValue(value)}
                  </div>
                </div>
                
                <div className="h-6 w-full bg-gray-800 rounded-full overflow-hidden flex">
                  {isPositive ? (
                    <>
                      <div className="w-1/2"></div>
                      <div 
                        className={`h-full ${getColorForValue(value)}`} 
                        style={{ width: `${barWidth / 2}%` }}
                      ></div>
                    </>
                  ) : (
                    <>
                      <div 
                        className={`h-full ${getColorForValue(value)} ml-auto`} 
                        style={{ width: `${barWidth / 2}%` }}
                      ></div>
                      <div className="w-1/2"></div>
                    </>
                  )}
                </div>
                
                {isHighlighted && (
                  <div className="mt-2 text-gray-400 text-xs">
                    {getCorrelationDescription(value)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Scale legend */}
        <div className="mt-8 flex items-center justify-center w-full">
          <div className="w-full max-w-md flex items-center">
            <div className="text-xs text-gray-400 w-16 text-right">-1.0</div>
            <div className="flex-1 h-2 bg-gradient-to-r from-blue-600/90 via-gray-700 to-red-600/90 rounded-full mx-2"></div>
            <div className="text-xs text-gray-400 w-16">+1.0</div>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-400 text-center">
          Correlation scale from -1.0 (perfect negative) to +1.0 (perfect positive)
        </div>
      </div>
    );
  }

  // For multiple columns, render traditional heatmap
  return (
    <div>
      <div className="text-gray-400 text-sm mb-4">
        This heatmap shows the correlation between different factors that influence the exchange rate. 
        Stronger red indicates positive correlation, while stronger blue indicates negative correlation.
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header row with column labels */}
          <div className="flex mb-2">
            <div className="w-24 flex-shrink-0"></div> {/* Empty corner cell */}
            {colLabels.map((col, i) => (
              <div key={i} className="w-20 text-xs text-gray-400 text-center transform -rotate-45 origin-bottom-left translate-y-4">
                {col}
              </div>
            ))}
          </div>
          
          {/* Data rows */}
          {rowLabels.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-1">
              <div className="w-24 flex-shrink-0 text-sm text-gray-400 pr-2 flex items-center justify-end">
                {row}
              </div>
              
              {colLabels.map((col, colIndex) => {
                const value = getCellValue(row, col);
                return (
                  <div 
                    key={colIndex} 
                    className={`w-20 h-12 flex items-center justify-center transition-all duration-200 ${getColorForValue(value)}`}
                  >
                    <span className="text-xs text-white font-medium">
                      {formatCorrelationValue(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Color legend */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center flex-wrap justify-center gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600/90 mr-1"></div>
            <span className="text-xs text-gray-400">Strong negative</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400/70 mr-1"></div>
            <span className="text-xs text-gray-400">Moderate negative</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-700 mr-1"></div>
            <span className="text-xs text-gray-400">No correlation</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400/70 mr-1"></div>
            <span className="text-xs text-gray-400">Moderate positive</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600/90 mr-1"></div>
            <span className="text-xs text-gray-400">Strong positive</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 