import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] glass mt-auto">
      <div className="container-page py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and description */}
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-white">
                Inclusive Housing Navigator
              </p>
              <p className="text-xs text-white/60">
                Built at VTHacks 2025 • Inclusive by design
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/about" 
              className="text-white/60 hover:text-white transition-colors focus-ring rounded px-1 py-1"
            >
              About
            </Link>
            <span className="text-white/40">•</span>
            <Link 
              href="/accessibility" 
              className="text-white/60 hover:text-white transition-colors focus-ring rounded px-1 py-1"
            >
              Accessibility
            </Link>
            <span className="text-white/40">•</span>
            <span className="text-white/60">
              Bias & Limitations
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-white/50 text-center max-w-4xl mx-auto">
            <strong>Bias & Limitations:</strong> This tool provides estimates based on available data. 
            Always verify information with landlords and consider your individual needs. 
            D&I scores are algorithmic approximations and should not replace personal judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}