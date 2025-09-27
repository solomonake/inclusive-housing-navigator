'use client';

import React from 'react';
import { useCompareStore } from '@/lib/stores/compare';

interface CompareCheckboxProps {
  listingId: string;
}

export const CompareCheckbox: React.FC<CompareCheckboxProps> = ({ listingId }) => {
  const { toggle, ids } = useCompareStore();
  const isCompared = ids.includes(listingId);

  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isCompared}
        onChange={() => toggle(listingId)}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        aria-label={`Toggle comparison for listing ${listingId}`}
      />
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        Compare
      </span>
    </label>
  );
};
