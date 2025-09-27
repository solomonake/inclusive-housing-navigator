'use client';

import React, { useState, useEffect } from 'react';

interface CurrencyConverterProps {
  className?: string;
}

interface ExchangeRate {
  [key: string]: number;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ className = '' }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' }
  ];

  // Mock exchange rates for demo purposes
  const mockRates: ExchangeRate = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    CAD: 1.35,
    AUD: 1.52,
    JPY: 110,
    CNY: 6.45,
    INR: 74.5,
    BRL: 5.2,
    MXN: 20.1,
    KRW: 1180,
    SGD: 1.35
  };

  useEffect(() => {
    // In a real app, you would fetch live exchange rates from an API
    setExchangeRates(mockRates);
  }, []);

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const convertCurrency = () => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return;
    
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const converted = (amount / fromRate) * toRate;
    setConvertedAmount(converted);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return amount.toFixed(2);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  };

  const getCurrencyFlag = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.flag || '🌍';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">💱 Currency Converter</h3>
        <p className="text-sm text-gray-600">Convert your budget to different currencies for international students</p>
      </div>

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Swap currencies"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* Conversion Result */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Converted Amount</p>
            <p className="text-3xl font-bold text-blue-600">
              {getCurrencyFlag(toCurrency)} {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {getCurrencyFlag(fromCurrency)} {formatCurrency(amount, fromCurrency)} = {getCurrencyFlag(toCurrency)} {formatCurrency(convertedAmount, toCurrency)}
            </p>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">📊 Exchange Rate Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>1 {fromCurrency} = {exchangeRates[toCurrency] / exchangeRates[fromCurrency]} {toCurrency}</p>
            <p>1 {toCurrency} = {exchangeRates[fromCurrency] / exchangeRates[toCurrency]} {fromCurrency}</p>
            <p className="text-xs text-gray-500 mt-2">
              * Rates are for demonstration purposes. Use current rates for actual conversions.
            </p>
          </div>
        </div>

        {/* Quick Budget Examples */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3">💡 Common Budget Examples</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-green-800">Monthly Rent ($800):</span>
              <span className="font-medium">{getCurrencyFlag(toCurrency)} {formatCurrency(800 * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]), toCurrency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">Security Deposit ($1600):</span>
              <span className="font-medium">{getCurrencyFlag(toCurrency)} {formatCurrency(1600 * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]), toCurrency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">Utilities ($100):</span>
              <span className="font-medium">{getCurrencyFlag(toCurrency)} {formatCurrency(100 * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]), toCurrency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">Groceries ($300):</span>
              <span className="font-medium">{getCurrencyFlag(toCurrency)} {formatCurrency(300 * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]), toCurrency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
