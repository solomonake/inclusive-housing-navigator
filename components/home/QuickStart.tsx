'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { Listing } from '@/types';
import { ListingMiniCard } from '@/components/ui/ListingMiniCard';
import { AriaLive } from '@/components/accessibility/aria-live';

export const QuickStart: React.FC = () => {
  const [monthlyBudget, setMonthlyBudget] = useState<number | ''>('');
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [needsAccessibility, setNeedsAccessibility] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [topPicks, setTopPicks] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('');
  const router = useRouter();

  const isFormValid = monthlyBudget !== '' && monthlyBudget > 0 && maxRent !== '' && maxRent > 0;

  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    setTopPicks([]);
    setAriaLiveMessage('Searching for your top housing picks...');

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', '3');
      if (maxRent) queryParams.append('maxRent', maxRent.toString());
      if (needsAccessibility) queryParams.append('accessibility', 'true');

      const apiUrl = `/api/listings?${queryParams.toString()}`;
      const response = await fetch(apiUrl);

      let data: Listing[];
      if (response.ok) {
        const apiResponse = await response.json();
        data = apiResponse.data || [];
      } else {
        console.warn('API call failed, falling back to mock data.');
        const mockResponse = await fetch('/data/listings.json');
        if (!mockResponse.ok) {
          throw new Error('Failed to load mock data');
        }
        const mockData: Listing[] = await mockResponse.json();
        data = mockData.filter(listing =>
          (maxRent === '' || listing.rent <= maxRent) &&
          (!needsAccessibility || listing.acc_bath || listing.elevator || listing.step_free)
        );
      }

      // Sort by D&I score (descending) and take top 3
      const sortedPicks = data
        .sort((a, b) => (b.di_score || 0) - (a.di_score || 0))
        .slice(0, 3);

      setTopPicks(sortedPicks);
      setAriaLiveMessage(`Found ${sortedPicks.length} top picks for your budget and preferences.`);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Failed to load listings. Please try again.');
      setAriaLiveMessage('Failed to load listings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      fetchListings();
    }
  };

  const handleViewAllResults = () => {
    const queryParams = new URLSearchParams();
    if (maxRent) queryParams.append('max_rent', maxRent.toString());
    if (needsAccessibility) queryParams.append('accessibility', 'true');
    router.push(`/listings?${queryParams.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <AriaLive message={ariaLiveMessage} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Budget ($)
            </label>
            <input
              type="number"
              id="monthlyBudget"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              min="0"
              step="50"
              aria-describedby="budget-helper"
              placeholder="1500"
            />
            <p id="budget-helper" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your total budget including rent and utilities
            </p>
          </div>

          <div>
            <label htmlFor="maxRent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Rent ($)
            </label>
            <input
              type="number"
              id="maxRent"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
              min="0"
              step="50"
              aria-describedby="maxrent-helper"
              placeholder="1200"
            />
            <p id="maxrent-helper" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum rent you can afford
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="needsAccessibility"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={needsAccessibility}
            onChange={(e) => setNeedsAccessibility(e.target.checked)}
          />
          <label htmlFor="needsAccessibility" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Needs accessibility features (step-free entry, accessible bathroom, etc.)
          </label>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preferred Language
          </label>
          <select
            id="language"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ne">Nepali</option>
            <option value="lg">Luganda</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Finding...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Find My Top Picks
            </>
          )}
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Finding your matches...</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topPicks.length > 0 && !isLoading && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Top Picks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPicks.map((listing) => (
              <ListingMiniCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleViewAllResults}
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              View all results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};