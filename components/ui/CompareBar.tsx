'use client';

import React from 'react';
import { useCompareStore } from '@/lib/stores/compare';
import Link from 'next/link';
import { X, GitCompare } from 'lucide-react';

export const CompareBar: React.FC = () => {
  const { ids, clear } = useCompareStore();
  const itemCount = ids.length;

  if (itemCount === 0) {
    return null;
  }

  const compareLink = `/listings?compare=${ids.join(',')}`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-lg z-40 transition-transform duration-300 ease-out motion-reduce:transition-none"
      role="region"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Compare bar with ${itemCount} items selected`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium">
            {itemCount} item{itemCount !== 1 ? 's' : ''} selected for comparison
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={compareLink}
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            aria-label={`Compare ${itemCount} selected items`}
          >
            <GitCompare className="w-4 h-4" aria-hidden="true" />
            Compare ({itemCount})
          </Link>
          
          <button
            onClick={clear}
            className="p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors"
            aria-label="Clear all selected items"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};