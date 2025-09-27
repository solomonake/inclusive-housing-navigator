'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface HeartButtonProps {
  listingId: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({ listingId }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved state from localStorage
    const savedItems = JSON.parse(localStorage.getItem('ih-favorites') || '[]');
    setIsSaved(savedItems.includes(listingId));
  }, [listingId]);

  const toggleSaved = () => {
    let savedItems = JSON.parse(localStorage.getItem('ih-favorites') || '[]');
    
    if (isSaved) {
      savedItems = savedItems.filter((id: string) => id !== listingId);
    } else {
      savedItems.push(listingId);
    }
    
    localStorage.setItem('ih-favorites', JSON.stringify(savedItems));
    setIsSaved(!isSaved);
  };

  return (
    <button
      onClick={toggleSaved}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isSaved}
      title={isSaved ? 'Saved' : 'Unsaved'}
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          isSaved 
            ? 'fill-red-500 text-red-500' 
            : 'fill-none text-gray-400 hover:text-red-500'
        }`}
      />
    </button>
  );
};