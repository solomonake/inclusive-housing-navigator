'use client';

import React, { useState } from 'react';
import { ListingMiniCard } from '@/components/ui/ListingMiniCard';
import { Listing, Subscores } from '@/types';

interface QuickStartForm {
  monthlyBudget: string;
  maxRent: string;
  needsAccessibility: boolean;
  language: string;
}

interface QuickStartState {
  isLoading: boolean;
  results: Listing[];
  error: string | null;
  announcement: string;
}

export const QuickStart: React.FC = () => {
  const [form, setForm] = useState<QuickStartForm>({
    monthlyBudget: '',
    maxRent: '',
    needsAccessibility: false,
    language: 'en'
  });

  const [state, setState] = useState<QuickStartState>({
    isLoading: false,
    results: [],
    error: null,
    announcement: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.maxRent || !form.monthlyBudget) {
      setState(prev => ({ ...prev, error: 'Please fill in budget and max rent' }));
      return;
    }

    setState({ isLoading: true, results: [], error: null, announcement: '' });

    try {
      // Try API first
      const response = await fetch(`/api/listings?limit=3&maxRent=${form.maxRent}`);
      
      let listings: Listing[] = [];
      
      if (response.ok) {
        const data = await response.json();
        listings = data.listings || [];
      } else {
        // Fallback to mock data
        const mockResponse = await fetch('/data/listings.json');
        if (mockResponse.ok) {
          const mockData = await mockResponse.json();
          listings = (mockData.listings || []).slice(0, 3);
        }
      }

      // Filter by accessibility needs if requested
      if (form.needsAccessibility) {
        listings = listings.filter(listing => 
          listing.subscores?.accessibility && listing.subscores.accessibility > 60
        );
      }

      setState({
        isLoading: false,
        results: listings,
        error: null,
        announcement: `Top picks ready: ${listings.length} listings.`
      });

    } catch (err) {
      setState({
        isLoading: false,
        results: [],
        error: 'Failed to load listings. Please try again.',
        announcement: 'Failed to load listings.'
      });
    }
  };

  const buildViewAllUrl = () => {
    const params = new URLSearchParams();
    params.set('maxRent', form.maxRent);
    params.set('budget', form.monthlyBudget);
    if (form.needsAccessibility) params.set('accessibility', 'true');
    if (form.language !== 'en') params.set('lang', form.language);
    return `/listings?${params.toString()}`;
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Aria Live Region */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {state.announcement}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Budget ($)
            </label>
            <input
              type="number"
              id="monthlyBudget"
              name="monthlyBudget"
              value={form.monthlyBudget}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
              placeholder="2000"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Your total monthly housing budget</p>
          </div>

          <div>
            <label htmlFor="maxRent" className="block text-sm font-medium text-gray-700 mb-1">
              Max Rent ($)
            </label>
            <input
              type="number"
              id="maxRent"
              name="maxRent"
              value={form.maxRent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
              placeholder="1500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Maximum rent you can afford</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="needsAccessibility"
              name="needsAccessibility"
              checked={form.needsAccessibility}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-[var(--ring)] border-gray-300 rounded"
            />
            <label htmlFor="needsAccessibility" className="ml-2 block text-sm text-gray-700">
              Needs accessibility features
            </label>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={form.language}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="ne">नेपाली (Nepali)</option>
              <option value="lg">Luganda</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={state.isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.isLoading ? 'Finding your perfect match...' : 'Find My Top Picks'}
        </button>

        {state.error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {state.error}
          </div>
        )}
      </form>

      {/* Results Section */}
      {state.results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Top Picks</h3>
          <div className="space-y-4">
            {state.results.map((listing) => (
              <ListingMiniCard key={listing.id} listing={listing} />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <a
              href={buildViewAllUrl()}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 transition-colors"
            >
              View all results ({state.results.length} found)
            </a>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {state.isLoading && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
