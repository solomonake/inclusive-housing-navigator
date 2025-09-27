'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className 
}) => {
  return (
    <a
      href={href}
      className={cn(
        'skip-link',
        'sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2',
        'z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md',
        'text-sm font-medium shadow-lg',
        className
      )}
      tabIndex={0}
    >
      {children}
    </a>
  );
};
