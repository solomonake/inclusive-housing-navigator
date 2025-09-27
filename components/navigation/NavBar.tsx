'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building2, FileText, BarChart3, Globe, Trees, Info, Sun, Moon, Type, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Inline ThemeToggle component to avoid module resolution issues
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-white/80 hover:text-white hover:bg-white/10"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </Button>
  );
};

// Inline FontSizeToggle component to avoid module resolution issues
const FontSizeToggle: React.FC = () => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  React.useEffect(() => {
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

export const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/listings', label: 'Listings', icon: Building2 },
    { href: '/lease', label: 'Lease QA', icon: FileText },
    { href: '/charts', label: 'Charts', icon: BarChart3 },
    { href: '/international', label: 'International', icon: Globe },
    { href: '/rural', label: 'Rural', icon: Trees },
    { href: '/about', label: 'About', icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-border/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block">IH Navigator</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2">
            <FontSizeToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-ring"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring ${
                      isActive(item.href)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Controls */}
              <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
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
