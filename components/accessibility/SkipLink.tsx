'use client';

import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="visually-hidden focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2 rounded-md text-sm font-medium shadow-lg focus-ring"
    >
      {children}
    </a>
  );
};
