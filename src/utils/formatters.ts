// src/utils/formatters.ts
export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
  
  export const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };