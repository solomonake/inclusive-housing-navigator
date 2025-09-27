import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SkipLink } from '@/components/accessibility/SkipLink'
import { NavBar } from '@/components/navigation/NavBar'
import { Footer } from '@/components/navigation/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inclusive Housing Navigator - Find Your Perfect Home',
  description: 'AI-powered housing copilot for international & rural students with D&I scoring, accessibility analysis, and inclusive design principles',
  keywords: ['housing', 'accessibility', 'inclusivity', 'students', 'AI', 'diversity', 'international', 'rural', 'university', 'affordable housing'],
  authors: [{ name: 'VTHacks Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Inclusive Housing Navigator - Find Your Perfect Home',
    description: 'AI-powered housing copilot for international & rural students with D&I scoring',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inclusive Housing Navigator',
    description: 'AI-powered housing copilot for international & rural students',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body data-theme="light" className="min-h-screen antialiased">
        <SkipLink href="#main">Skip to main content</SkipLink>
        <SkipLink href="#navigation">Skip to navigation</SkipLink>
        
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}