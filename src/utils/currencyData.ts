export interface Currency {
  code: string;
  name: string;
}

export const supportedCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
]; 