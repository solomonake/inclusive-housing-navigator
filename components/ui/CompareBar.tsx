'use client';

import React from 'react';
import { useCompareStore } from '@/lib/stores/compare';
import { useRouter } from 'next/navigation';

export const CompareBar: React.FC = () => {
  const { ids, clear } = useCompareStore();
  const router = useRouter();

  if (ids.length === 0) {
    return null;
  }

  const handleCompare = () => {
    const compareIds = ids.join(',');
    router.push(`/listings?compare=${compareIds}`);
  };

  const handleClear = () => {
    clear();
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      role="region"
      aria-label="Compare listings"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {ids.length} {ids.length === 1 ? 'listing' : 'listings'} selected
            </span>
            <div className="flex items-center space-x-1">
              {ids.slice(0, 3).map((id, index) => (
                <div
                  key={id}
                  className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600"
                  aria-label={`Selected listing ${index + 1}`}
                >
                  {index + 1}
                </div>
              ))}
              {ids.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{ids.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCompare}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 transition-colors"
            >
              Compare ({ids.length})
            </button>
            <button
              onClick={handleClear}
              className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
