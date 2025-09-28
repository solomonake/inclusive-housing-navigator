'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Home, 
  FileText, 
  BarChart3, 
  Globe, 
  Trees, 
  Info
} from "lucide-react";

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Listings', href: '/listings', icon: Building2 },
  { name: 'Lease QA', href: '/lease', icon: FileText },
  { name: 'Charts', href: '/charts', icon: BarChart3 },
  { name: 'International', href: '/international', icon: Globe },
  { name: 'Rural', href: '/rural', icon: Trees },
  { name: 'About', href: '/about', icon: Info },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 glass">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-bold text-[var(--fg)] hover:text-[var(--primary)] transition-colors focus-ring rounded-lg p-1"
          >
            <Building2 className="h-6 w-6" aria-hidden="true" />
            <span>IH Navigator</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring
                    ${isActive 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)]'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}