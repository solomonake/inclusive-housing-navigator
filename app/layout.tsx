import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/navigation/NavBar'
import { Footer } from '@/components/navigation/Footer'
import { CompareBar } from '@/components/ui/CompareBar'

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
      <body className="min-h-screen bg-white text-gray-900">
        <div className="min-h-screen flex flex-col">
          <a 
            href="#main" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Skip to main content
          </a>
          
          <NavBar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <CompareBar />
          <Footer />
        </div>
      </body>
    </html>
  )
}