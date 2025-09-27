'use client';

import React, { useState, useEffect } from 'react';
import { Type, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FontSizeToggle: React.FC = () => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  useEffect(() => {
    // Check for saved font size preference
    const savedFontSize = localStorage.getItem('fontSize') as 'sm' | 'base' | 'lg' | null;
    if (savedFontSize) {
      setFontSize(savedFontSize);
      document.documentElement.setAttribute('data-font-size', savedFontSize);
    }
  }, []);

  const updateFontSize = (newSize: 'sm' | 'base' | 'lg') => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
    document.documentElement.setAttribute('data-font-size', newSize);
  };

  const increaseFontSize = () => {
    if (fontSize === 'sm') updateFontSize('base');
    if (fontSize === 'base') updateFontSize('lg');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'lg') updateFontSize('base');
    if (fontSize === 'base') updateFontSize('sm');
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={decreaseFontSize}
        disabled={fontSize === 'sm'}
        className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50"
        aria-label="Decrease font size"
      >
        <Minus className="w-3 h-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-white/80 hover:text-white hover:bg-white/10 px-2"
        aria-label={`Current font size: ${fontSize}`}
      >
        <Type className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={increaseFontSize}
        disabled={fontSize === 'lg'}
        className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50"
        aria-label="Increase font size"
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};