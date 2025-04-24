 // src/components/CurrencyDashboard/CurrencySelector.tsx
 'use client';

 import React from 'react';
 import { Currency } from '@/utils/currencyData';
 
 interface CurrencySelectorProps {
   selectedCurrency: string;
   onCurrencyChange: (currency: string) => void;
   label: string;
   currencies: Currency[];
 }
 
 export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
   selectedCurrency,
   onCurrencyChange,
   label,
   currencies,
 }) => {
   return (
     <div className="flex flex-col">
       <label className="text-sm text-gray-400 mb-1">{label}</label>
       <div className="relative">
         <select
           value={selectedCurrency}
           onChange={(e) => onCurrencyChange(e.target.value)}
           className="appearance-none bg-[#2a2a40] text-white px-4 py-2 pr-8 rounded-lg w-full focus:outline-none"
         >
           {currencies.map((currency) => (
             <option key={currency.code} value={currency.code}>
               {currency.code} - {currency.name}
             </option>
           ))}
         </select>
         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
           <svg
             className="w-4 h-4 text-gray-400"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M19 9l-7 7-7-7"
             />
           </svg>
         </div>
       </div>
     </div>
   );
 };