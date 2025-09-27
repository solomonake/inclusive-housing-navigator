'use client';

import React, { useEffect, useState } from 'react';

export const FontSizeToggle: React.FC = () => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');

  useEffect(() => {
    const saved = localStorage.getItem('fontSize') as 'normal' | 'large' | 'extra-large';
    if (saved) {
      setFontSize(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'extra-large';
      return 'normal';
    });
  };

  return (
    <button
      onClick={cycleFontSize}
      className="btn-secondary text-sm"
      aria-label={`Current font size: ${fontSize}. Click to change font size.`}
    >
      A{fontSize === 'large' ? 'A' : fontSize === 'extra-large' ? 'AA' : ''}
    </button>
  );
};
