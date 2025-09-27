'use client';

import React, { useEffect, useRef } from 'react';

interface AriaLiveProps {
  message: string;
  assertive?: boolean;
}

export const AriaLive: React.FC<AriaLiveProps> = ({ 
  message, 
  assertive = false
}) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && liveRegionRef.current) {
      // Clear previous content
      liveRegionRef.current.textContent = '';
      
      // Use requestAnimationFrame to ensure the clear is processed
      requestAnimationFrame(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = message;
        }
      });
    }
  }, [message]);

  return (
    <div
      ref={liveRegionRef}
      className="visually-hidden"
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      role="status"
      aria-relevant="additions text"
    />
  );
};
