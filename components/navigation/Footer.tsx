import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/50 glass">
      <div className="container-page py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and description */}
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-[var(--fg)]">
                Inclusive Housing Navigator
              </p>
              <p className="text-xs text-[var(--fg-muted)]">
                Built at VTHacks 2025 • Inclusive by design
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/about" 
              className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors focus-ring rounded px-1 py-1"
            >
              About
            </Link>
            <span className="text-[var(--fg-muted)]">•</span>
            <Link 
              href="/accessibility" 
              className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors focus-ring rounded px-1 py-1"
            >
              Accessibility
            </Link>
            <span className="text-[var(--fg-muted)]">•</span>
            <span className="text-[var(--fg-muted)]">
              Bias & Limitations
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--fg-muted)] text-center max-w-4xl mx-auto">
            <strong>Bias & Limitations:</strong> This tool provides estimates based on available data. 
            Always verify information with landlords and consider your individual needs. 
            D&I scores are algorithmic approximations and should not replace personal judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}