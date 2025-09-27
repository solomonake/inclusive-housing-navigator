'use client';

import React, { useState, useEffect } from 'react';

interface HeartButtonProps {
  listingId: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({ listingId }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('ih-favorites');
    const favorites = saved ? JSON.parse(saved) : [];
    setIsSaved(favorites.includes(listingId));
  }, [listingId]);

  const handleToggle = () => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('ih-favorites');
    const favorites = saved ? JSON.parse(saved) : [];
    
    let newFavorites;
    if (favorites.includes(listingId)) {
      newFavorites = favorites.filter((id: string) => id !== listingId);
      setIsSaved(false);
    } else {
      newFavorites = [...favorites, listingId];
      setIsSaved(true);
    }
    
    localStorage.setItem('ih-favorites', JSON.stringify(newFavorites));
  };

  return (
    <button
      onClick={handleToggle}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
      className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 transition-colors"
      title={isSaved ? 'Saved' : 'Save'}
    >
      <span 
        className={`text-lg ${isSaved ? 'text-red-500' : 'text-gray-400'} transition-colors`}
        role="img"
        aria-hidden="true"
      >
        {isSaved ? '❤️' : '🤍'}
      </span>
    </button>
  );
};
