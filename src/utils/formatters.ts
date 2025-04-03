// src/utils/formatters.ts
export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  export const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };