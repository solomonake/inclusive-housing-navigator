import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SkipLink } from '@/components/accessibility/SkipLink'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inclusive Housing Navigator',
  description: 'AI-powered housing copilot for international & rural students with D&I scoring',
  keywords: ['housing', 'accessibility', 'inclusivity', 'students', 'AI', 'diversity'],
  authors: [{ name: 'VTHacks Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Inclusive Housing Navigator',
    description: 'AI-powered housing copilot for international & rural students',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inclusive Housing Navigator',
    description: 'AI-powered housing copilot for international & rural students',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=OpenDyslexic:wght@400;700&display=swap" 
        />
      </head>
      <body data-theme="light" className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
        <SkipLink href="#main">Skip to main content</SkipLink>
        <SkipLink href="#navigation">Skip to navigation</SkipLink>
        
        <div className="min-h-screen" style={{ fontFamily: 'system-ui, sans-serif' }}>
          <main id="main" className="flex-1">
            {children}
          </main>

          <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-[var(--fg)]">Inclusive Housing Navigator</h3>
                  <p className="text-sm text-[var(--fg)]">
                    AI-powered housing copilot for international & rural students with D&I scoring.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-[var(--fg)]">Features</h4>
                  <ul className="space-y-2 text-sm text-[var(--fg)]">
                    <li>D&I Scoring</li>
                    <li>Accessibility Analysis</li>
                    <li>Lease QA</li>
                    <li>Auto Visualization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-[var(--fg)]">Accessibility</h4>
                  <ul className="space-y-2 text-sm text-[var(--fg)]">
                    <li>WCAG 2.2 AA Compliant</li>
                    <li>Keyboard Navigation</li>
                    <li>Screen Reader Support</li>
                    <li>Dyslexia-Friendly Fonts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-[var(--fg)]">Built For</h4>
                  <ul className="space-y-2 text-sm text-[var(--fg)]">
                    <li>VTHacks 2024</li>
                    <li>Deloitte AI Agent Track</li>
                    <li>Databricks ML Track</li>
                    <li>Capital One Financial Hack</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-[var(--border)] mt-8 pt-8 text-center text-sm text-[var(--fg)]">
                <p>&copy; 2024 Inclusive Housing Navigator. Built with ❤️ for accessibility and inclusion.</p>
                <p className="mt-2">
                  <strong>Bias & Limitations:</strong> This tool provides estimates based on available data. 
                  Always verify information with landlords and consider your individual needs. 
                  D&I scores are algorithmic approximations and should not replace personal judgment.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}