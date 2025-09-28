'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] glass">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-bold text-white hover:text-indigo-300 transition-colors focus-ring rounded-lg p-1"
          >
            <Building2 className="h-6 w-6" aria-hidden="true" />
            <span>IH Navigator</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 mr-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors focus-ring
                    ${isActive 
                      ? 'bg-indigo-500 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}