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
  const [needsAccessibility, setNeedsAccessibility] = useState<boolean>(false);
  const [topPicks, setTopPicks] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('');
  const router = useRouter();

  // Auto-derive max rent as 80% of monthly budget
  const maxRent = monthlyBudget ? Math.round(monthlyBudget * 0.8) : '';
  const isFormValid = monthlyBudget !== '' && monthlyBudget > 0;

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
        data = apiResponse.listings || [];
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
    <div className="glass p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
      <AriaLive message={ariaLiveMessage} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white text-shadow mb-2">
            Find Your Perfect Home in Minutes
          </h2>
          <p className="text-white/70">
            Get personalized housing recommendations based on your budget and needs
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label htmlFor="monthlyBudget" className="block text-sm font-medium text-white mb-2">
              Monthly Budget ($)
            </label>
            <input
              type="number"
              id="monthlyBudget"
              className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              min="0"
              step="50"
              aria-describedby="budget-helper"
              placeholder="1500"
            />
            <p id="budget-helper" className="text-xs text-white/60 mt-1">
              Max rent will be set to ${maxRent} (80% of budget)
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="needsAccessibility"
              className="h-4 w-4 text-indigo-600 border-white/20 rounded focus:ring-indigo-500"
              checked={needsAccessibility}
              onChange={(e) => setNeedsAccessibility(e.target.checked)}
            />
            <label htmlFor="needsAccessibility" className="ml-2 text-sm text-white">
              Accessibility features
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
              Find Top Picks
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