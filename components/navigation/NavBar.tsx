'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { 
  Building2, 
  Home, 
  FileText, 
  BarChart3, 
  Globe, 
  Trees
} from "lucide-react";

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Listings', href: '/listings', icon: Building2 },
  { name: 'Lease QA', href: '/lease', icon: FileText },
  ...(FEATURE_FLAGS.SHOW_CHARTS ? [{ name: 'Charts', href: '/charts', icon: BarChart3 }] : []),
  ...(FEATURE_FLAGS.SHOW_INTERNATIONAL ? [{ name: 'International', href: '/international', icon: Globe }] : []),
  ...(FEATURE_FLAGS.SHOW_RURAL ? [{ name: 'Rural', href: '/rural', icon: Trees }] : []),
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Building2 className="h-6 w-6" aria-hidden="true" />
            <span>IH Navigator</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    text-sm font-medium transition-colors hover:text-indigo-600
                    ${isActive 
                      ? 'text-indigo-600' 
                      : 'text-gray-700'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}