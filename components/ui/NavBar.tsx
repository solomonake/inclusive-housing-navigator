'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLogo } from './AppLogo';
import { ThemeToggle } from './ThemeToggle';
import { FontSizeToggle } from '@/components/accessibility/FontSizeToggle';

export const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--bg))] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--bg))]/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <AppLogo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
            >
              Home
            </Link>
            <Link 
              href="/listings" 
              className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
            >
              Listings
            </Link>
            <Link 
              href="/lease" 
              className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
            >
              Lease QA
            </Link>
            <Link 
              href="/charts" 
              className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
            >
              Charts
            </Link>
            <Link 
              href="/international" 
              className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
            >
              🌍 International
            </Link>
            <Link 
              href="/rural" 
              className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
            >
              🌾 Rural
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
            >
              About
            </Link>
          </div>

          {/* Accessibility Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <FontSizeToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden btn-secondary"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[hsl(var(--border))] py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/listings" 
                className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Listings
              </Link>
              <Link 
                href="/lease" 
                className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Lease QA
              </Link>
              <Link 
                href="/charts" 
                className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Charts
              </Link>
              <Link 
                href="/international" 
                className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                🌍 International
              </Link>
              <Link 
                href="/rural" 
                className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                🌾 Rural
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium text-[hsl(var(--fg))] hover:text-[hsl(var(--accent))] transition-colors focus-ring rounded-md px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Accessibility Controls */}
              <div className="flex items-center space-x-2 pt-2 border-t border-[hsl(var(--border))]">
                <FontSizeToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
