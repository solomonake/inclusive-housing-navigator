'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const [filters, setFilters] = useState({
    maxRent: searchParams.get('maxRent') || '',
    minScore: searchParams.get('minScore') || '',
    accessibility: searchParams.get('accessibility') === 'true',
    international: searchParams.get('international') === 'true',
    rural: searchParams.get('rural') === 'true',
    transport: searchParams.get('transport') === 'true',
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.maxRent) params.set('maxRent', filters.maxRent);
    if (filters.minScore) params.set('minScore', filters.minScore);
    if (filters.accessibility) params.set('accessibility', 'true');
    if (filters.international) params.set('international', 'true');
    if (filters.rural) params.set('rural', 'true');
    if (filters.transport) params.set('transport', 'true');

    router.push(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      maxRent: '',
      minScore: '',
      accessibility: false,
      international: false,
      rural: false,
      transport: false,
    });
    router.push('/listings');
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="w-5 h-5" />
            Search Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-white/70 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
        <p className="text-white/70 text-sm">Refine your search to find the perfect housing match</p>
      </CardHeader>

      <CardContent className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Budget Filters */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Budget & Score</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Max Monthly Rent ($)
              </label>
              <input
                type="number"
                value={filters.maxRent}
                onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-md"
                placeholder="e.g., 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Min D&I Score
              </label>
              <input
                type="number"
                value={filters.minScore}
                onChange={(e) => handleFilterChange('minScore', e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-md"
                placeholder="e.g., 70"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Special Considerations */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Special Considerations</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.accessibility}
                onChange={(e) => handleFilterChange('accessibility', e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-white/80">♿ Accessibility features</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.international}
                onChange={(e) => handleFilterChange('international', e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-white/80">🌍 International student friendly</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.rural}
                onChange={(e) => handleFilterChange('rural', e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-white/80">🌾 Rural student friendly</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.transport}
                onChange={(e) => handleFilterChange('transport', e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-white/80">🚌 Near public transport</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <Button
            onClick={applyFilters}
            className="w-full"
            size="sm"
          >
            Apply Filters
          </Button>
          <Button
            onClick={clearFilters}
            variant="glass"
            className="w-full"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};