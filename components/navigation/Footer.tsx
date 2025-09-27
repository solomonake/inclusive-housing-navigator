import React from 'react';
import Link from 'next/link';
import { Building2, Heart, Github, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-card border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span>IH Navigator</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              AI-powered housing copilot for international & rural students with transparent D&I scoring, 
              accessibility analysis, and inclusive design principles.
            </p>
            <div className="flex items-center space-x-2 text-white/60 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for accessibility and inclusion</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Features</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/listings" className="hover:text-white transition-colors">
                  D&I Scoring
                </Link>
              </li>
              <li>
                <Link href="/listings" className="hover:text-white transition-colors">
                  Accessibility Analysis
                </Link>
              </li>
              <li>
                <Link href="/lease" className="hover:text-white transition-colors">
                  Lease QA
                </Link>
              </li>
              <li>
                <Link href="/charts" className="hover:text-white transition-colors">
                  Auto Visualization
                </Link>
              </li>
            </ul>
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Accessibility</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>WCAG 2.2 AA Compliant</li>
              <li>Keyboard Navigation</li>
              <li>Screen Reader Support</li>
              <li>Dyslexia-Friendly Fonts</li>
              <li>High Contrast Mode</li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm">Connect</h4>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-white/70 hover:text-white" />
              </a>
              <a
                href="https://twitter.com"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-white/70 hover:text-white" />
              </a>
              <a
                href="mailto:support@ihnavigator.com"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-white/70 hover:text-white" />
              </a>
            </div>
            <div className="text-xs text-white/50 space-y-1">
              <p>Built at VTHacks 2025</p>
              <p>Deloitte AI Agent Track</p>
              <p>Databricks ML Track</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm text-center md:text-left">
              &copy; 2025 Inclusive Housing Navigator. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-white/60 hover:text-white transition-colors">
                Accessibility Statement
              </Link>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-white/50 text-center">
              <strong>Bias & Limitations:</strong> This tool provides estimates based on available data. 
              Always verify information with landlords and consider your individual needs. 
              D&I scores are algorithmic approximations and should not replace personal judgment.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
